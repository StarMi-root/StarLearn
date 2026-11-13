---
title: .NET 生态学习地图：ASP.NET、MVC 与自动化
description: ASP.NET、MVC、Razor、Web Forms、Web Pages 与 PowerShell 的企业开发生态地图。
category: dotnet
order: 1
tags: [ASP.NET, MVC, Razor, PowerShell]
updated: 2026-11-12
---

# .NET 生态学习地图：ASP.NET、MVC 与自动化

.NET 既有现代跨平台 ASP.NET Core，也有需要维护的 Web Forms 旧系统。先掌握 C# 与 HTTP，再理解 MVC 分层和 Razor 渲染；维护旧项目时，再补 Web Forms 与 Web Pages 的事件模型。

![.NET 生态图标（Simple Icons CC0 / Lucide ISC）](/static/img/icons/si-dotnet.svg)

:::tip 先选一条主线
不要同时开五门课。先按下面的顺序完成一个最小项目，再把目录里的其他主题当作按需查阅的工具书。
:::

## 推荐学习顺序

1. **C# 与 ASP.NET Core**：掌握依赖注入、中间件、路由、配置和 Web API。
2. **MVC 架构**：理解模型、视图、控制器的职责边界与分层测试。
3. **Razor**：掌握布局、分部视图、标签助手和输出编码。
4. **Web Forms 与 Web Pages**：理解服务器控件、ViewState 和页面生命周期，能维护旧系统。
5. **PowerShell**：用对象管道和脚本自动完成部署、备份与批量运维。

## 全部主题

下表覆盖本方向在 StarLearn 课程目录中的全部主题。标记为“本站精讲”的可以直接进入中文教程；标记为“详细文档”的会打开对应技术的官方文档，适合补充语法细节和查阅示例。

| 主题 | 学什么 | 入口 |
| --- | --- | --- |
| ASP.NET | ASP.NET Core Web 应用、路由、中间件与 API。 | [本站精讲](../csharp/aspnet.html) |
| MVC 架构 | Model、View、Controller 分层与 ASP.NET MVC 工作流。 | [详细文档 ↗](https://learn.microsoft.com/en-us/aspnet/core/mvc/overview) |
| Razor 模板引擎 | Razor 语法、布局、分部视图与页面渲染。 | [详细文档 ↗](https://learn.microsoft.com/en-us/aspnet/core/razor-pages/) |
| Web Forms | ASP.NET Web Forms 事件模型、控件与服务器端页面。 | [详细文档 ↗](https://learn.microsoft.com/en-us/aspnet/web-forms/) |
| Web Pages | 轻量 ASP.NET Web Pages 与 Razor 页面开发。 | [详细文档 ↗](https://learn.microsoft.com/en-us/aspnet/web-pages/overview/getting-started/introducing-razor-syntax-c) |
| PowerShell | Windows 自动化、对象管道、脚本与任务调度。 | [详细文档 ↗](https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/00-introduction) |

## 学完后的检查点

- 能解释 MVC 与 Web Forms 的核心差异。
- 能写出带验证和依赖注入的 API。
- 能用 PowerShell 脚本完成一个定时备份任务。

:::note 学习建议
每学完一个主题，至少留下三样东西：一段可运行的代码、一条自己的解释、一个能复现的踩坑记录。把它们放进笔记或项目仓库，比“看过”更能证明掌握。
:::

