---
title: DevOps 学习地图：版本控制、构建与文档
description: Git、SVN、CMake、Maven、VS Code、PyCharm、Eclipse、Obsidian、Markdown 与 LaTeX 的工程化工具链。
category: devops
order: 1
tags: [Git, CMake, Maven, LaTeX]
updated: 2026-11-12
---

# DevOps 学习地图：版本控制、构建与文档

工程化工具的价值是减少重复决策：代码如何版本化、依赖如何锁定、构建如何复现、知识如何沉淀。不要一次装完所有工具，而是围绕一个真实项目逐步引入，形成稳定习惯。

![DevOps / 工程化图标（Simple Icons CC0 / Lucide ISC）](/static/img/icons/si-git.svg)

:::tip 先选一条主线
不要同时开五门课。先按下面的顺序完成一个最小项目，再把目录里的其他主题当作按需查阅的工具书。
:::

## 推荐学习顺序

1. **Git 与 Markdown**：掌握提交、分支、合并、冲突处理和可读的变更说明。
2. **编辑器与 IDE**：在 VS Code、PyCharm、Eclipse 中配置格式化、调试和远程开发。
3. **构建工具**：CMake 管理 C/C++ 目标，Maven 管理 Java 依赖与多模块构建。
4. **文档与知识库**：用 Obsidian 建立双链笔记，用 LaTeX 输出正式论文或技术文档。
5. **SVN 与遗留协作**：理解集中式版本控制的工作方式，能维护旧项目。

## 全部主题

下表覆盖本方向在 StarLearn 课程目录中的全部主题。标记为“本站精讲”的可以直接进入中文教程；标记为“详细文档”的会打开对应技术的官方文档，适合补充语法细节和查阅示例。

| 主题 | 学什么 | 入口 |
| --- | --- | --- |
| Git | 版本控制、分支、合并、冲突解决与团队协作。 | [本站精讲](../reference/git.html) |
| SVN | 集中式版本控制、检出、提交、分支与旧项目协作。 | [详细文档 ↗](https://subversion.apache.org/docs/) |
| CMake | 跨平台 C/C++ 构建系统、目标与依赖管理。 | [详细文档 ↗](https://cmake.org/cmake/help/latest/guide/tutorial/) |
| Maven | Java 项目构建、依赖管理、生命周期与多模块。 | [详细文档 ↗](https://maven.apache.org/guides/getting-started/) |
| VS Code | 轻量编辑器、扩展、调试与远程开发工作流。 | [详细文档 ↗](https://code.visualstudio.com/docs) |
| PyCharm | Python IDE、调试、虚拟环境与重构工具。 | [详细文档 ↗](https://www.jetbrains.com/help/pycharm/quick-start-guide.html) |
| Eclipse | Java IDE、项目结构、调试与插件生态。 | [详细文档 ↗](https://www.eclipse.org/documentation/) |
| Obsidian | 本地 Markdown 笔记、双链、知识图谱与插件。 | [详细文档 ↗](https://help.obsidian.md/) |
| Markdown | 标题、列表、代码块、表格、链接与文档排版。 | [本站精讲](../reference/markdown.html) |
| LaTeX | 学术论文排版、数学公式、图表与参考文献管理。 | [详细文档 ↗](https://www.latex-project.org/help/documentation/) |

## 学完后的检查点

- 能用 Git 完成一次多人协作并解决冲突。
- 能从零配置一个可复现的构建命令。
- 能把学习笔记整理成可检索、可导出的知识库。

:::note 学习建议
每学完一个主题，至少留下三样东西：一段可运行的代码、一条自己的解释、一个能复现的踩坑记录。把它们放进笔记或项目仓库，比“看过”更能证明掌握。
:::

