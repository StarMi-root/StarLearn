---
title: 计算机网络与 HTTP
description: TCP/IP 分层、IP、TCP/UDP、DNS、HTTP/1.1/2/3、TLS、NAT 与常用排障工具，建立端到端网络观。
category: hardware
order: 3
tags: [网络, TCP/IP, HTTP, DNS, TLS]
updated: 2026-11-12
---

# 计算机网络与 HTTP

一次网页访问背后，涉及 DNS、路由、TCP/UDP、TLS 和应用协议。理解这些层次，才能快速定位“到底是网络、证书还是服务的问题”。

![Web 与网络示意（开源图标：Simple Icons CC0 / Lucide ISC）](/static/img/icons/lu-globe.svg)

## 分层模型

```text
应用层    HTTP、DNS、SSH、SMTP
传输层    TCP、UDP、QUIC
网络层    IP、ICMP
链路层    以太网、Wi-Fi、ARP
物理层    光纤、铜缆、无线
```

OSI 七层是教学模型，TCP/IP 四层更贴近工程实践。

## IP 地址与子网

- IPv4：32 位，如 `192.168.1.10`。
- IPv6：128 位，如 `2001:db8::1`。
- 私有地址：`10.0.0.0/8`、`172.16.0.0/12`、`192.168.0.0/16`。
- 回环：`127.0.0.1` / `::1`。
- CIDR：`192.168.1.0/24` 表示前 24 位是网络前缀。

NAT 让多台内网设备共享公网 IP。云环境中还要理解安全组、路由表与私有网络。

## TCP 与 UDP

**TCP** 提供可靠、有序、面向连接的字节流：

- 三次握手建立连接。
- 确认与重传保证可靠。
- 流量控制与拥塞控制。
- 断开需要四次挥手。

**UDP** 无连接、不保证可靠，延迟低，适合 DNS、视频、游戏和 QUIC 的基础传输。

```bash
ss -tan
ss -tan state established
```

## 端口

端口标识主机上的服务。常见端口：

| 端口 | 服务 |
|---|---|
| 22 | SSH |
| 53 | DNS |
| 80 | HTTP |
| 443 | HTTPS |
| 3306 | MySQL |
| 5432 | PostgreSQL |
| 6379 | Redis |
| 8080 | 常见应用/代理 |

监听 `0.0.0.0` 表示所有网卡，`127.0.0.1` 只本机访问。数据库不应监听公网。

## DNS

DNS 把域名解析为 IP：

```text
浏览器缓存 → 系统缓存 → 递归解析器 → 根 → TLD → 权威服务器
```

记录类型：

- `A`：IPv4。
- `AAAA`：IPv6。
- `CNAME`：别名。
- `MX`：邮件。
- `TXT`：验证与策略。
- `NS`：权威服务器。

```bash
dig example.com
dig +short example.com
dig learn.example.com CNAME
```

TTL 影响变更传播。切域名或证书前，先确认解析已生效。

## HTTP

请求：

```http
GET /java/intro.html HTTP/1.1
Host: learn.example.com
Accept: text/html
```

响应：

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Cache-Control: max-age=3600

<!doctype html>...
```

常见方法：`GET` 查询、`POST` 创建、`PUT` 替换、`PATCH` 部分更新、`DELETE` 删除。方法语义与实际权限控制要分开。

状态码：

- `2xx` 成功。
- `3xx` 重定向。
- `4xx` 客户端错误。
- `5xx` 服务端错误。

详见 [HTTP 状态码手册](/reference/http.html)。

## HTTP/2 与 HTTP/3

- HTTP/2：二进制分帧、多路复用、头部压缩，减少连接数。
- HTTP/3：基于 QUIC/UDP，减少队头阻塞，改善弱网与移动网络。
- 服务器通常自动协商，Nginx 需明确启用 HTTP/2 或 HTTP/3 模块。

## TLS

TLS 提供加密、身份认证与完整性。HTTPS = HTTP over TLS。证书由 CA 签发，浏览器验证域名、有效期与信任链。

```bash
openssl s_client -connect example.com:443 -servername example.com
```

常见问题：证书过期、域名不匹配、链不完整、混合内容、系统时间错误。

## 延迟与带宽

- 延迟（RTT）决定请求往返时间。
- 带宽决定大文件传输速度。
- 建立连接、TLS 握手、DNS 查询都增加往返。
- CDN 把内容放到离用户更近的节点。
- 长连接、复用、压缩与缓存能显著改善体验。

```text
总时间 ≈ DNS + TCP + TLS + 请求排队 + 服务处理 + 传输 + 渲染
```

## 排障工具

```bash
ping -c 4 example.com
traceroute example.com
curl -v https://example.com
curl -I https://example.com
dig example.com
ss -tulpn
tcpdump -i any port 443
```

- `curl -v` 看请求头、响应头与 TLS。
- `ss` 看监听与连接状态。
- `tcpdump` 抓包，需权限，注意隐私。
- 浏览器 DevTools Network 看 DNS、连接、TTFB 与下载。

## 常见故障

**域名不解析**：DNS 记录错误、TTL 未过期、解析器缓存。用 `dig @8.8.8.8` 对比。

**连接超时**：安全组、防火墙、路由、服务未监听。

**连接被拒绝**：目标端口没有服务或只监听 127.0.0.1。

**502/504**：Nginx 到后端失败或超时，不是浏览器网络问题。

**HTTPS 证书错误**：证书域名、链、时间或 SNI 配置。

:::tip 分层排查
从下往上：能否 ping、端口是否通、TLS 是否成功、HTTP 返回什么、应用日志说什么。每层用对应工具验证，不要混在一起猜。
:::

## 小练习

1. 用 `dig`、`curl -v`、`ss` 分析一次网站访问链路。
2. 解释 TCP 与 UDP 的适用场景。
3. 用浏览器 DevTools 记录一个页面的 DNS、TCP、TLS 与 TTFB 时间。

## 下一步

- [HTTP 状态码手册](/reference/http.html)
- [Nginx](/server/nginx.html)
- [HTTPS](/server/https.html)
