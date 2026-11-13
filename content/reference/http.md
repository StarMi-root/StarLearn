---
title: HTTP 方法与状态码速查
description: 请求方法、状态码、常用头、缓存、CORS、Cookie、认证与 HTTP/1.1/2/3 差异，一页查清。
category: reference
order: 3
tags: [HTTP, 状态码, 缓存, CORS, API]
updated: 2026-11-12
---

# HTTP 方法与状态码速查

HTTP 是 Web 的通信协议。理解方法语义、状态码和缓存头，能快速定位接口与浏览器问题。

## 请求方法

| 方法 | 语义 | 幂等 | 安全 |
|---|---|---|---|
| GET | 获取资源 | 是 | 是 |
| HEAD | 获取响应头 | 是 | 是 |
| POST | 创建/处理 | 否 | 否 |
| PUT | 整体替换 | 是 | 否 |
| PATCH | 部分更新 | 否 | 否 |
| DELETE | 删除 | 是 | 否 |
| OPTIONS | 查询支持方法/CORS 预检 | 是 | 是 |

幂等指重复执行效果相同。GET 不应产生副作用；实际权限与语义要由服务端实现。

## 状态码

### 2xx 成功

- **200 OK**：请求成功。
- **201 Created**：资源创建成功，通常带 `Location`。
- **202 Accepted**：已接受，异步处理。
- **204 No Content**：成功但无响应体。

### 3xx 重定向

- **301 Moved Permanently**：永久重定向，浏览器与搜索引擎会缓存。
- **302 Found**：临时重定向。
- **304 Not Modified**：缓存仍有效。
- **307/308**：保持方法与请求体的重定向。

### 4xx 客户端错误

- **400 Bad Request**：请求格式错误。
- **401 Unauthorized**：未认证，需要登录。
- **403 Forbidden**：已认证但无权限。
- **404 Not Found**：资源不存在，也常用于隐藏资源。
- **405 Method Not Allowed**：方法不支持。
- **409 Conflict**：状态冲突，如重复创建。
- **422 Unprocessable Entity**：格式正确但语义校验失败。
- **429 Too Many Requests**：限流，配合 `Retry-After`。

### 5xx 服务端错误

- **500 Internal Server Error**：未处理异常。
- **501 Not Implemented**：不支持。
- **502 Bad Gateway**：网关到上游失败。
- **503 Service Unavailable**：服务不可用/过载。
- **504 Gateway Timeout**：上游超时。

## 常用请求头

```http
Host: learn.example.com
User-Agent: Mozilla/5.0
Accept: application/json
Accept-Language: zh-CN,zh;q=0.9
Content-Type: application/json
Authorization: Bearer <token>
Cookie: session=...
If-None-Match: "etag-value"
Origin: https://learn.example.com
```

## 常用响应头

```http
Content-Type: application/json; charset=utf-8
Content-Length: 1234
Cache-Control: public, max-age=3600
ETag: "abc123"
Location: /api/courses/42
Set-Cookie: session=...; HttpOnly; Secure; SameSite=Lax
Access-Control-Allow-Origin: https://learn.example.com
X-Content-Type-Options: nosniff
```

## 缓存

强缓存：

```http
Cache-Control: public, max-age=31536000, immutable
```

协商缓存：

```http
ETag: "v1"
If-None-Match: "v1"

Last-Modified: Wed, 12 Nov 2026 10:00:00 GMT
If-Modified-Since: Wed, 12 Nov 2026 10:00:00 GMT
```

- 带内容哈希的静态资源可长缓存。
- `index.html` 通常 `no-cache`，确保及时更新。
- API 数据根据业务设置 `private`、`no-store` 或短缓存。
- `immutable` 只用于内容永不变化的 URL。

## CORS

浏览器跨域请求需要服务器允许：

```http
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

注意：

- 带凭证时 `Allow-Origin` 不能为 `*`。
- 预检 `OPTIONS` 必须返回正确状态与头。
- CORS 是浏览器安全机制，不是服务端认证。
- 代理同源可以避免跨域，但不能替代权限控制。

## Cookie 与认证

```http
Set-Cookie: session=abc; HttpOnly; Secure; SameSite=Lax; Path=/
```

- `HttpOnly`：JS 无法读取，降低 XSS 窃取风险。
- `Secure`：仅 HTTPS 发送。
- `SameSite`：限制跨站发送，降低 CSRF。
- 敏感 Token 不建议放 localStorage。

常见认证：Session Cookie、Bearer Token、OAuth 2.0 / OIDC。Authorization 头不会自动携带，需要客户端设置。

## 内容类型

- `text/html; charset=utf-8`
- `application/json`
- `application/x-www-form-urlencoded`
- `multipart/form-data`（文件上传）
- `text/event-stream`（SSE）
- `application/octet-stream`

API 返回 JSON 时不要错写成 `text/html`，浏览器和客户端会按错误类型处理。

## HTTP 版本

- **HTTP/1.1**：文本协议，持久连接，存在队头阻塞。
- **HTTP/2**：二进制分帧、多路复用、头部压缩，通常基于 TLS。
- **HTTP/3**：基于 QUIC/UDP，减少队头阻塞，适合弱网。

## curl 排错

```bash
curl -i https://example.com
curl -v https://example.com/api/courses
curl -X POST https://example.com/api/courses \
  -H "Content-Type: application/json" \
  -d '{"title":"Rust"}'
curl -I https://example.com
curl --http2 -I https://example.com
```

- `-i` 显示响应头。
- `-I` 只发 HEAD。
- `-v` 显示连接与 TLS 细节。
- `-L` 跟随重定向。
- `-fsS` 失败时返回非零、静默但显示错误。

:::tip 状态码不是装饰
返回正确的状态码能让客户端、监控和缓存层正确工作。不要所有错误都返回 200 再在 JSON 里写 `success: false`。
:::

## 小练习

1. 用 curl 观察 301、304、404、500 的响应头。
2. 为一个静态资源设计缓存策略。
3. 配置一次 CORS 预检并解释每个响应头。

## 下一步

- [计算机网络](/hardware/network.html)
- [Nginx](/server/nginx.html)
