---
title: Python 简介与环境搭建
description: 安装 Python、创建虚拟环境、运行第一个脚本，并理解解释执行、包管理与项目结构。
category: python
order: 1
tags: [Python, 环境, venv, pip]
updated: 2026-11-12
---

# Python 简介与环境搭建

Python 是一门强调可读性与开发效率的通用语言。它广泛用于自动化脚本、Web 后端、数据分析、机器学习与 AI 工具链。语法接近自然语言，但“容易写”不代表“随便写”，工程化习惯同样重要。

![Python 插画（开源图标：Simple Icons CC0 / Lucide ISC）](/static/img/icons/si-python.svg)

## 安装 Python

### Windows

从 python.org 下载安装包，安装时勾选 **Add Python to PATH**。然后验证：

```powershell
python --version
pip --version
```

### Linux

```bash
sudo apt update
sudo apt install -y python3 python3-pip python3-venv
python3 --version
```

### macOS

```bash
brew install python
python3 --version
```

建议使用 Python 3.11 或更新版本。生产项目应固定小版本，例如 3.12，避免依赖行为漂移。

## 第一个脚本

创建 `hello.py`：

```python
name = input("请输入你的名字：")
print(f"你好，{name}！欢迎来到StarLearn。")
```

运行：

```bash
python hello.py
```

Python 是解释型语言：源码由解释器读取、编译为字节码后执行。你不需要手动 `build`，但仍应定期运行测试与类型检查。

## REPL 与调试

直接输入 `python` 进入交互式环境：

```python
>>> 1 + 2
3
>>> "code" * 3
'codecodecode'
```

快速验证语法、函数行为时很方便。退出用 `exit()` 或 `Ctrl+D`。

## 虚拟环境

不要把所有项目的依赖都装进系统 Python。每个项目单独创建虚拟环境：

```bash
mkdir starlearn-python
cd starlearn-python
python3 -m venv .venv
source .venv/bin/activate     # Linux/macOS
# Windows PowerShell: .venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
```

安装依赖：

```bash
pip install requests rich
pip freeze > requirements.txt
pip install -r requirements.txt
```

更现代的依赖管理工具包括 `uv`、Poetry 和 PDM。初学阶段先用 `venv + pip` 理解隔离与锁定，再迁移工具。

## 项目结构

一个可维护的小项目可以这样组织：

```text
starlearn-python/
├── .venv/
├── src/
│   └── starlearn/
│       ├── __init__.py
│       ├── cli.py
│       └── services.py
├── tests/
│   └── test_services.py
├── requirements.txt
├── pyproject.toml
└── README.md
```

`src` 布局能避免“本地能导入、安装后失败”的路径问题。`pyproject.toml` 用于描述项目元数据、构建系统和工具配置。

## 代码风格

```python
from dataclasses import dataclass


@dataclass
class Course:
    title: str
    minutes: int

    @property
    def hours(self) -> float:
        return self.minutes / 60


def format_course(course: Course) -> str:
    return f"{course.title}（{course.hours:.1f} 小时）"
```

- 使用 4 个空格缩进。
- 变量与函数用 `snake_case`，类用 `PascalCase`。
- 模块名短小写，避免与标准库重名。
- 用类型标注表达意图，配合 `mypy` 或 `pyright` 检查。
- 用 `ruff` 统一格式与静态检查。

## 常见问题

**`python` 与 `python3` 不一致**：Linux 上可能只提供 `python3`。虚拟环境激活后使用 `python` 即可。

**pip 安装很慢**：可配置国内镜像，但生产环境要确认镜像可信；也可以在 CI 中缓存依赖。

**脚本导入本地模块失败**：确认从项目根目录运行，或使用 `python -m package.module`，避免依赖当前工作目录的偶然行为。

:::tip 学习建议
每学一个概念，写一个不超过 30 行的小脚本，并运行它。Python 的交互反馈非常快，先用起来，再追求抽象。
:::

## 下一步

- [Python 基础语法](/python/syntax.html)
- [列表、字典与集合](/python/data-structures.html)
- [函数与模块](/python/functions.html)
