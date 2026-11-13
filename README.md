<p align="center">
  <img src="static/img/brand/starlearn-512.png" width="96" height="96" alt="StarLearn 星学">
</p>

<h1 align="center">StarLearn · 星学</h1>

<p align="center">从第一行代码，到独立部署上线。</p>

<p align="center">
  <strong>100 篇原创中文教程</strong> · 22 个教程分类 · 6 条学习路线 · 150 个课程主题 · 102 道练习 · 全文搜索 · AI 学习助手
</p>

---

## 项目简介

**StarLearn（星学）** 是一个面向中文学习者的实战型技术学习站，由 **星米StarMi** 独立开发。内容覆盖编程基础、Python/数据科学、AI 与本地大模型、前端、后端、数据库、移动开发、Linux、SSH、服务器部署、DevOps、编程语言、计算机基础、XML、.NET 与网站建设。

站点不是简单的链接导航：它有完整的原创正文、可运行代码、随堂练习、学习进度、笔记、Markdown 下载、全文检索和可选的 AI 学习助手。构建产物是纯静态文件，可以部署到 GitHub Pages、Linux + Nginx 或 Docker。

> 内容编写、GitHub Pages、Linux 部署和日常维护的完整步骤，见 **[使用指南](使用指南.md)**。

- **站点名称**：StarLearn
- **中文名**：星学
- **开发者**：星米StarMi
- **联系邮箱**：wB251046886@163.com
- **B 站**：星米StarMi
- **内部部署目录**：`/opt/techlearn/current`
- **站点图标**：`1790907212681.jpg`（仓库根目录），构建时生成 PNG/ICO 图标

## 内容规模

| 项目 | 数量 |
| --- | ---: |
| 原创教程文章 | 100 篇 |
| 教程分类 | 22 个 |
| 学习路线 | 6 条 |
| 课程目录主题 | 150 个 |
| 随堂练习 | 102 道 |
| 综合练习页题目 | 15 道 |
| Markdown 文件 | 125 个 |
| 全文搜索条目 | 273 条 |
| 本地开源图标 | 134 个 SVG |

### 内容地图

| 方向 | 文章数 | 代表内容 |
| --- | ---: | --- |
| 编程基础 | 7 | 变量、数组、条件、循环、运算符、函数、综合练习 |
| C# | 7 | 类型、OOP、LINQ、异步、ASP.NET Core |
| Avalonia | 7 | XAML、MVVM、控件、主题、打包发布 |
| Python | 9 | 语法、容器、函数、OOP、文件、量化、全栈地图 |
| Java | 6 | 语法、集合、Spring Boot、JVM 基础 |
| 前端 | 8 | HTML、CSS、JavaScript、TypeScript、React、响应式 |
| AI 与本地大模型 | 10 | Token、llama.cpp、GGUF 量化、RAG、Agent、AI 编程工作流 |
| Linux | 8 | 命令、文件系统、权限、进程、systemd、Shell |
| 服务器与部署 | 7 | Nginx、Docker、HTTPS、GitHub Pages、CI/CD、监控 |
| SSH 与服务 | 5 | 密钥、跳板机、端口转发、rsync、安全加固 |
| 硬件与软件 | 6 | CPU/GPU、内存、存储、网络、操作系统、虚拟化 |
| 参考手册 | 6 | C#、Avalonia、Python、Java、前端、Linux 速查 |
| 实战项目 | 5 | 任务管理器、笔记应用、本地 AI 对话、部署清单 |
| 其他专题 | 9 | 后端、数据库、移动开发、DevOps、编程语言、CS、XML、.NET、网站建设 |

## 核心特性

- **22 个分类 + 6 条学习路线**：从零基础到全栈、AI 工程、数据应用、后端数据库和运维部署。
- **150 个课程主题**：29 个主题有本站精讲正文，121 个主题提供详细文档入口，方便继续深入。
- **全文搜索**：索引覆盖文章标题、描述、正文、代码、分类、目录条目和 AI 工具说明，正文不截断。
- **AI 学习助手**：默认使用站内全文索引离线检索；配置 OpenAI 兼容接口后，可结合当前页面与检索结果回答。
- **练习与反馈**：102 道随堂选择题，支持检查答案、查看解析；另有 15 道综合练习。
- **学习体验**：阅读进度、已学完标记、本地笔记与 Markdown 导出、目录高亮、回到顶部。
- **响应式与深色模式**：桌面、平板、手机自适应，蓝红主色，绿色仅用于必要的状态提示。
- **Markdown 下载**：每篇文章、每个分类和全站内容都可下载 `.md`，方便离线复习。
- **本地素材**：图标全部存放在仓库内，运行时不依赖 CDN；无第三方字体和追踪脚本。
- **可静态部署**：`dist/` 可直接放到 GitHub Pages、Nginx、对象存储或任意静态服务器。

