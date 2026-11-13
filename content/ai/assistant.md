---
title: AI 学习助手接入指南
description: 使用本站内置知识库、配置 OpenAI/DeepSeek/Ollama 接口，或用 server/ai_proxy.py 搭建安全的 Linux 代理。
category: ai
order: 6
tags: [AI 助手, API, 代理, 部署]
updated: 2026-11-12
---

# AI 学习助手接入指南

本站右下角的 AI 学习助手有两种模式：

1. **站内知识库（默认）**：无需密钥，检索本站文章并返回相关章节。
2. **接入大模型 API**：支持任何 OpenAI 兼容接口，回答问题、解释代码、出练习题。

## 快速使用

点击右下角“学习助手”，输入问题即可。也可以：

- 在文章右侧点击“问 AI 这一页”，自动带入当前页面上下文。
- 使用快捷按钮：解释核心概念、出练习题、下一步学什么、练手项目。
- 在设置中切换模式、配置接口。

## 配置 DeepSeek

```text
接口地址：https://api.deepseek.com/v1/chat/completions
API Key：sk-...
模型：deepseek-chat
```

## 配置 OpenAI

```text
接口地址：https://api.openai.com/v1/chat/completions
API Key：sk-...
模型：gpt-4o-mini
```

## 配置本地 Ollama

先启动 Ollama：

```bash
ollama serve
ollama pull llama3.1
```

设置：

```text
接口地址：http://localhost:11434/v1/chat/completions
API Key：留空
模型：llama3.1
```

如果页面通过 HTTPS 访问，而 Ollama 是 HTTP，浏览器可能因混合内容限制而阻止请求。建议使用本地代理或同一协议。

## 纯静态部署的限制

GitHub Pages 只能托管静态文件，不能保存 API Key，也不能代理请求。直接把 Key 填进浏览器有下列风险：

- Key 保存在 localStorage，任何能访问该浏览器的人都可能读取。
- 第三方接口可能限制 CORS，浏览器请求会失败。
- 无法做速率限制、审计与内容过滤。

因此：

- 个人学习可以使用自己的 Key，并设置额度上限。
- 公开站点应使用服务端代理，密钥只放在服务器环境变量中。
- 不要把 Key 写进仓库、构建产物或前端代码。

## 使用本站 Linux 代理

仓库提供 `server/ai_proxy.py`，零第三方依赖，既能托管 `dist/`，也能代理 AI 请求。

### 配置环境变量

```bash
export AI_API_BASE="https://api.deepseek.com/v1"
export AI_API_KEY="sk-..."
export AI_MODEL="deepseek-chat"
export SITE_DIR="./dist"
export HOST="127.0.0.1"
export PORT="8080"
```

### 启动

```bash
python3 server/ai_proxy.py
```

访问 `http://127.0.0.1:8080`。前端设置中选择“本站代理”预设，接口地址为 `/api/chat`。

### 健康检查

```bash
curl -s http://127.0.0.1:8080/api/health
```

返回示例：

```json
{
  "ok": true,
  "model": "deepseek-chat",
  "configured": true
}
```

### 请求格式

```bash
curl -s http://127.0.0.1:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "解释一下 C# 的 async/await"}
    ],
    "page": {
      "title": "C# 异步编程",
      "url": "https://example.com/csharp/async.html"
    }
  }'
```

返回：

```json
{
  "reply": "async/await 的核心是……"
}
```

代理会注入系统提示、限制请求大小、做简单限流，并把上游错误转换为可读消息。

## Nginx 反向代理

```nginx
server {
    listen 443 ssl;
    server_name learn.example.com;

    root /var/www/techlearn;
    index index.html;

    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 120s;
    }

    location / {
        try_files $uri $uri/ =404;
    }
}
```

如果代理同时托管静态文件，也可以把 `/` 直接转发给 8080。

## 自定义系统提示

在 `server/ai_proxy.py` 中修改 `SYSTEM_PROMPT`，让助手：

- 使用指定语气与语言；
- 只回答某门课程；
- 强制引用本站链接；
- 拒绝越权问题；
- 输出固定 JSON 结构。

系统提示不是安全边界。真正的权限、限流和内容审核应在代码层实现。

## 成本控制

- 设置模型提供商的月度预算与告警。
- 限制 `max_tokens`。
- 限制上下文长度与历史消息数量。
- 对重复问题做缓存。
- 监控每日请求量与异常峰值。
- 公开站点增加登录或邀请码。

## 常见问题

**浏览器报 CORS 错误**：接口不支持跨域。使用同源代理，或换支持 CORS 的服务。

**401 Unauthorized**：Key 错误、过期或没有模型权限。

**429 Too Many Requests**：触发速率限制，需退避重试或升级配额。

**回答很慢**：本地模型受硬件限制；云端检查网络与模型负载。流式输出能改善感知延迟。

**回答不基于本站内容**：确认页面上下文是否传入；知识库模式只做检索，不做生成。

:::warn 隐私提醒
不要向任何 AI 接口发送密码、私钥、身份证号、客户数据或未公开的商业机密。使用本地模型也不能自动免除数据合规责任。
:::

## 下一步

- [RAG 与本地知识库](/ai/rag.html)
- [服务器部署](/server/setup.html)
- [Nginx](/server/nginx.html)
