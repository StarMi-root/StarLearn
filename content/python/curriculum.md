---
title: Python 全栈学习地图：Web、数据科学与量化
description: 把 Python 基础、FastAPI/Flask/Django、NumPy/Pandas 数据分析、Jupyter 与量化交易串成一条可执行路线。
category: python
order: 8
tags: [Python, 数据科学, FastAPI, 量化交易]
updated: 2026-11-12
---

# Python 全栈学习地图：Web、数据科学与量化

Python 的优势不是语法短，而是生态完整：同一门语言可以写自动化脚本、Web API、数据分析、机器学习和量化研究。先打牢语言基础，再按目标选择 Web 或数据方向，不要一开始就把所有库都学一遍。

![Python / 数据科学图标（Simple Icons CC0 / Lucide ISC）](/static/img/icons/si-python.svg)

:::tip 先选一条主线
不要同时开五门课。先按下面的顺序完成一个最小项目，再把目录里的其他主题当作按需查阅的工具书。
:::

## 推荐学习顺序

1. **Python3 教程**：掌握语法、函数、类、异常、文件与虚拟环境，能独立写 200 行左右的小工具。
2. **NumPy 与 Pandas**：理解数组、DataFrame、缺失值、分组与合并，完成一份真实数据的清洗。
3. **Matplotlib 与 Jupyter**：把分析过程记录成可复现的 Notebook，并输出清晰的图表。
4. **FastAPI、Flask 或 Django**：三选一先做 Web API：FastAPI 适合新项目，Flask 适合轻量服务，Django 适合完整业务系统。
5. **量化交易**：用历史行情做策略回测，先控制风险与交易成本，再讨论收益。

## 全部主题

下表覆盖本方向在 StarLearn 课程目录中的全部主题。标记为“本站精讲”的可以直接进入中文教程；标记为“详细文档”的会打开对应技术的官方文档，适合补充语法细节和查阅示例。

| 主题 | 学什么 | 入口 |
| --- | --- | --- |
| Python3 教程 | 从语法、函数、面向对象到文件与虚拟环境，建立 Python 编程基础。 | [本站精讲](../python/index.html) |
| Python 2.x 教程 | Python 2.x 语法与迁移注意事项，维护旧项目时快速对照。 | [详细文档 ↗](https://docs.python.org/2/tutorial/) |
| FastAPI | 基于类型注解的现代 Python API 框架，自动生成 OpenAPI 文档。 | [详细文档 ↗](https://fastapi.tiangolo.com/tutorial/) |
| Flask | 轻量灵活的 Python Web 框架，适合从原型到中小型服务。 | [详细文档 ↗](https://flask.palletsprojects.com/en/stable/tutorial/) |
| Django | 自带 ORM、后台与认证的全栈 Web 框架，适合业务系统。 | [详细文档 ↗](https://docs.djangoproject.com/en/stable/intro/tutorial01/) |
| NumPy | 多维数组、广播与向量化计算，Python 数据科学的基础。 | [详细文档 ↗](https://numpy.org/doc/stable/user/absolute_beginners.html) |
| Pandas | DataFrame 数据清洗、分组、合并与时间序列分析。 | [详细文档 ↗](https://pandas.pydata.org/docs/user_guide/10min.html) |
| SciPy | 科学计算、优化、积分、信号处理与稀疏矩阵工具集。 | [详细文档 ↗](https://docs.scipy.org/doc/scipy/tutorial/index.html) |
| Matplotlib | 用 Python 绘制折线图、柱状图、散点图与出版级图表。 | [详细文档 ↗](https://matplotlib.org/stable/users/explain/quick_start.html) |
| Dash | 用 Python 构建交互式数据看板与 Web 分析应用。 | [详细文档 ↗](https://dash.plotly.com/tutorial) |
| Jupyter Notebook | 交互式 Notebook 环境，边写代码边记录实验过程。 | [详细文档 ↗](https://docs.jupyter.org/en/latest/) |
| Pillow | Python 图像读取、裁剪、缩放、滤镜与批量处理。 | [详细文档 ↗](https://pillow.readthedocs.io/en/stable/handbook/tutorial.html) |
| 量化交易 | 从行情数据、策略回测到风险控制，用 Python 建立量化研究流程。 | [本站精讲](../python/quant.html) |
| R 语言 | 面向统计分析与可视化的语言，适合数据探索与学术研究。 | [详细文档 ↗](https://cran.r-project.org/manuals.html) |
| Julia 语言 | 兼顾开发效率与高性能的科学计算语言。 | [详细文档 ↗](https://docs.julialang.org/en/v1/manual/getting-started/) |

## 学完后的检查点

- 能从 CSV 读取数据并完成清洗、聚合和图表输出。
- 能设计 3 个 REST 接口并生成接口文档。
- 能解释回测中的过拟合、滑点和最大回撤。

:::note 学习建议
每学完一个主题，至少留下三样东西：一段可运行的代码、一条自己的解释、一个能复现的踩坑记录。把它们放进笔记或项目仓库，比“看过”更能证明掌握。
:::

