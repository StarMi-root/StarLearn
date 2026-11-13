---
title: Python 文件、异常与 JSON
description: 用 pathlib、with、json、csv 与 logging 处理真实数据，并建立可靠的异常处理习惯。
category: python
order: 6
tags: [Python, 文件, 异常, JSON, logging]
updated: 2026-11-12
---

# Python 文件、异常与 JSON

真实程序离不开读写文件、处理外部数据和记录日志。核心原则是：**使用上下文管理器、明确异常边界、不要把错误静默吞掉**。

## pathlib 路径操作

```python
from pathlib import Path

base = Path.home() / "starlearn-data"
base.mkdir(parents=True, exist_ok=True)

file = base / "courses.json"
print(file.exists(), file.suffix, file.parent)

for path in base.glob("*.md"):
    print(path.name)
```

`pathlib` 比字符串拼接更安全、跨平台。路径不存在时 `open` 会抛异常，必要时先检查或使用 `try/except`。

## 读写文本

```python
from pathlib import Path

path = Path("notes.md")
path.write_text("# 学习笔记\n\n今天学习了 pathlib。\n", encoding="utf-8")

text = path.read_text(encoding="utf-8")
print(text)
```

始终显式指定 `encoding="utf-8"`，避免不同系统默认编码不一致。写入大量内容或需要逐行处理时使用文件对象：

```python
with path.open("a", encoding="utf-8") as f:
    f.write("\n- 新增一条笔记\n")
```

`with` 会在代码块结束时自动关闭文件，即使中途抛出异常。

## 异常处理

```python
from pathlib import Path

def read_config(path: Path) -> dict:
    try:
        text = path.read_text(encoding="utf-8")
    except FileNotFoundError:
        return {}
    except PermissionError as exc:
        raise RuntimeError(f"没有权限读取 {path}") from exc
    return {"raw": text}
```

- 捕获你能处理的异常。
- 不要写裸 `except:`。
- 需要转换异常时使用 `raise ... from exc` 保留因果链。
- 不要用异常控制正常流程；可预期的情况先判断。

## JSON

```python
import json
from pathlib import Path

data = {
    "title": "Python 文件课",
    "tags": ["python", "json"],
    "published": True,
}

path = Path("course.json")
path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

loaded = json.loads(path.read_text(encoding="utf-8"))
print(loaded["title"])
```

读写文件对象时用 `json.dump` / `json.load`。`ensure_ascii=False` 让中文保持可读。

## CSV

```python
import csv
from pathlib import Path

rows = [
    {"name": "Ada", "score": 98},
    {"name": "Linus", "score": 95},
]

path = Path("scores.csv")
with path.open("w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "score"])
    writer.writeheader()
    writer.writerows(rows)

with path.open(newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        print(row["name"], row["score"])
```

CSV 不擅长嵌套结构。复杂数据用 JSON 或数据库，不要硬塞。

## 日志

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s - %(message)s",
)
logger = logging.getLogger("starlearn")

logger.info("应用启动")
logger.warning("配置缺失，使用默认值")
```

不要用 `print` 记录生产日志。日志应包含时间、级别、模块和上下文；敏感信息（密码、Token、身份证号）必须脱敏。

## 文件处理最佳实践

- 大文件逐行读取，不要一次 `read()` 全部进内存。
- 写入重要文件时先写临时文件，再原子替换。
- 定期清理临时文件与旧日志。
- 处理用户上传文件时校验类型、大小和路径，防止目录穿越。

```python
def safe_join(base: Path, user_path: str) -> Path:
    target = (base / user_path).resolve()
    if base.resolve() not in target.parents and target != base.resolve():
        raise ValueError("非法路径")
    return target
```

## 小练习

1. 读取一个 Markdown 文件，统计标题数量与总字数。
2. 把 JSON 课程数据导出为 CSV。
3. 写一个日志装饰器，记录函数耗时与异常。

## 下一步

- [Python 练习课](/python/practice.html)
- [Python 自动化项目](/projects/python-cli.html)
