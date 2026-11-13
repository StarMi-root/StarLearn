---
title: AI 全栈学习地图：从基础到 Agent 工程
description: 覆盖 AI 基础、机器学习框架、LangChain、AI Agent、本地模型、编程协作工具与自动化测试的完整学习地图。
category: ai
order: 8
tags: [AI, Agent, LangChain, 本地大模型]
updated: 2026-11-12
---

# AI 全栈学习地图：从基础到 Agent 工程

AI 学习最容易陷入“工具追新”：今天学 Agent，明天换框架。更稳的路径是先理解模型与机器学习，再掌握一个训练框架和一两种应用框架，最后进入 Agent、RAG 与本地部署。工具会变，评估、数据和工程闭环不会变。

![AI / 智能开发图标（Simple Icons CC0 / Lucide ISC）](/static/img/icons/lu-brain-circuit.svg)

:::tip 先选一条主线
不要同时开五门课。先按下面的顺序完成一个最小项目，再把目录里的其他主题当作按需查阅的工具书。
:::

## 推荐学习顺序

1. **AI 基础与机器学习基础**：理解监督学习、神经网络、Token、上下文和幻觉，建立共同语言。
2. **AI 数学基础**：补线性代数、概率统计和梯度概念，能看懂损失函数与训练曲线。
3. **PyTorch 或 TensorFlow**：二选一完成一次微调或小型训练任务；Scikit-learn 用于经典模型基线。
4. **LangChain 与 NLP**：把模型、提示词、检索和工具连接起来，做一个可评估的问答应用。
5. **AI Agent 与本地模型**：学习工具调用、记忆和反馈循环，再用 Ollama 或 llama.cpp 本地运行模型。
6. **编程协作与自动化**：用 Codex、Claude Code、OpenCode 提升开发效率，用 Selenium/Playwright 守住回归测试。

## 全部主题

下表覆盖本方向在 StarLearn 课程目录中的全部主题。标记为“本站精讲”的可以直接进入中文教程；标记为“详细文档”的会打开对应技术的官方文档，适合补充语法细节和查阅示例。

| 主题 | 学什么 | 入口 |
| --- | --- | --- |
| AI Agent（智能体） | 理解规划、工具调用、记忆与反馈循环，构建可执行任务的智能体。 | [本站精讲](../ai/agents.html) |
| AI（人工智能）基础 | 从机器学习、神经网络到生成式 AI，建立完整概念地图。 | [本站精讲](../ai/intro.html) |
| AI 应用案例 | 文本、图像、视频与办公场景中的 AI 落地案例与提示词实践。 | [详细文档 ↗](https://github.com/openai/openai-cookbook) |
| Codex | OpenAI 编程协作工具，从代码生成到多文件任务的工作流。 | [本站精讲](../ai/coding-workflow.html) |
| Claude Code | 在终端中读写代码、运行测试并完成工程任务的 AI 编程助手。 | [本站精讲](../ai/coding-workflow.html) |
| OpenCode | 开源 AI 编程代理与终端工作流，支持多模型与自定义工具。 | [本站精讲](../ai/coding-workflow.html) |
| Vibe Coding | 以自然语言描述意图、快速迭代原型的 AI 辅助开发方式。 | [本站精讲](../ai/coding-workflow.html) |
| Skills（技能工作流） | 把可复用指令、工具和流程封装成技能，构建稳定工作流。 | [本站精讲](../ai/coding-workflow.html) |
| Ollama | 一条命令在本地运行和管理大模型，适合开发与私有部署。 | [详细文档 ↗](https://docs.ollama.com/) |
| Hermes Agent | 面向工具调用与任务执行的 Agent 框架与使用方式。 | [本站精讲](../ai/coding-workflow.html) |
| DeepSeek Harness | 围绕 DeepSeek 模型的编程 Agent 运行体系：工具、沙箱与反馈。 | [本站精讲](../ai/deepseek-harness.html) |
| Pi Agent | 轻量级个人 AI Agent 框架，连接模型、工具与本地环境。 | [本站精讲](../ai/coding-workflow.html) |
| AI 数学基础 | 线性代数、概率统计与微积分，理解模型训练与推理的数学直觉。 | [详细文档 ↗](https://mml-book.github.io/) |
| TensorFlow | Google 的深度学习框架，覆盖张量计算、训练与部署。 | [详细文档 ↗](https://www.tensorflow.org/tutorials) |
| PyTorch | 研究与应用广泛的深度学习框架，动态图与生态完善。 | [详细文档 ↗](https://pytorch.org/tutorials/) |
| Scikit-learn | 经典机器学习算法库，分类、回归、聚类与模型评估。 | [详细文档 ↗](https://scikit-learn.org/stable/getting_started.html) |
| 机器学习基础 | 监督学习、无监督学习、特征工程与模型评估入门。 | [详细文档 ↗](https://developers.google.com/machine-learning/crash-course) |
| LangChain | 连接模型、工具、检索与记忆，构建 LLM 应用和 Agent。 | [详细文档 ↗](https://python.langchain.com/docs/tutorials/) |
| 自然语言处理 (NLP) | 分词、向量化、文本分类、情感分析与大模型文本处理。 | [详细文档 ↗](https://huggingface.co/learn/nlp-course/chapter1/1) |
| OpenCV（计算机视觉） | 图像读取、特征检测、目标识别与计算机视觉应用。 | [详细文档 ↗](https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html) |
| Selenium | 浏览器自动化测试与网页操作，适合端到端测试。 | [详细文档 ↗](https://www.selenium.dev/documentation/) |
| Playwright | 跨浏览器自动化测试框架，支持多语言与可靠等待机制。 | [详细文档 ↗](https://playwright.dev/docs/intro) |

## 学完后的检查点

- 能解释 RAG 与微调分别解决什么问题。
- 能画出 Agent 的感知、规划、工具调用和记忆流程。
- 能在一个本地模型上完成部署、限流和成本评估。

:::note 学习建议
每学完一个主题，至少留下三样东西：一段可运行的代码、一条自己的解释、一个能复现的踩坑记录。把它们放进笔记或项目仓库，比“看过”更能证明掌握。
:::

