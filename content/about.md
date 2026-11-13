---
title: 关于 StarLearn
description: StarLearn 是一个可部署到 GitHub Pages 或 Linux 的实战型技术学习站，覆盖 Python/数据科学、AI、前后端、数据库、移动开发、Linux 与网站建设。
category: page
url: about.html
layout: about
tags: [关于, 开源, 部署, 素材来源]
updated: 2026-11-13
---

# 关于 StarLearn

StarLearn（星学）是一个独立开发的中文技术学习站，由 **星米StarMi** 创建和维护。站点的目标不是堆砌链接，而是建立一条完整的学习闭环：**读教程 → 写代码 → 做练习 → 问 AI → 部署上线 → 下载 Markdown 归档**。

站点按 12 个技术方向组织，并扩展为 22 个教程分类，完整覆盖 **150 个课程主题**：Python/数据科学、AI/智能开发、前端、后端、数据库、移动开发、DevOps/工程化、编程语言、计算机基础、XML/Web Service、.NET 生态与网站建设。另有独立的「编程基础」先修路线，把变量、数组、条件、循环、运算符和函数讲透。

## 这里有什么

- **Python 与数据科学**：Python3、FastAPI/Flask/Django、NumPy/Pandas/SciPy、Matplotlib/Dash/Jupyter、量化交易、R 与 Julia。
- **AI 与智能开发**：AI 基础与案例、AI Agent、Codex/Claude Code/OpenCode、Vibe Coding、Ollama/Hermes/DeepSeek Harness/Pi Agent、机器学习框架、LangChain、NLP、OpenCV、Selenium/Playwright。
- **前端开发**：HTML/CSS/JavaScript/TypeScript、DOM、AJAX/JSON、Tailwind/Bootstrap/Foundation、Vue/React/Next/Angular、ECharts/Chart.js/SVG。
- **后端、数据库与移动**：Node.js/Electron、PHP/Java/Go/Rust/C#、Servlet/JSP、RESTful API、Docker/Linux；SQL/MySQL/PostgreSQL/MongoDB/Redis；Android/Flutter/Swift/Kotlin。
- **工程化与计算机基础**：Git/SVN、CMake/Maven、VS Code/PyCharm、Obsidian/Markdown/LaTeX；组成原理、数据结构与算法、设计模式、HTTP/TCP-IP、W3C。
- **XML、.NET 与网站建设**：XML 全套生态、Web Service/WSDL/SOAP/RSS/RDF；ASP.NET/MVC/Razor/Web Forms/PowerShell；域名、主机、DNS、SEO 与网站品质。
- **参考与实战**：C#、Avalonia、Java、Linux、服务器部署、SSH，以及 C# 任务 API、Avalonia 笔记、Python CLI、Java API、本地 AI 聊天等项目。

## 全站 Markdown

每篇文章右上角都有“下载 .md”，每个课程首页提供整门课合集，全站目录页提供 `all.md` 总合集。Markdown 文件保留标题、简介、代码块、表格与练习配置，可直接导入 Obsidian、Notion、Typora 或其他 Markdown 工具。

## AI 学习助手

右下角的 AI 助手默认使用**站内知识库检索**，不需要配置任何密钥。它会根据你的问题检索本站文章，给出相关章节与摘要。你也可以在设置中接入任何 OpenAI 兼容接口：

- DeepSeek：`https://api.deepseek.com/v1/chat/completions`
- OpenAI：`https://api.openai.com/v1/chat/completions`
- 本地 Ollama：`http://localhost:11434/v1/chat/completions`
- 本站 Linux 代理：`/api/chat`（由 `server/ai_proxy.py` 提供，密钥保存在服务器环境变量中）

纯静态部署时，API Key 只会保存在浏览器 `localStorage`，不会提交到本站仓库。生产环境建议使用服务端代理，避免密钥暴露。

## 技术实现

- 内容源：Markdown + YAML Front Matter。
- 构建：Node.js 脚本，使用 `marked` 渲染、`highlight.js` 做服务端代码高亮。
- 前端：原生 HTML/CSS/JavaScript，无框架运行时依赖。
- 搜索：构建时生成全文索引，浏览器端即时匹配。
- 练习：Markdown 中的 `:::quiz` 块在构建时转换为交互式题目。
- 部署：纯静态 `dist/`，可直接发布到 GitHub Pages；也可用 Nginx 或 Docker 部署到 Linux。

## 开发者与联系

- **开发**：星米StarMi
- **邮箱**：[wB251046886@163.com](mailto:wB251046886@163.com)
- **B 站**：[星米StarMi](https://search.bilibili.com/all?keyword=%E6%98%9F%E7%B1%B3StarMi)
- **站点英文名**：StarLearn
- **站点中文名**：星学

欢迎反馈教程错误、提出选题建议或交流部署问题。提交问题时请附上页面地址、复现步骤和期望结果。

## 素材与许可 {#credits}

本站代码采用 MIT License；原创教程文字采用 CC BY-NC-SA 4.0（署名—非商业性使用—相同方式共享）。第三方图标说明：

- **Simple Icons**：CC0 1.0 Universal，https://simpleicons.org/。用于技术品牌标识，品牌名称与商标归各自权利人所有。
- **Lucide**：ISC License，https://lucide.dev/。用于通用功能图标。
- **站点图标** `1790907212681.jpg`：由站点作者提供。

所有图标均在构建前下载到本地 `static/img/icons/`，页面运行时不依赖第三方图标接口。完整许可见项目根目录的 `THIRD_PARTY_NOTICES.md`。

## 部署

- **GitHub Pages**：推送代码，仓库 Settings → Pages → Source 选择 GitHub Actions。工作流已包含在 `.github/workflows/pages.yml`。
- **Linux + Nginx**：`npm ci && npm run build`，按 `README.md` 的 releases/current 方式发布；Nginx 模板默认读取 `/opt/techlearn/current/dist`，参考 `deploy/nginx.conf`。
- **Docker**：`docker compose up -d --build`，静态站点与 AI 代理会一起启动。

## 免责声明

教程内容用于学习参考，不构成生产环境的唯一操作依据。执行删除、权限、防火墙、数据库、证书等命令前，请先在测试环境验证并做好备份。量化交易内容仅供编程研究，不构成投资建议。
