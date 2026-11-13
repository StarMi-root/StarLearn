---
title: Python 函数与模块
description: 定义函数、参数、作用域、闭包、lambda、类型标注与模块导入，写出可复用的 Python 代码。
category: python
order: 4
tags: [Python, 函数, 模块, 类型标注]
updated: 2026-11-12
---

# Python 函数与模块

函数是组织逻辑的最小单元。好的函数有清晰的名字、明确的输入输出，并尽量只做一件事。

## 定义与返回

```python
def calculate_total(unit_price: float, quantity: int, discount: float = 0.0) -> float:
    if quantity < 0:
        raise ValueError("数量不能为负")
    subtotal = unit_price * quantity
    return round(subtotal * (1 - discount), 2)


total = calculate_total(29.9, 3, 0.1)
print(total)
```

Python 函数可以返回多个值（本质是元组）：

```python
def split_name(full_name: str) -> tuple[str, str]:
    first, _, last = full_name.partition(" ")
    return first, last

given, family = split_name("Ada Lovelace")
```

## 位置参数与关键字参数

```python
def create_course(title, category="general", *, minutes=60, published=False):
    return {
        "title": title,
        "category": category,
        "minutes": minutes,
        "published": published,
    }

create_course("Python", "backend", minutes=180)
```

`*` 之后的参数只能通过关键字传递，能防止调用方把布尔值顺序写错。

## 可变默认值的坑

```python
# 错误：所有调用共享同一个列表
def add_item_bad(item, items=[]):
    items.append(item)
    return items

# 正确
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items
```

默认参数在函数定义时求值。列表、字典等可变对象不适合作为默认值。

## *args 与 **kwargs

```python
def log(level, *messages, **meta):
    text = " ".join(str(m) for m in messages)
    print(f"[{level}] {text}", meta)

log("INFO", "server", "started", port=8080)
```

`*args` 收集位置参数为元组，`**kwargs` 收集关键字参数为字典。不要滥用，接口清晰比“什么都能传”更重要。

## 作用域与闭包

```python
def make_counter(start=0):
    count = start

    def increment(step=1):
        nonlocal count
        count += step
        return count

    return increment

counter = make_counter(10)
print(counter())   # 11
print(counter(5))  # 16
```

内层函数引用了外层变量，就形成闭包。需要修改外层变量时用 `nonlocal`。全局变量用 `global`，但应尽量避免。

## lambda

```python
courses = [("C#", 180), ("Python", 200), ("AI", 300)]
courses.sort(key=lambda item: item[1], reverse=True)
print(courses)
```

lambda 适合简短的排序键或回调。复杂逻辑应定义普通函数。

## 类型标注

```python
from collections.abc import Iterable

def average(values: Iterable[float]) -> float:
    numbers = list(values)
    if not numbers:
        raise ValueError("values 不能为空")
    return sum(numbers) / len(numbers)
```

类型标注不会在运行时强制检查，但能让编辑器、`mypy`、`pyright` 提前发现错误。公开函数建议标注参数与返回值。

## 模块与包

`math_utils.py`：

```python
def clamp(value: float, low: float, high: float) -> float:
    return max(low, min(value, high))
```

`main.py`：

```python
from math_utils import clamp

print(clamp(120, 0, 100))
```

包是带 `__init__.py` 的目录。导入时避免副作用：不要在模块顶层启动服务器或读取未知文件。

```python
if __name__ == "__main__":
    main()
```

这段判断让模块既能被导入，也能直接运行。

## 文档字符串

```python
def slugify(text: str) -> str:
    """把标题转换为 URL slug。

    Args:
        text: 原始标题。

    Returns:
        仅包含小写字母、数字和连字符的字符串。
    """
    ...
```

写“为什么”和边界条件，不要重复函数名已经表达的信息。

:::note 单一职责
如果一个函数需要三行注释解释它在做什么，通常应该拆成多个小函数。函数名本身应该是一句可执行的说明。
:::

## 小练习

1. 写 `retry(func, times=3)`，在异常时重试。
2. 写装饰器，统计函数执行耗时。
3. 把一组工具函数拆成模块，并用 `python -m` 运行入口。

## 下一步

- [Python 面向对象](/python/oop.html)
- [文件、异常与 JSON](/python/files.html)
