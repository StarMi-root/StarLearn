---
title: 实战：本地 AI 学习聊天
description: 用前端聊天界面 + Python 代理 + llama.cpp/DeepSeek API 构建带页面上下文、历史记录与安全边界的 AI 学习助手。
category: projects
order: 5
tags: [AI, 聊天, llama.cpp, Python, 项目]
updated: 2026-11-12
---

# 实战：本地 AI 学习聊天

本站的 AI 学习助手就是这样一个项目：浏览器只负责界面与历史，服务端代理持有模型密钥，模型可以是本地 llama.cpp，也可以是 DeepSeek/OpenAI 兼容 API。

![AI 助手示意（开源图标：Simple Icons CC0 / Lucide ISC）](/static/img/icons/lu-brain-circuit.svg)

## 架构

```text
浏览器聊天 UI
   │  POST /api/chat（同源）
   ▼
Python AI Proxy
   │  注入系统提示 + 限流 + 超时
   ▼
llama.cpp / DeepSeek / OpenAI / Ollama
```

关键原则：

- API Key 只在服务端环境变量。
- 浏览器不直接调用上游模型。
- 代理限制请求大小、历史长度、输出长度与速率。
- 默认离线知识库可用，配置模型后增强。

## 项目结构

```text
techlearn/
├── static/js/ai.js
├── server/ai_proxy.py
├── data/search-index.json
└── .env.example
```

## 1. 服务端代理

核心是接收消息、校验、调用上游、返回统一格式：

```python
import json
import os
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

API_BASE = os.environ.get("AI_API_BASE", "https://api.deepseek.com/v1").rstrip("/")
API_KEY = os.environ.get("AI_API_KEY", "")
MODEL = os.environ.get("AI_MODEL", "deepseek-chat")
SYSTEM_PROMPT = "你是StarLearn的技术助教。用中文回答，先给结论，再给步骤；不确定时明确说明。"


def chat(messages: list[dict]) -> str:
    payload = json.dumps({
        "model": MODEL,
        "messages": [{"role": "system", "content": SYSTEM_PROMPT}, *messages],
        "temperature": 0.3,
        "max_tokens": 1200,
    }).encode("utf-8")

    request = urllib.request.Request(
        f"{API_BASE}/chat/completions",
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {API_KEY}",
        },
        method="POST",
    )

    with urllib.request.urlopen(request, timeout=90) as response:
        data = json.loads(response.read())
    return data["choices"][0]["message"]["content"]
```

实际实现还需要：

- 限制 `messages` 数量与总字符数。
- 校验 role 只能是 system/user/assistant。
- 处理上游 401/429/5xx 与超时。
- 简单内存限流（按 IP 与时间窗口）。
- 只返回错误摘要，不泄露密钥与堆栈。
- 静态文件服务与 `SITE_DIR`。

完整代码见仓库 `server/ai_proxy.py`。

## 2. 前端聊天

```javascript
const history = [];

async function send(message) {
  history.push({ role: "user", content: message });
  renderMessage("user", message);

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: history.slice(-10),
      page: {
        title: document.body.dataset.pageTitle,
        url: location.pathname,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `请求失败（${response.status}）`);
  }

  const data = await response.json();
  history.push({ role: "assistant", content: data.reply });
  renderMessage("assistant", data.reply);
}
```

注意：

- 历史只保留最近 N 条，避免上下文与费用失控。
- 页面上下文只传标题与路径，不传整页 HTML。
- 渲染 Markdown 时必须转义 HTML，避免 XSS。
- 用户输入与模型输出都不可信。

## 3. 页面上下文

在文章页注入：

```html
<body data-page-title="C# 异步编程">
```

发送时附带：

```json
{
  "page": {
    "title": "C# 异步编程",
    "url": "/csharp/async.html"
  }
}
```

系统提示可以要求模型优先结合当前页面回答。不要自动把整篇文章塞进上下文，否则长文会超出窗口并增加成本。

## 4. 离线知识库

没有配置模型时，前端读取 `search-index.json`，按关键词匹配标题、描述与正文片段，返回相关文章链接。

```javascript
function searchLocal(query) {
  const keywords = query.toLowerCase().split(/\s+/).filter(Boolean);
  return index
    .map((item) => {
      const text = `${item.title} ${item.description} ${item.text}`.toLowerCase();
      const score = keywords.reduce((sum, word) => sum + (text.includes(word) ? 1 : 0), 0);
      return { ...item, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
```

离线模式不是大模型，不会生成新内容，但能快速定位本站资料，且不产生费用与隐私风险。

## 5. 流式输出

非流式实现简单，但用户要等完整回答。升级为 SSE：

```javascript
const response = await fetch("/api/chat/stream", { ... });
const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  appendToBubble(decoder.decode(value, { stream: true }));
}
```

服务端需要转发上游的 `data:` 事件，并处理断线与取消。流式输出涉及背压、缓冲与代理超时，先完成非流式版本再升级。

## 6. 安全与成本

- 同源部署，避免 CORS 与密钥暴露。
- 代理层认证（登录/邀请码）优先于公开限流。
- 限制 `max_tokens`、历史条数、请求体大小。
- 为上游设置超时与重试上限。
- 记录请求量、Token 消耗与错误率，不记录敏感正文。
- 对用户输入做长度与内容校验。
- 防止提示词注入：页面内容与检索文档都可能包含恶意指令。
- 公开站点设置每日额度与告警。

## 7. 部署

```bash
python3 server/ai_proxy.py
```

环境变量：

```bash
export AI_API_BASE="https://api.deepseek.com/v1"
export AI_API_KEY="sk-..."
export AI_MODEL="deepseek-chat"
export SITE_DIR="./dist"
export HOST="127.0.0.1"
export PORT="8080"
```

Nginx 反向代理 `/api/`，静态文件可直接由 Nginx 托管。使用 systemd 托管代理进程，参考 [systemd](/linux/systemd.html)。

## 验收标准

- [ ] 未配置 API 时离线检索可用
- [ ] 配置后能多轮对话
- [ ] API Key 不出现在浏览器与构建产物
- [ ] 401/429/超时有可读提示
- [ ] 请求体与历史长度受限
- [ ] 页面上下文能带入当前文章
- [ ] 移动端聊天可用
- [ ] 有基本限流与日志

## 扩展方向

- SSE 流式输出。
- 文章引用与跳转。
- RAG 向量检索。
- 语音输入。
- 学习记录与错题本。
- 多模型切换与成本统计。

:::danger 不要公开裸代理
未认证的 AI 代理会被滥用，产生高额账单或泄露系统提示。公开部署前必须加认证、限流、额度与监控。
:::

## 相关教程

- [AI 学习助手接入](/ai/assistant.html)
- [RAG 与本地知识库](/ai/rag.html)
- [llama.cpp](/ai/llama-cpp.html)
- [Nginx](/server/nginx.html)
