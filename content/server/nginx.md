---
title: Nginx 静态托管与反向代理
description: 安装 Nginx，配置静态站点、反向代理、缓存、压缩、日志与限流，并排查 403/404/502。
category: server
order: 2
tags: [Nginx, 反向代理, 静态站点, 缓存]
updated: 2026-11-12
---

# Nginx 静态托管与反向代理

Nginx 负责接收 HTTP 请求，可以直接返回静态文件，也可以把请求转发给后端应用。它是本站推荐的 Linux 入口层。

## 安装与检查

```bash
sudo apt update
sudo apt install -y nginx
nginx -v
sudo systemctl status nginx
```

浏览器访问服务器 IP，看到欢迎页即安装成功。

```bash
sudo nginx -t          # 检查配置语法
sudo systemctl reload nginx
```

每次改配置先 `nginx -t`，通过后再 reload。

## 静态站点

把构建产物放到 `/var/www/techlearn`：

```bash
sudo mkdir -p /var/www/techlearn
sudo rsync -a --delete ./dist/ /var/www/techlearn/
sudo chown -R www-data:www-data /var/www/techlearn
```

> 本站仓库里的 `deploy/nginx.conf` 使用 `/opt/techlearn/current/dist`，以配合原子发布和回滚；学习 Nginx 时用 `/var/www/techlearn` 或任意静态目录都可以。

创建 `/etc/nginx/sites-available/techlearn`：

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name learn.example.com;

    root /var/www/techlearn;
    index index.html;

    access_log /var/log/nginx/techlearn.access.log;
    error_log  /var/log/nginx/techlearn.error.log;

    location / {
        try_files $uri $uri/ =404;
    }

    location = /404.html {
        internal;
    }

    error_page 404 /404.html;

    location ~* \.(css|js|png|jpg|jpeg|gif|svg|ico|woff2?)$ {
        expires 7d;
        add_header Cache-Control "public, max-age=604800, immutable";
        try_files $uri =404;
    }
}
```

启用：

```bash
sudo ln -s /etc/nginx/sites-available/techlearn /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

静态站不需要 PHP 或复杂模块。目录权限只需读，不要给 `777`。

## 反向代理

```nginx
upstream techlearn_api {
    server 127.0.0.1:8080;
    keepalive 32;
}

server {
    listen 80;
    server_name learn.example.com;

    location /api/ {
        proxy_pass http://techlearn_api;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 5s;
        proxy_read_timeout 120s;
    }

    location / {
        root /var/www/techlearn;
        try_files $uri $uri/ =404;
    }
}
```

后端应用只监听 `127.0.0.1`，公网只暴露 Nginx。

## SPA 回退

React/Vue 的 history 路由需要把未知路径回退到 `index.html`：

```nginx
location / {
    root /var/www/app;
    try_files $uri $uri/ /index.html;
}
```

但不要把 API 路径也回退成 HTML，否则前端会收到 `<!doctype html>` 并报 JSON 解析错误。

## gzip 与缓存

```nginx
gzip on;
gzip_comp_level 5;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript
           application/xml image/svg+xml;

location ~* \.(?:js|css|woff2?)$ {
    expires 30d;
    add_header Cache-Control "public, max-age=2592000, immutable";
}
```

带内容哈希的文件可以长缓存；`index.html` 不要设置长缓存，否则用户看不到新版本。建议：

```nginx
location = /index.html {
    add_header Cache-Control "no-cache";
}
```

## 限流

```nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

location /api/chat {
    limit_req zone=api burst=20 nodelay;
    limit_req_status 429;
    proxy_pass http://127.0.0.1:8080;
}
```

限流保护的是成本和稳定性。公开 AI 接口必须加认证、配额与超时。

## 日志

```nginx
log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                '$status $body_bytes_sent "$http_referer" '
                '"$http_user_agent" "$http_x_forwarded_for"';
```

常用排查：

```bash
sudo tail -f /var/log/nginx/techlearn.access.log
sudo tail -f /var/log/nginx/techlearn.error.log
awk '{print $9}' access.log | sort | uniq -c
```

日志会增长，必须配置 `logrotate`，避免磁盘被写满。

## 常见错误

**403 Forbidden**：目录缺少 `x` 权限、`index.html` 不存在、SELinux 阻止访问。检查 `namei -l /var/www/techlearn/index.html`。

**404 Not Found**：路径拼写、`root` 指向错误、构建产物没有同步。用 `curl -I` 查看实际响应。

**502 Bad Gateway**：后端没启动、端口不对、代理地址错误。先 `curl http://127.0.0.1:8080/api/health`。

**504 Gateway Timeout**：后端处理超时。检查 `proxy_read_timeout` 与应用日志，不要只调大超时掩盖慢查询。

**配置改了不生效**：没有 reload、改了错误文件、被其他 server 块优先匹配。用 `nginx -T` 查看最终配置。

## 安全响应头

```nginx
add_header X-Content-Type-Options nosniff always;
add_header Referrer-Policy strict-origin-when-cross-origin always;
add_header X-Frame-Options SAMEORIGIN always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
```

HSTS 只在 HTTPS 稳定后开启，并确认所有子域都支持 HTTPS。

:::tip 部署顺序
先让 HTTP 静态站可用，再配置 HTTPS，最后接后端代理。每一步都用 curl 和浏览器验证，出问题时范围更小。
:::

## 小练习

1. 用 Nginx 托管本站 `dist/`，配置 404 页面与静态缓存。
2. 把 `/api/` 反向代理到本地 8080，并验证客户端 IP 头。
3. 用 `ab` 或 `wrk` 做一次简单压测，观察日志与限流。

## 下一步

- [HTTPS 与证书](/server/https.html)
- [Docker 部署](/server/docker.html)
- [监控与日志](/server/monitoring.html)
