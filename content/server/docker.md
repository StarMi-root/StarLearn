---
title: Docker 容器化部署
description: 编写多阶段 Dockerfile，用 Compose 运行静态站与 AI 代理，理解镜像、卷、网络、健康检查与生产约束。
category: server
order: 3
tags: [Docker, Compose, 部署, 容器]
updated: 2026-11-12
---

# Docker 容器化部署

Docker 把应用与依赖打包成镜像，保证开发、测试和生产环境一致。它不是虚拟机，容器共享宿主内核，启动快、体积小。

![Docker 插画（开源图标：Simple Icons CC0 / Lucide ISC）](/static/img/icons/si-docker.svg)

## 核心概念

- **镜像**：只读模板，包含应用与依赖。
- **容器**：镜像的运行实例。
- **卷**：持久化数据，容器删除后仍保留。
- **网络**：容器之间通过服务名通信。
- **仓库**：存放镜像，如 Docker Hub、GHCR。

```bash
docker version
docker info
docker ps
docker images
docker logs <container>
docker exec -it <container> sh
```

## 多阶段构建

本站是 Node 构建、Python 运行的静态站 + 代理。`Dockerfile` 示例：

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    SITE_DIR=/app/dist \
    HOST=0.0.0.0 \
    PORT=8080

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY server/ai_proxy.py ./server/ai_proxy.py

RUN useradd --system --no-create-home --shell /usr/sbin/nologin appuser \
    && chown -R appuser:appuser /app
USER appuser

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD python3 -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8080/api/health')"

CMD ["python3", "server/ai_proxy.py"]
```

构建与运行：

```bash
docker build -t techlearn:latest .
docker run -d --name techlearn \
  -p 127.0.0.1:8080:8080 \
  --env-file .env \
  techlearn:latest
```

端口绑定 `127.0.0.1` 表示只允许本机访问，再由 Nginx 对外。

## Compose

`docker-compose.yml`：

```yaml
services:
  techlearn:
    build: .
    image: techlearn:latest
    restart: unless-stopped
    ports:
      - "127.0.0.1:8080:8080"
    env_file:
      - .env
    volumes:
      - ./data:/app/data
    healthcheck:
      test: ["CMD", "python3", "-c", "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8080/api/health')"]
      interval: 30s
      timeout: 5s
      retries: 3
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
```

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f
docker compose down
```

`restart: unless-stopped` 让容器在异常退出或宿主重启后恢复。`env_file` 保存密钥，不要提交到 Git。

## 数据与备份

容器内写入的数据默认随容器删除而丢失。需要持久化的目录使用卷：

```yaml
volumes:
  - ./data:/app/data
```

备份时备份宿主目录，不要只备份容器。数据库容器要使用一致性备份工具。

## 网络

同一 Compose 网络中的服务可以用服务名访问：

```yaml
services:
  api:
    build: ./api
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: example
```

应用连接 `db:5432`，而不是 `localhost:5432`。容器内的 localhost 是容器自己。

## 镜像与安全

- 使用官方或可信基础镜像，固定主版本。
- 多阶段构建，运行镜像不包含编译工具。
- 以非 root 用户运行。
- 不把密钥 `COPY` 进镜像。
- 定期更新基础镜像并扫描漏洞。
- 限制容器能力与资源。
- 只暴露必要端口。

```bash
docker scout quickview techlearn:latest
docker stats
```

## 日志与清理

```bash
docker logs --tail 100 techlearn
docker system df
docker image prune
docker system prune
```

生产环境为容器配置日志轮转。不要随意 `docker system prune -a`，可能删除仍需使用的镜像。

## 常见问题

**构建很慢**：优化 `COPY` 顺序，先复制依赖清单再安装，充分利用缓存。

**容器启动即退出**：`docker logs` 看错误；检查入口命令、端口、环境变量和权限。

**端口冲突**：`ss -tulpn | grep :8080`，修改宿主端口或停止旧容器。

**数据丢失**：没有挂载卷；确认 compose 的 volumes 与备份路径。

**时区不对**：容器默认 UTC，可设置 `TZ=Asia/Shanghai` 或在应用层统一使用 UTC。

:::warn 不要把 Docker 当安全边界
容器共享内核。运行不可信镜像、挂载 Docker socket、使用 `--privileged` 都会带来严重风险。生产环境遵循最小权限原则。
:::

## 小练习

1. 为本站编写 Dockerfile 并构建镜像。
2. 用 Compose 启动服务，配置健康检查与日志轮转。
3. 挂载数据卷，重启容器后验证数据仍在。

## 下一步

- [HTTPS 与证书](/server/https.html)
- [CI/CD 自动化](/server/cicd.html)
- [监控与日志](/server/monitoring.html)
