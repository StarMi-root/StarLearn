---
title: GitHub Pages 静态部署
description: 用 GitHub Actions 自动构建并发布静态站点，处理仓库子路径、404、自定义域名与静态托管限制。
category: server
order: 5
tags: [GitHub Pages, Actions, 静态部署, 自定义域名]
updated: 2026-11-12
---

# GitHub Pages 静态部署

GitHub Pages 免费托管静态文件，适合文档、博客和本站这类纯前端站点。它不能运行 Python/Node 后端，也不能安全保存 API Key。

## 仓库准备

```bash
git init
git add .
git commit -m "feat: initial techlearn site"
git branch -M main
git remote add origin git@github.com:<user>/<repo>.git
git push -u origin main
```

`.gitignore` 至少包含：

```gitignore
node_modules/
dist/
.env
.env.*
*.log
.DS_Store
assets_src/
```

`dist/` 由 CI 生成，不需要提交。`package-lock.json` 必须提交，以保证依赖可复现。

## 启用 Pages

仓库 **Settings → Pages → Build and deployment**：

- Source 选择 **GitHub Actions**。
- 若使用自定义域名，填写域名并在 DNS 配置 CNAME。
- 确认 Actions 有 `pages: write` 与 `id-token: write` 权限。

## 工作流

创建 `.github/workflows/pages.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

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

      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

推送后查看 Actions 日志。首次部署可能需要几分钟。

## 子路径问题

如果站点发布在 `https://<user>.github.io/<repo>/`，绝对路径 `/static/...` 会指向域名根目录，导致 404。本站构建器使用相对链接，但仍需注意：

- Markdown 中内部链接写 `/java/intro.html` 时，构建器会转换为相对路径。
- 不要在 HTML 中硬编码 `/static/...`（构建器会重写，但手写模板要小心）。
- 自定义 404 页面中的资源也要用相对路径。
- 自定义域名部署在根路径时，绝对路径通常可用，但相对路径更通用。

本地构建后可以模拟子路径：

```bash
mkdir -p /tmp/subpath
cp -r dist /tmp/subpath/repo
cd /tmp/subpath
python3 -m http.server 8080
# 访问 http://localhost:8080/repo/
```

## 自定义域名

1. 在仓库 Pages 设置中填写域名，例如 `learn.example.com`。
2. DNS 添加 CNAME：

```text
learn.example.com.  CNAME  <user>.github.io.
```

3. 等待 DNS 生效与证书签发。
4. 开启 **Enforce HTTPS**。

GitHub Pages 会自动签发证书，但 DNS 配置错误时可能长时间失败。不要同时配置冲突的 A/CNAME 记录。

## 404 与 SPA

GitHub Pages 对未知路径返回 `404.html`。本站已生成 `404.html`。如果是 React/Vue SPA，需要：

- 使用 hash 路由；或
- 生成 `404.html` 作为 `index.html` 的副本；或
- 改用支持回退的托管平台。

## 静态托管的限制

- 无服务端代码、数据库、定时任务。
- 不能保存 API Key 或代理 AI 请求。
- 自定义响应头有限，CSP/HSTS 需要额外方案。
- 构建产物有仓库大小与带宽限制。
- 私有仓库的 Pages 访问控制取决于套餐。

本站 AI 助手在 GitHub Pages 上只能使用：

1. 站内离线知识库；
2. 用户自己填写并保存在浏览器的 API Key；
3. 外部已配置 CORS 的代理服务（不推荐公开 Key）。

生产推荐 Linux + Nginx + 代理，见 [服务器初始化](/server/setup.html)。

## 构建缓存与失败排查

- **npm ci 失败**：确认 `package-lock.json` 与 `package.json` 一致。
- **构建 OOM**：减少依赖或换更大 runner。
- **Pages 404**：确认 artifact 路径是 `dist`，且 `index.html` 在根目录。
- **样式丢失**：检查资源路径是否为绝对路径。
- **部署成功但页面旧**：浏览器或 CDN 缓存；检查 `index.html` 缓存策略。
- **权限错误**：确认 workflow `permissions` 与 Pages Source 设置。

:::tip 先用构建检查
在 CI 前本地运行 `npm ci && npm run build`。把构建当作测试，不要等部署后才发现 Markdown 或链接错误。
:::

## 小练习

1. 把站点发布到 GitHub Pages 子路径，验证首页、文章页和 `.md` 下载。
2. 配置自定义域名并开启 HTTPS。
3. 故意推送一个错误链接，观察构建是否失败，补充链接检查。

## 下一步

- [CI/CD 自动化](/server/cicd.html)
- [服务器初始化](/server/setup.html)
- [HTTPS](/server/https.html)
