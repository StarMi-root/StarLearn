---
title: HTTPS、TLS 与 Certbot
description: 配置域名解析与 Let's Encrypt 证书，强制 HTTPS，理解 TLS、自动续期、HSTS 与常见证书错误。
category: server
order: 4
tags: [HTTPS, TLS, Certbot, 证书, Nginx]
updated: 2026-11-12
---

# HTTPS、TLS 与 Certbot

HTTPS 通过 TLS 加密浏览器与服务器之间的通信，防止窃听与篡改。现代站点不应只把 HTTPS 当作“可选优化”。

## 准备

1. 域名已注册并解析到服务器公网 IP。
2. 服务器开放 80 与 443。
3. Nginx 已能通过 HTTP 访问该域名。
4. 没有 CDN 或代理拦截验证请求。

```bash
dig +short learn.example.com
curl -I http://learn.example.com
```

域名解析未生效时，证书签发会失败。先解决 DNS，再申请证书。

## 安装 Certbot

```bash
sudo apt update
sudo apt install -y certbot python3-certbot-nginx
```

## 申请证书

```bash
sudo certbot --nginx -d learn.example.com -d www.learn.example.com
```

Certbot 会修改 Nginx 配置并自动设置续期。按提示选择是否重定向 HTTP 到 HTTPS。

只申请证书、不修改配置：

```bash
sudo certbot certonly --nginx -d learn.example.com
```

证书位置：

```text
/etc/letsencrypt/live/learn.example.com/fullchain.pem
/etc/letsencrypt/live/learn.example.com/privkey.pem
```

## Nginx 配置

```nginx
server {
    listen 80;
    server_name learn.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name learn.example.com;

    ssl_certificate     /etc/letsencrypt/live/learn.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/learn.example.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;

    root /var/www/techlearn;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto https;
        proxy_read_timeout 120s;
    }
}
```

`nginx -t` 通过后 reload。

## 自动续期

Let's Encrypt 证书有效期约 90 天。确认 timer：

```bash
systemctl list-timers | grep certbot
sudo certbot renew --dry-run
```

续期后需要重载 Nginx：

```bash
sudo systemctl status certbot.timer
```

大多数发行版的 Certbot 包会安装续期钩子。若没有，可在 `/etc/letsencrypt/renewal-hooks/deploy/` 添加：

```bash
#!/usr/bin/env bash
set -euo pipefail
systemctl reload nginx
```

并 `chmod +x`。

## HSTS 要谨慎

`Strict-Transport-Security` 告诉浏览器未来只走 HTTPS。错误配置可能让站点在证书失效时无法访问，且难以回滚。

建议：

1. 先确保 HTTPS 与所有子域稳定。
2. 从小 `max-age` 开始测试。
3. 再逐步增加，必要时加入 `includeSubDomains`。
4. 确认不再需要纯 HTTP 后再考虑 preload。

## 混合内容

HTTPS 页面加载 HTTP 资源会被浏览器阻止或警告：

```text
Mixed Content: The page at 'https://...' was loaded over HTTPS,
but requested an insecure image 'http://...'
```

修复方式：所有资源使用 `https://` 或相对协议，更新数据库中的旧 URL，检查 CSS/JS 中的硬编码地址。

## 常见错误

**证书申请失败**：DNS 未生效、80 端口被占用、防火墙拦截、CDN 代理。先用 `curl` 和 `dig` 验证。

**NET::ERR_CERT_COMMON_NAME_INVALID**：证书域名与访问域名不匹配。确认包含 `www` 或使用正确子域。

**证书过期**：续期任务失败。检查 `certbot renew --dry-run`、磁盘权限、Nginx 配置。

**重定向循环**：代理层与 Nginx 都做 HTTPS 跳转，或 `X-Forwarded-Proto` 未正确传递。查看浏览器网络面板的 301 链。

**API 跨域失败**：HTTPS 页面调用 HTTP 接口。统一协议，或通过同源代理。

:::warn 私钥保护
`privkey.pem` 权限应严格限制，只允许 root 或 Certbot 读取。不要把证书私钥提交到仓库或复制到公开目录。
:::

## 上线检查

- [ ] HTTP 自动跳转 HTTPS
- [ ] 证书链完整，浏览器无警告
- [ ] 证书自动续期 dry-run 成功
- [ ] HSTS 策略经过评估
- [ ] 页面无混合内容
- [ ] API 与静态资源都使用 HTTPS
- [ ] 证书到期监控已配置

## 小练习

1. 为一个测试域名申请证书并配置自动续期。
2. 用 SSL Labs 或 `openssl s_client` 检查 TLS 配置。
3. 故意引用一个 HTTP 图片，观察混合内容错误并修复。

## 下一步

- [GitHub Pages 部署](/server/github-pages.html)
- [CI/CD 自动化](/server/cicd.html)
- [监控与日志](/server/monitoring.html)
