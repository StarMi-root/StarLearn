---
title: CPU 与 GPU：两种并行计算哲学
description: 从流水线、缓存与 SIMD 到 GPU 的 SIMT、显存带宽和 Tensor Core，理解 AI 推理为何依赖 GPU。
category: hardware
order: 4
tags: [CPU, GPU, 并行计算, SIMD, AI 推理]
updated: 2026-11-12
---

# CPU 与 GPU：两种并行计算哲学

CPU 擅长低延迟、复杂控制与通用任务；GPU 擅长高吞吐、大规模数据并行。理解两者的差异，才能判断什么时候该用 GPU、显存为什么是瓶颈。

## CPU：为延迟优化

现代 CPU 核心包含：

- 多级缓存（L1/L2/L3）。
- 指令流水线与乱序执行。
- 分支预测。
- SIMD 向量指令（SSE、AVX、NEON）。
- 同时多线程（SMT/Hyper-Threading）。

CPU 用大量晶体管换取单线程速度和复杂分支处理能力。服务器 CPU 通常核心数多、内存通道多、支持 ECC。

```bash
lscpu
lscpu | grep -E 'Model name|Socket|Core|Thread|MHz'
```

## 缓存与局部性

```text
寄存器 → L1 → L2 → L3 → 主存 → SSD
```

- 顺序访问通常比随机访问快。
- 小工作集能放进缓存，性能显著提升。
- 多核共享 L3，缓存一致性通过协议维护。
- 伪共享（false sharing）会让无关变量互相拖慢。

```c
// 每个线程写不同缓存行，避免伪共享
struct alignas(64) Counter {
    std::atomic<long> value{0};
};
```

## SIMD

SIMD 用一条指令处理多个数据：

```c
// 伪代码：一次处理 8 个 float
for (int i = 0; i < n; i += 8) {
    c[i] = a[i] + b[i];
}
```

编译器可自动向量化，也可使用 intrinsics。数据对齐、循环边界和分支会影响力。

## GPU：为吞吐优化

GPU 拥有大量简单核心，通过成千上万个线程隐藏内存延迟。NVIDIA 的编程模型是 SIMT：

- 线程组织为 warp（通常 32 线程）。
- 同一 warp 执行相同指令，分支发散会降低效率。
- 大量线程轮流执行，掩盖访存等待。
- 显存带宽通常远高于 CPU 内存带宽。

```text
CPU：少而强的核，复杂控制，低延迟
GPU：多而简单的核，数据并行，高吞吐
```

## 显存与带宽

GPU 性能不只看算力（FLOPS），还看显存容量与带宽。

- **容量**：模型权重、KV Cache、激活值和批数据都要放显存。
- **带宽**：大模型推理常受内存带宽限制。
- **PCIe**：CPU 与 GPU 传输；PCIe 4.0/5.0 影响加载与多卡通信。
- **NVLink**：高端 GPU 间高速互联。

本地大模型常见瓶颈不是算力，而是显存带宽和容量。

## Tensor Core 与 AI

Tensor Core 针对矩阵乘加优化，适合深度学习。混合精度（FP16/BF16/FP8）能显著提升吞吐。

但推理性能仍取决于：

- 模型参数量与量化等级。
- 上下文长度与 KV Cache。
- 批大小（batch size）。
- 输入输出长度。
- 框架与内核优化。
- 驱动、CUDA/cuDNN 版本。

## Roofline 直觉

```text
性能上限 = min(峰值算力, 内存带宽 × 算术强度)
```

算术强度 = 计算量 / 数据搬运量。矩阵乘法算术强度高，适合 GPU；逐元素操作往往受带宽限制。

这解释了两件事：

1. 大 batch 能提高 GPU 利用率，但增加显存与延迟。
2. 量化减少权重体积与带宽需求，因此能加速推理。

## 查看 GPU

```bash
nvidia-smi
nvidia-smi --query-gpu=name,memory.total,memory.used,utilization.gpu --format=csv
lspci | grep -i nvidia
nvcc --version
```

持续监控：

```bash
nvidia-smi dmon
watch -n 1 nvidia-smi
```

AMD 使用 `rocm-smi`。Apple Silicon 使用统一内存，CPU/GPU 共享带宽。

## 选型建议

| 场景 | 优先看 |
|---|---|
| 本地大模型 | 显存容量 > 带宽 > 算力 |
| 深度学习训练 | 显存、算力、互联、生态 |
| 视频转码 | 硬件编码器支持 |
| 通用服务器 | CPU 核心、内存通道、ECC |
| 边缘推理 | 功耗、体积、框架支持 |

不要只看 TFLOPS。模型能否装下、框架是否支持、驱动是否稳定同样重要。

## CPU 推理

没有 GPU 也能运行量化模型：

- 使用 llama.cpp 的 CPU 后端。
- 关注内存带宽、核心数与量化方式。
- 上下文越长，KV Cache 越大。
- 小模型 + 低量化适合轻量问答，但不适合复杂推理。

## 常见误区

- **GPU 利用率 100% 一定好**：可能是低效内核或数据搬运。
- **显存够就能跑长上下文**：KV Cache 会随上下文增长。
- **多卡一定更快**：通信开销、模型切分与批处理很关键。
- **游戏显卡不能做 AI**：可以，但显存与稳定性需评估。
- **CPU 完全不能跑大模型**：能跑，只是速度与规模受限。

:::tip 先测再买
用目标模型、目标上下文和目标并发做基准测试。记录 tokens/s、首 Token 延迟、峰值显存和功耗，再决定硬件。
:::

## 小练习

1. 用 `lscpu` 与 `nvidia-smi` 记录本机配置。
2. 解释为什么大模型推理常受显存带宽限制。
3. 用 llama.cpp 对比 CPU 与 GPU 的 tokens/s。

## 下一步

- [内存与存储](/hardware/memory.html)
- [llama.cpp](/ai/llama-cpp.html)
- [量化](/ai/quantization.html)
