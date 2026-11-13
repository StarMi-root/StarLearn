---
title: llama.cpp 入门与编译
description: 从源码编译 llama.cpp，下载 GGUF 模型，运行命令行推理，并启动 OpenAI 兼容的本地 API。
category: ai
order: 2
tags: [llama.cpp, GGUF, 本地推理, API]
updated: 2026-11-12
---

# llama.cpp 入门与编译

llama.cpp 是用 C/C++ 实现的高效大模型推理引擎，支持 CPU、CUDA、Metal、Vulkan 等后端，围绕 GGUF 模型格式形成了完整的本地推理生态。

## 它能做什么

- 在普通笔记本或服务器上运行 7B–70B 量化模型。
- 提供 `llama-cli` 命令行对话与补全。
- 提供 `llama-server`，兼容 OpenAI Chat Completions API。
- 提供 `llama-bench` 性能测试与 `llama-quantize` 量化工具。
- 支持 LoRA、视觉模型、嵌入模型等扩展。

## 编译

### Linux / macOS

```bash
git clone https://github.com/ggml-org/llama.cpp
cd llama.cpp

cmake -B build
cmake --build build --config Release -j"$(nproc)"
```

编译完成后，可执行文件通常在 `build/bin/`：

```bash
ls build/bin | head
./build/bin/llama-cli --version
```

### 启用 CUDA

需要 NVIDIA 驱动与 CUDA Toolkit：

```bash
cmake -B build -DGGML_CUDA=ON
cmake --build build --config Release -j"$(nproc)"
```

### macOS Metal

```bash
cmake -B build -DGGML_METAL=ON
cmake --build build --config Release -j"$(sysctl -n hw.ncpu)"
```

macOS 通常默认启用 Metal。Apple Silicon 的统一内存对本地推理很友好。

### Windows

安装 CMake、Visual Studio Build Tools 与 CUDA（可选），在 Developer PowerShell 中：

```powershell
cmake -B build -DGGML_CUDA=ON
cmake --build build --config Release -j 8
```

也可以直接下载官方 Release 预编译包，先跑通再自行编译。

## 下载 GGUF 模型

GGUF 是 llama.cpp 生态常用的模型格式。可以从 Hugging Face 搜索模型，选择适合硬件的量化版本。

```bash
mkdir -p models
# 以某个 7B 模型的 Q4_K_M 为例，实际文件名以模型仓库为准
curl -L -o models/model.gguf \
  "https://huggingface.co/<repo>/resolve/main/<model-Q4_K_M.gguf>"
```

使用 Hugging Face CLI 更方便：

```bash
pip install -U huggingface_hub
huggingface-cli download <repo> <model-Q4_K_M.gguf> --local-dir models
```

模型越大、量化越低，对硬件要求越低，但质量也会下降。7B–14B 模型在 16 GB 内存的机器上通常可以运行。

## 命令行推理

```bash
./build/bin/llama-cli \
  -m models/model.gguf \
  -p "用三句话解释什么是 RAG" \
  -n 256 \
  -c 4096 \
  --temp 0.7
```

常用参数：

| 参数 | 说明 |
|---|---|
| `-m` | 模型文件 |
| `-p` | 提示词 |
| `-n` | 最大生成 Token 数 |
| `-c` | 上下文窗口 |
| `-ngl` | 卸载到 GPU 的层数 |
| `--temp` | 温度 |
| `-t` | CPU 线程数 |
| `--repeat-penalty` | 重复惩罚 |

GPU 显存足够时，把 `-ngl` 调大：

```bash
./build/bin/llama-cli -m models/model.gguf -ngl 99 -p "你好" -n 128
```

`-ngl 99` 表示尽量把所有层放到 GPU。显存不足会回退或报错，需要逐步调整。

## 交互式对话

```bash
./build/bin/llama-cli -m models/model.gguf -cnv -c 4096
```

`-cnv` 进入对话模式，输入 `/exit` 退出。历史对话会占用上下文，长对话需要清理或摘要。

## 启动本地 API

```bash
./build/bin/llama-server \
  -m models/model.gguf \
  --host 127.0.0.1 \
  --port 8080 \
  -c 4096 \
  -ngl 99
```

服务启动后，OpenAI 兼容端点通常位于：

```text
http://127.0.0.1:8080/v1/chat/completions
```

测试：

```bash
curl http://127.0.0.1:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "local",
    "messages": [
      {"role": "user", "content": "用一句话解释 GGUF"}
    ],
    "temperature": 0.3
  }'
```

## 性能测试

```bash
./build/bin/llama-bench -m models/model.gguf -p 512 -n 128
```

关注：

- **Prompt processing**：处理输入的速度。
- **Token generation**：生成速度，通常以 tokens/s 计。
- **显存/内存占用**：是否触发交换。
- **上下文长度对性能的影响**：长上下文会变慢。

## 常见问题

**编译时报找不到 CUDA**：确认 `nvcc --version`，安装匹配的 CUDA Toolkit，并检查 CMake 是否找到 CUDA。

**模型加载失败**：确认文件完整、格式为 GGUF、没有下载成 HTML 错误页。用 `ls -lh` 和校验和检查。

**速度很慢**：检查是否使用了 GPU、`-ngl` 是否生效、是否发生内存交换、线程数是否合理。

**端口无法访问**：`--host 0.0.0.0` 才监听外部网卡；公网暴露前必须加认证与防火墙。

:::warn 安全提醒
llama-server 默认不适合直接暴露到公网。至少放在 Nginx 后面，增加认证、限流和 HTTPS；更好的做法是只监听 127.0.0.1，由后端代理调用。
:::

## 下一步

- [GGUF 量化与显存估算](/ai/quantization.html)
- [DeepSeek Harness](/ai/deepseek-harness.html)
- [本地 RAG 知识库](/ai/rag.html)