## 技术栈

- **构建**：Node.js 22 + 原生 ESM + `marked` + `highlight.js` + `js-yaml`
- **前端**：语义化 HTML、原生 CSS、原生 JavaScript
- **内容**：Markdown + YAML Front Matter + 自定义提示块/练习块
- **搜索**：构建期生成 `static/search-index.js`，浏览器端进行全文匹配与摘要
- **AI 代理**：`server/ai_proxy.py`，仅使用 Python 标准库，支持 OpenAI 兼容接口
- **部署**：GitHub Pages、Nginx、systemd、Docker Compose

## 快速开始

环境要求：**Node.js 20+**、npm；AI 代理需要 **Python 3.10+**。

```bash
# 1. 安装锁定依赖
npm ci

# 2. 构建静态站点到 dist/
npm run build

# 3. 构建后检查内部链接、图片、Markdown 与搜索索引
npm run check

# 4. 本地静态预览，打开 http://127.0.0.1:8080
npm run serve
```

开发时可在两个终端分别运行：

```bash
npm run dev      # 监听内容变化并重建 dist/
npm run serve    # 提供静态预览
```

### 使用 AI 代理本地预览

```bash
cp .env.example .env
# 编辑 .env，填入 AI_API_BASE、AI_API_KEY、AI_MODEL
npm run preview   # http://127.0.0.1:8080
```

`npm run preview` 会启动 `server/ai_proxy.py`，同时提供静态文件和 `/api/chat`。健康检查：

```bash
curl -s http://127.0.0.1:8080/api/health
```

支持的 OpenAI 兼容服务包括 DeepSeek、OpenAI、Ollama、llama.cpp server 以及自建网关。密钥只放在服务器环境变量中，不会写入前端构建产物。

## 常用脚本

| 命令 | 作用 |
| --- | --- |
| `npm run build` | 读取 `config.yml`、`data/` 和 `content/`，生成 `dist/` |
| `npm run dev` | 监听内容变化并自动重建 |
| `npm run serve` | 使用 Python 静态服务器预览 `dist/` |
| `npm run preview` | 启动静态站 + AI 代理 |
| `npm run check` | 检查内部链接、图片、Markdown 下载、搜索索引和关键产物 |

构建成功时会输出文章、路线、练习、字数与图标统计。`npm run check` 当前检查结果：

```text
✓ 检查通过：127 个 HTML，13681 个内部链接，125 个 Markdown，273 条搜索索引。
```

## 全文搜索与 AI 助手

### 搜索

`build.mjs` 会把每篇文章渲染后的纯文本完整写入 `dist/static/search-index.js`，包括正文和代码块，不做长度截断。搜索框支持：

- 标题、描述、标签、分类名匹配
- 正文任意词语匹配，结果附带命中摘要
- 目录主题与详细文档条目匹配
- 键盘 `↑` / `↓` 选择、`Enter` 打开、`Esc` 关闭
- 外部结果在新标签页打开，本地文章在站内打开

### AI 助手

默认模式为“站内知识库”，不配置 API 也能检索当前页面与全站正文，给出带出处的学习建议。切换到“自定义 API”或“本站代理”后：

1. 浏览器端可填写自己的接口地址、模型与 Key（仅保存在本机 localStorage）。
2. 公开站点建议使用 `server/ai_proxy.py`，由服务端保存 Key，并启用限流。
3. 代理包含请求体大小限制、超时、最大 Token、每 IP 限流和同源检查。
4. 生产环境仍建议在 Nginx 层增加认证、限流、日志轮转与监控。

> AI 输出可能有误，涉及命令、权限、数据库和密钥的操作请先在测试环境验证。

## 部署

### GitHub Pages

1. 将仓库推送到 GitHub 的 `main` 分支。
2. 打开 **Settings → Pages → Build and deployment**，Source 选择 **GitHub Actions**。
3. 工作流 `.github/workflows/pages.yml` 会自动执行 `npm ci`、`npm run build`，并发布 `dist/`。
4. 站点使用相对链接，可直接部署在 `https://<user>.github.io/<repo>/` 子路径。
5. 可选：在 **Settings → Secrets and variables → Actions → Variables** 添加 `SITE_URL`，用于生成 `sitemap.xml` 和 `robots.txt`。
6. 自定义域名：在 Pages 中填写域名，按 GitHub 提示配置 DNS；需要 HTTPS 时等待证书签发。

GitHub Pages 是纯静态托管，不能安全保存 AI Key。公开站点请使用 Linux 代理，或让访客填写自己的 Key。

