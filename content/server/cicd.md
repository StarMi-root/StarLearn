---
title: CI/CD 自动化发布
description: 用 GitHub Actions 构建、测试并通过 rsync/SSH 发布到 Linux 服务器，实现原子切换、健康检查与回滚。
category: server
order: 6
tags: [CI/CD, GitHub Actions, rsync, 部署]
updated: 2026-11-12
---

# CI/CD 自动化发布

持续集成（CI）验证每次提交，持续部署（CD）把通过的构建发布到服务器。目标不是“自动执行命令”，而是**可重复、可观察、可回滚**。

## 流水线设计

```text
提交 → 安装依赖 → 构建 → 检查 → 上传产物 → 服务器解压 → 原子切换 → 健康检查 → 通知
```

每次发布应满足：

- 同一个提交产生同一个构建；
- 失败时旧版本继续服务；
- 发布日志可追溯；
- 回滚只需切换版本或重新部署上一个标签；
- 密钥不进入仓库与构建产物。

## 服务器准备

创建部署用户：

```bash
sudo adduser --disabled-password --gecos "" deploy
sudo mkdir -p /opt/techlearn/releases /opt/techlearn/shared
sudo chown -R deploy:deploy /opt/techlearn
```

配置部署公钥，限制来源。CI 的私钥放在 GitHub Secrets，权限 600。

目录约定：

```text
/opt/techlearn/
├── current -> releases/20261112120000
├── releases/
│   ├── 20261112120000/
│   └── 20261111180000/
└── shared/
    └── ai.env
```

## 构建工作流

`.github/workflows/deploy.yml`：

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: production
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci
      - run: npm run build
      - run: test -f dist/index.html

      - uses: actions/upload-artifact@v4
        with:
          name: site
          path: dist
          retention-days: 7

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: site
          path: dist

      - name: Prepare SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.DEPLOY_SSH_KEY }}" > ~/.ssh/id_ed25519
          chmod 600 ~/.ssh/id_ed25519
          ssh-keyscan -H "${{ secrets.DEPLOY_HOST }}" >> ~/.ssh/known_hosts

      - name: Upload release
        run: |
          RELEASE="$(date +%Y%m%d%H%M%S)"
          echo "RELEASE=$RELEASE" >> "$GITHUB_ENV"
          rsync -az --delete dist/ \
            "${{ secrets.DEPLOY_USER }}@${{ secrets.DEPLOY_HOST }}:/opt/techlearn/releases/$RELEASE/"

      - name: Activate and health check
        run: |
          ssh "${{ secrets.DEPLOY_USER }}@${{ secrets.DEPLOY_HOST }}" bash -s <<'REMOTE'
          set -euo pipefail
          BASE=/opt/techlearn
          RELEASE="${{ env.RELEASE }}"
          ln -sfn "$BASE/releases/$RELEASE" "$BASE/current"
          curl -fsS http://127.0.0.1:8080/api/health >/dev/null
          echo "deployed $RELEASE"
          REMOTE

      - name: Rollback on failure
        if: failure()
        run: |
          ssh "${{ secrets.DEPLOY_USER }}@${{ secrets.DEPLOY_HOST }}" \
            "ls -1dt /opt/techlearn/releases/* | sed -n 2p | xargs -I{} ln -sfn {} /opt/techlearn/current"
```

注意：示例中的 `RELEASE` 变量传入远程脚本的方式需要根据实际 runner 调整；生产建议把发布脚本放在服务器上，通过参数调用，而不是在 YAML 中拼接复杂命令。

## 服务器发布脚本

`/opt/techlearn/scripts/activate.sh`：

```bash
#!/usr/bin/env bash
set -euo pipefail

BASE="/opt/techlearn"
RELEASE="${1:?usage: activate.sh <release-dir>}"
TARGET="$BASE/releases/$RELEASE"

[ -d "$TARGET" ] || { echo "release not found: $TARGET" >&2; exit 1; }

ln -sfn "$TARGET" "$BASE/current"
systemctl restart techlearn

for i in {1..20}; do
  if curl -fsS http://127.0.0.1:8080/api/health >/dev/null; then
    echo "activation ok: $RELEASE"
    exit 0
  fi
  sleep 1
done

echo "health check failed, rolling back" >&2
previous="$(ls -1dt "$BASE"/releases/* | sed -n 2p)"
ln -sfn "$previous" "$BASE/current"
systemctl restart techlearn
exit 1
```

生产环境应保留最近 5–10 个版本，并定期清理。

## 密钥管理

GitHub Secrets：

- `DEPLOY_HOST`
- `DEPLOY_USER`
- `DEPLOY_SSH_KEY`

服务器端 AI 密钥放在 `/etc/techlearn/ai.env`，不经过 GitHub。CI 只负责代码与静态产物，不接触模型密钥。

## 质量门禁

在构建后增加：

```bash
# 检查链接（可引入 lychee 或自写脚本）
npm run build
test -f dist/index.html
test -f dist/md/all.md
node scripts/check-links.mjs
```

实际项目中还应跑单元测试、类型检查、Lighthouse 或可访问性检查。没有门禁的 CD 只是自动把风险推到线上。

## 回滚策略

- 静态站：切换 `current` 符号链接到上一版本。
- 容器：重新部署上一个镜像 tag。
- 数据库：迁移必须向前兼容，回滚方案单独设计。
- 配置：版本化并保留上一份。

回滚命令也要演练。只写“支持回滚”但从未测试，等于没有。

:::warn 不要自动跑数据库迁移
数据库结构变更应独立审批与备份。应用自动回滚时，旧代码未必兼容新结构。把迁移与发布解耦，采用 expand/contract 模式。
:::

## 小练习

1. 配置 GitHub Actions 构建并上传 artifact。
2. 用 rsync + SSH 发布到测试服务器。
3. 模拟健康检查失败，确认自动回滚生效。

## 下一步

- [监控与日志](/server/monitoring.html)
- [Nginx](/server/nginx.html)
- [Docker](/server/docker.html)
