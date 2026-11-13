---
title: Prompt、RAG 与本地知识库
description: 从提示词结构到检索增强生成，理解分块、嵌入、向量检索、引用与评估，搭建自己的本地知识库。
category: ai
order: 5
tags: [RAG, Prompt, 向量检索, 知识库]
updated: 2026-11-12
---

# Prompt、RAG 与本地知识库

大模型的知识停留在训练数据中，无法自动知道你的私有文档、最新规范或内部 API。RAG（Retrieval-Augmented Generation，检索增强生成）通过在回答前检索相关资料，把“外部知识”放进上下文。

## RAG 的基本流程

```text
文档 → 清洗 → 分块 → 向量化 → 向量库
                                  │
用户问题 → 向量化 → 检索 Top-K ──┘
                        │
                  拼进 Prompt → 大模型 → 回答 + 引用
```

关键环节：

1. **文档解析**：PDF、Markdown、HTML、数据库。
2. **分块**：按标题、段落或固定长度切分。
3. **嵌入**：用 embedding 模型把文本转成向量。
4. **索引**：存入向量数据库，建立相似度检索。
5. **召回与重排**：取 Top-K，必要时用 rerank 模型精排。
6. **生成**：把资料与问题一起交给大模型，要求引用来源。

## Prompt 结构

一个可用的 RAG Prompt：

```text
你是StarLearn的技术助教。请只根据下面的资料回答，不要编造。
如果资料不足，明确说“资料中没有足够信息”。

资料：
[1] {chunk_1}
[2] {chunk_2}
[3] {chunk_3}

用户问题：{question}

要求：
1. 用中文回答，先给结论，再给步骤。
2. 引用资料编号，例如 [1]。
3. 给出可执行命令或代码时，说明适用环境。
```

明确“资料不足时怎么办”非常重要，否则模型会用训练记忆补齐，产生幻觉。

## 分块策略

| 策略 | 优点 | 缺点 |
|---|---|---|
| 固定长度 | 简单 | 容易切断语义 |
| 按段落 | 语义完整 | 长短不一 |
| 按标题层级 | 结构清晰 | 依赖文档质量 |
| 重叠窗口 | 减少断点丢失 | 索引变大 |

推荐从“按标题 + 段落，300–800 字，重叠 50–100 字”开始，再根据召回效果调整。代码文档要保留函数签名与上下文。

## 本地技术栈

一个轻量本地方案：

- **推理**：llama.cpp / Ollama。
- **Embedding**：`nomic-embed-text`、`bge-m3` 等。
- **向量库**：Chroma、Qdrant、LanceDB、SQLite + 向量扩展。
- **后端**：FastAPI / ASP.NET Core / Node.js。
- **前端**：本站或任意聊天界面。

示意代码（以 Chroma 为例，具体 API 以版本文档为准）：

```python
import chromadb

client = chromadb.PersistentClient(path="./data/chroma")
collection = client.get_or_create_collection("starlearn-docs")

collection.add(
    ids=["doc-1", "doc-2"],
    documents=[
        "llama.cpp 使用 GGUF 格式，可通过 llama-server 提供 API。",
        "Nginx 反向代理使用 proxy_pass 指令。",
    ],
    metadatas=[
        {"source": "ai/llama-cpp.md"},
        {"source": "server/nginx.md"},
    ],
)

result = collection.query(query_texts=["如何在本地启动模型 API？"], n_results=2)
print(result["documents"])
```

生产环境应使用专门的 embedding 模型，而不是直接把原文当查询向量。

## 检索质量

RAG 效果差，通常不是模型不行，而是检索没找到正确资料。

- **查询改写**：把口语问题改写成多个检索查询。
- **混合检索**：关键词 BM25 + 向量相似度。
- **元数据过滤**：按产品、版本、权限过滤。
- **重排**：用小模型对 Top-50 精排到 Top-5。
- **去重**：避免同一段落重复占满上下文。
- **引用**：每个片段带来源与行号。

## 评估

建立小评测集：

```text
问题 | 期望资料 | 是否召回 | 回答正确 | 引用正确 | 延迟
```

至少跟踪：

- Recall@K：正确资料是否出现在前 K 个结果。
- 答案正确率。
- 引用准确率。
- 无答案问题的拒答率。
- 平均延迟与 Token 成本。

不要只看几个演示问题就宣布成功。

## 安全与权限

- 文档入库前做敏感信息脱敏。
- 按用户权限过滤检索结果，不能只靠 Prompt 约束。
- 防止提示词注入：检索到的文档可能包含“忽略以上指令”等恶意文本。
- 输出转义，避免 XSS 与命令注入。
- 记录访问日志与数据来源。

:::danger 权限不是提示词
“请不要告诉用户机密信息”不是权限控制。必须在检索层与数据层做访问控制，模型无法可靠地保守秘密。
:::

## 从零搭建的最小步骤

1. 选 20 篇你真正需要的文档。
2. 转成 Markdown/纯文本，清洗页眉页脚。
3. 分块并保留标题路径。
4. 用本地 embedding 模型生成向量。
5. 实现 Top-K 检索与 Prompt 拼接。
6. 用 30 个问题评估。
7. 再考虑重排、混合检索和 UI。

## 下一步

- [AI 学习助手接入指南](/ai/assistant.html)
- [llama.cpp 本地 API](/ai/llama-cpp.html)
- [实战：本地 AI 聊天](/projects/local-ai-chat.html)