### Linux + Nginx

推荐目录结构：`/opt/techlearn/releases/<版本>` 存放发布内容，`/opt/techlearn/current` 指向当前版本。

```bash
# 服务器初始化（用有 sudo 权限的登录用户执行；已存在时跳过创建）
sudo groupadd --system techlearn
sudo useradd --system --gid techlearn --no-create-home \
  --home-dir /nonexistent --shell /usr/sbin/nologin techlearn
sudo mkdir -p /opt/techlearn/releases /etc/techlearn
sudo chown -R "$(id -u):$(id -g)" /opt/techlearn
sudo chmod 755 /opt/techlearn /opt/techlearn/releases

# 本地构建并发布
npm ci && npm run build
RELEASE=$(date +%Y%m%d%H%M%S)
ssh user@server "mkdir -p /opt/techlearn/releases/$RELEASE"
rsync -az --delete dist/ user@server:/opt/techlearn/releases/$RELEASE/dist/
rsync -az server/ user@server:/opt/techlearn/releases/$RELEASE/server/
rsync -az deploy/ user@server:/opt/techlearn/releases/$RELEASE/deploy/
ssh user@server "ln -sfn /opt/techlearn/releases/$RELEASE /opt/techlearn/current"

# 启用 HTTP 模板（把示例域名替换成自己的域名）
sudo cp /opt/techlearn/current/deploy/nginx-http-only.conf /etc/nginx/sites-available/techlearn
sudo sed -i 's/learn.example.com/你的域名/g' /etc/nginx/sites-available/techlearn
sudo ln -sfn /etc/nginx/sites-available/techlearn /etc/nginx/sites-enabled/techlearn
sudo nginx -t && sudo systemctl reload nginx
```

启用 AI 代理：

```bash
sudo install -m 600 /dev/null /etc/techlearn/ai.env
sudoedit /etc/techlearn/ai.env       # 参考 .env.example
sudo cp /opt/techlearn/current/deploy/techlearn.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now techlearn
sudo systemctl status techlearn
curl -s http://127.0.0.1:8080/api/health
```

签发 HTTPS 证书后：

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d 你的域名
sudo cp /opt/techlearn/current/deploy/nginx.conf /etc/nginx/sites-available/techlearn
sudo sed -i 's/learn.example.com/你的域名/g' /etc/nginx/sites-available/techlearn
sudo nginx -t && sudo systemctl reload nginx
sudo certbot renew --dry-run
```

更新版本时重复发布步骤，并执行 `sudo systemctl restart techlearn`。回滚只需把 `current` 指回上一版本，再重启服务。配置模板位于 [`deploy/`](deploy/)，详细步骤见 [HTTPS 教程](content/server/https.md) 和 [CI/CD 教程](content/server/cicd.md)。

### Docker

```bash
cp .env.example .env
# 编辑 .env，至少检查 AI_API_BASE、AI_API_KEY、AI_MODEL
docker compose up -d --build
curl -s http://127.0.0.1:8080/api/health
```

Compose 默认只绑定 `127.0.0.1:8080`，由宿主机 Nginx 提供 HTTPS。生产环境请增加认证、限流、日志轮转与监控；不要把 `.env` 提交到仓库。

## 项目结构

```text
techlearn/
├── 使用指南.md               # 内容编写与部署维护手册
├── 1790907212681.jpg         # 站点图标原图
├── build.mjs                 # 静态站点生成器
├── config.yml                # 站点信息、22 个分类、6 条路线
├── data/
│   ├── catalog.yml           # 12 个方向 / 150 个主题
│   └── global-quiz.yml       # 综合测验
├── content/                  # 100 篇教程 Markdown
│   ├── foundations/          # 变量、数组、条件、循环、运算符、函数、练习
│   ├── python/               # Python、量化、全栈地图
│   ├── ai/                   # 本地模型、RAG、Agent、AI 编程工作流
│   ├── csharp/ avalonia/     # .NET 与桌面开发
│   ├── java/ frontend/       # Java 与前端
│   ├── linux/ server/ ssh/   # Linux、Nginx、Docker、部署、SSH
│   └── ...                   # 数据库、移动、DevOps、XML、.NET 等
├── static/
│   ├── css/style.css         # 蓝红主题、响应式、深色模式
│   ├── js/app.js             # 搜索、目录、练习、进度、笔记
│   ├── js/ai.js              # 站内检索与 AI 对话
│   └── img/
│       ├── brand/            # 站点图标与 favicon
│       └── icons/            # 134 个本地 SVG（Simple Icons / Lucide）
├── server/ai_proxy.py        # 标准库静态站 + AI 代理
├── deploy/                   # Nginx、systemd、备份
├── scripts/check-links.mjs   # 构建后检查
├── scripts/watch.mjs         # 本地监听并自动重建
├── .github/workflows/        # GitHub Pages 自动部署
├── Dockerfile
├── docker-compose.yml
└── dist/                     # 构建产物（不提交）
```

## 内容写作

文章位于 `content/<分类>/<文章>.md`，使用 YAML Front Matter：

```markdown
---
title: Java 基础语法
description: 类型、变量、条件、循环与数组。
category: java
order: 2
tags: [Java, 语法]
updated: 2026-11-12
---

