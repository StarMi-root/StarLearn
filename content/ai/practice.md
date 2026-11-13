---
title: AI 练习课
description: 用 5 道选择题和 3 个实践任务，检查 Token、量化、llama.cpp、RAG 与 Harness 的理解。
category: ai
order: 7
practice: true
tags: [AI, 练习, llama.cpp, RAG]
updated: 2026-11-12
---

# AI 练习课

AI 工程既要理解原理，也要能跑起来。先完成选择题，再动手搭一个最小可用系统。

:::quiz
question: "大模型的上下文窗口指什么？"
options:
  - "模型一次能处理的 Token 总数"
  - "硬盘容量"
  - "训练数据的总量"
  - "GPU 的核心数"
answer: A
explain: "上下文窗口包括系统提示、历史对话、参考资料和输出，超出后旧内容会被截断。"
:::

:::quiz
question: "llama.cpp 常用的模型文件格式是？"
options:
  - "GGUF"
  - "EXE"
  - "PSD"
  - "MP4"
answer: A
explain: "GGUF 是 llama.cpp 生态的模型格式，支持多种量化等级，如 Q4_K_M、Q5_K_M。"
:::

:::quiz
question: "Q4_K_M 相比 FP16 的主要取舍是？"
options:
  - "更低内存占用，可能损失少量质量"
  - "完全无损压缩"
  - "只提升速度，不改变质量"
  - "只能用于图像模型"
answer: A
explain: "量化降低权重精度，减少内存与带宽需求，但可能影响质量。需要针对任务评估。"
:::

:::quiz
question: "RAG 中 embedding 的作用是？"
options:
  - "把文本转成可用于相似度检索的向量"
  - "压缩图片"
  - "训练大模型"
  - "生成数据库表"
answer: A
explain: "Embedding 模型把文本映射到向量空间，使语义相近的文本距离更近，便于检索。"
:::

:::quiz
question: "AI 编程 Harness 的核心价值是什么？"
options:
  - "让模型能调用工具、执行验证并形成闭环"
  - "让模型参数变多"
  - "替代所有程序员"
  - "自动购买 GPU"
answer: A
explain: "Harness 提供工具、沙箱、上下文和反馈循环，让模型从聊天走向可验证的任务执行。"
:::

## 实践任务

### 任务 1：本地模型服务

1. 编译或下载 llama.cpp。
2. 下载一个 7B 左右的 Q4_K_M GGUF 模型。
3. 启动 `llama-server`，用 curl 调用 `/v1/chat/completions`。
4. 记录首 Token 延迟、生成速度与显存占用。

### 任务 2：最小 RAG

选择 10 篇本站 Markdown，完成：

- 分块并保留标题；
- 用 embedding 模型生成向量；
- 实现 Top-3 检索；
- 把检索结果拼进 Prompt；
- 要求回答带引用；
- 用 10 个问题评估召回与正确率。

### 任务 3：AI 学习助手接入

1. 启动 `server/ai_proxy.py`。
2. 配置 DeepSeek 或 Ollama。
3. 在浏览器中验证“问 AI 这一页”。
4. 测试超时、401、429 三种错误提示。
5. 写一份部署与成本控制清单。

## 自检清单

- 能否解释 Token、上下文和温度参数？
- 是否知道 Q4_K_M 与 Q8_0 的差异？
- 能否说出 RAG 的完整流程？
- 是否理解 Harness 与模型的分工？
- 是否知道为什么不能把 API Key 放进静态站点？

## 返回

- [AI 教程首页](/ai/index.html)
- [综合测验](/exercises.html)
