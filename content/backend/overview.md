---
title: 后端开发学习地图：语言、接口与部署
description: Node.js、Java、Go、Rust、C#、PHP、Servlet/JSP、RESTful API、Docker 与 Linux 的后端全景路线。
category: backend
order: 1
tags: [后端, Node.js, Java Web, RESTful API]
updated: 2026-11-12
---

# 后端开发学习地图：语言、接口与部署

后端工程师交付的不是“代码文件”，而是稳定、可观测、可部署的服务。语言只是入口，真正的主线是接口设计、数据一致性、权限、日志、测试和上线。先选一门主语言，再围绕一个 API 项目补齐工程能力。

![后端开发图标（Simple Icons CC0 / Lucide ISC）](/static/img/icons/si-nodedotjs.svg)

:::tip 先选一条主线
不要同时开五门课。先按下面的顺序完成一个最小项目，再把目录里的其他主题当作按需查阅的工具书。
:::

## 推荐学习顺序

1. **选择主语言**：Java、C#、Node.js、Go、Rust 或 PHP 任选一门，先能写出模块化服务。
2. **HTTP 与 RESTful API**：掌握方法、状态码、幂等、分页、错误格式和 OpenAPI 文档。
3. **Java Web 或框架生态**：Servlet/JSP 用于理解 Java Web 基础；现代项目优先 Spring Boot、ASP.NET Core 或 Express/Nest。
4. **Docker 与 Linux**：能构建镜像、配置环境变量、查看日志，并在服务器上运行服务。
5. **ZooKeeper 与分布式基础**：理解协调、选主、配置管理和一致性边界。

## 全部主题

下表覆盖本方向在 StarLearn 课程目录中的全部主题。标记为“本站精讲”的可以直接进入中文教程；标记为“详细文档”的会打开对应技术的官方文档，适合补充语法细节和查阅示例。

| 主题 | 学什么 | 入口 |
| --- | --- | --- |
| Node.js | JavaScript 服务端运行时、事件循环、模块与 Web 服务。 | [详细文档 ↗](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs) |
| Electron | 用 Web 技术构建 Windows、macOS 与 Linux 桌面应用。 | [详细文档 ↗](https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app) |
| PHP | 经典 Web 后端语言、表单处理、数据库与框架生态。 | [详细文档 ↗](https://www.php.net/manual/en/tutorial.php) |
| Java | JVM、面向对象、集合、异常与 Spring Boot 后端开发。 | [本站精讲](../java/index.html) |
| Go | 并发模型、标准库与云原生服务开发。 | [详细文档 ↗](https://go.dev/tour/) |
| Rust | 所有权、借用检查与高性能系统编程。 | [详细文档 ↗](https://doc.rust-lang.org/book/) |
| C# | .NET 核心语言，从语法到 ASP.NET Core Web API。 | [本站精讲](../csharp/index.html) |
| Servlet | Java Web 基础、请求响应、会话与过滤器。 | [详细文档 ↗](https://jakarta.ee/learn/docs/jakartaee-tutorial/current/web/servlets/servlets.html) |
| JSP | JavaServer Pages 模板、表达式、标签与 Web 应用。 | [详细文档 ↗](https://jakarta.ee/specifications/pages/) |
| ASP | 经典 ASP 服务端脚本与旧 Web 系统维护。 | [详细文档 ↗](https://learn.microsoft.com/en-us/previous-versions/iis/6.0-sdk/ms525174(v=vs.90)) |
| VBScript | Windows 脚本与经典 ASP 页面中的 VBScript 语法。 | [详细文档 ↗](https://learn.microsoft.com/en-us/previous-versions/t0aew7h6(v=vs.85)) |
| AppML | 面向数据驱动 Web 应用的轻量框架。 | [详细文档 ↗](https://www.w3schools.com/appml/) |
| Swagger | 用 OpenAPI 描述、调试和生成 API 文档。 | [详细文档 ↗](https://swagger.io/docs/) |
| RESTful API | 资源建模、HTTP 方法、状态码与接口设计规范。 | [详细文档 ↗](https://developer.mozilla.org/en-US/docs/Glossary/REST) |
| Docker | 镜像、容器、网络、数据卷与多服务编排。 | [本站精讲](../server/docker.html) |
| Linux | 命令行、权限、进程、systemd 与服务器运维。 | [本站精讲](../linux/index.html) |
| ZooKeeper | 分布式协调、配置管理、命名服务与选主机制。 | [详细文档 ↗](https://zookeeper.apache.org/doc/current/) |

## 学完后的检查点

- 能设计一组带鉴权、分页和错误码的 REST API。
- 能写健康检查、结构化日志和一条自动化测试。
- 能用 Docker 和反向代理把服务部署到 Linux。

:::note 学习建议
每学完一个主题，至少留下三样东西：一段可运行的代码、一条自己的解释、一个能复现的踩坑记录。把它们放进笔记或项目仓库，比“看过”更能证明掌握。
:::