# Java 基础语法

正文……
```

约定：

- `category` 必须是 `config.yml` 中已存在的分类 slug。
- `order` 决定分类页中的文章顺序。
- 代码块指定语言，构建时启用语法高亮。
- 提示块支持 `:::tip`、`:::warn`、`:::danger` 和 GitHub Alerts。
- 练习题使用 `:::quiz` YAML 块；可参考任意 `practice.md`。
- 图片使用 `static/img/icons/` 中带许可的本地 SVG，不热链第三方图片。
- 新增或修改文章后执行：

```bash
npm run build
npm run check
```

### 新增分类或目录条目

- 分类：在 `config.yml` 的 `categories` 中增加 slug、名称、描述、渐变、图标和顺序。
- 课程目录：在 `data/catalog.yml` 中增加主题；本地精讲使用 `local:`，官方文档使用 `url:`。
- 学习路线：在 `config.yml` 的 `paths` 中组合文章路径。
- 图标：把 SVG 放入 `static/img/icons/`，并在配置中引用相对路径。

## 检查与质量保证

```bash
npm run check
```

检查内容包括：

- 127 个 HTML 页面的内部链接和图片引用
- Markdown 下载文件是否存在
- 搜索引擎索引条目是否指向有效页面
- 关键产物（首页、目录、练习、404、搜索索引、CSS、JS）是否生成
- 构建统计与分类/文章数量是否一致

发布前建议额外执行：桌面与手机宽度检查、深色模式检查、搜索无结果与外部结果检查、练习答题反馈、AI 离线检索、静态服务器 404 页面和 Nginx `nginx -t`。

## 安全说明

- 不要把真实 API Key 提交到仓库、前端代码或构建产物。
- 公开 AI 代理必须启用认证、限流、额度与监控；默认配置仅适合本机或内网。
- 服务器使用非 root 用户运行服务，密钥文件权限设为 600。
- 高风险命令（删除、权限、防火墙、数据库、证书）先在测试环境验证并备份。
- 本站教程用于学习参考，不构成生产操作的唯一依据。

## 素材与许可

- **代码**：MIT License，见 [`LICENSE`](LICENSE)。
- **原创教程文字与插图**：CC BY-NC-SA 4.0，见 [`LICENSE-CONTENT`](LICENSE-CONTENT)。转载请注明 StarLearn / 星米StarMi，并以相同方式共享；不得用于商业用途。
- **Simple Icons**：CC0 1.0，图标文件见 `static/img/icons/si-*.svg`。
- **Lucide**：ISC License，图标文件见 `static/img/icons/lu-*.svg`。
- **站点图标**：由开发者提供的 `1790907212681.jpg` 生成，构建产物包括 PNG 和 ICO 版本。
- **构建依赖**：marked（MIT）、highlight.js（BSD-3-Clause）、js-yaml（MIT）、marked-highlight（MIT）。

完整第三方说明见 [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md)。Simple Icons / Lucide 中的技术名称和标识属于各自权利人，仅用于识别对应技术，不代表任何背书。

## 上传到 GitHub

```bash
git init
git add .
git commit -m "feat: StarLearn 技术学习站"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

推送后在仓库 Settings → Pages 选择 **GitHub Actions**，等待工作流完成即可。如果使用仓库子路径，不需要修改构建配置；构建器会把站内链接重写为相对链接。

## 联系与反馈

- 开发：**星米StarMi**
- 邮箱：[wB251046886@163.com](mailto:wB251046886@163.com)
- B 站：**星米StarMi**（[搜索主页](https://search.bilibili.com/all?keyword=%E6%98%9F%E7%B1%B3StarMi)）
- 关于页：[`content/about.md`](content/about.md)

发现内容错误、失效链接或希望补充主题，欢迎通过邮箱或 GitHub Issue 反馈。提交前请先阅读 [`CONTRIBUTING.md`](CONTRIBUTING.md)。

---

<p align="center">用 HTML + CSS + JavaScript 构建 · 可部署于 GitHub Pages 或 Linux</p>
<p align="center">© 2026 StarLearn · 星米StarMi</p>
