---
title: Python 基础语法
description: 变量、动态类型、字符串、数字、布尔值、条件、循环、match 与推导式，打好 Python 语法基础。
category: python
order: 2
tags: [Python, 语法, 字符串, 循环]
updated: 2026-11-12
---

# Python 基础语法

Python 用缩进表示代码块，变量不需要提前声明类型。动态类型带来灵活性，也要求你通过命名、类型标注和测试保持清晰。

## 变量与类型

```python
name = "StarLearn"
age = 3
price = 19.9
is_active = True
nothing = None

print(type(name))   # <class 'str'>
print(type(age))    # <class 'int'>
```

常用类型：

| 类型 | 示例 | 说明 |
|---|---|---|
| `str` | `"hello"` | 字符串，不可变 |
| `int` | `42` | 任意精度整数 |
| `float` | `3.14` | 浮点数 |
| `bool` | `True` | 布尔值 |
| `NoneType` | `None` | 空值 |
| `list` | `[1, 2]` | 有序可变序列 |
| `dict` | `{"a": 1}` | 键值映射 |

## 字符串

```python
name = "StarLearn"
greeting = f"你好，{name}！"
print(greeting.upper())
print(greeting.strip())
print(greeting.replace("你好", "Hello"))

raw = r"C:\Users\starlearn"       # 原始字符串
multiline = """第一行
第二行"""
print(multiline)
```

`f-string` 是最常用的格式化方式，可以写表达式：

```python
price = 29.9
print(f"价格：¥{price:.2f}")
print(f"是否便宜：{price < 50}")
```

字符串不可变，所有“修改”都会返回新字符串。拼接大量文本时使用 `"".join(parts)`，避免在循环中反复 `+=`。

## 数字与运算

```python
print(7 / 2)    # 3.5
print(7 // 2)   # 3
print(7 % 2)    # 1
print(2 ** 10)  # 1024

total = 0
total += 5
```

浮点数存在精度问题，金额计算建议用 `decimal.Decimal`：

```python
from decimal import Decimal

amount = Decimal("0.1") + Decimal("0.2")
print(amount)  # 0.3
```

## 条件与真值

```python
score = 86

if score >= 90:
    level = "优秀"
elif score >= 60:
    level = "及格"
else:
    level = "需要复习"

print(level)
```

Python 中以下值在布尔上下文中为假：`False`、`None`、`0`、`""`、`[]`、`{}`、`set()`。但不要滥用真值判断，明确写出 `if items:` 或 `if value is not None:` 更清晰。

## 循环

```python
for i in range(3):
    print(i)

courses = ["C#", "Python", "Linux"]
for index, course in enumerate(courses, start=1):
    print(index, course)

count = 0
while count < 3:
    print(f"while {count}")
    count += 1

for n in range(10):
    if n == 3:
        continue
    if n == 6:
        break
    print(n)
```

`range(start, stop, step)` 不包含 `stop`。需要索引时用 `enumerate`，需要并行遍历时用 `zip`。

## match 语句

```python
command = "deploy"

match command:
    case "deploy" | "release":
        print("开始部署")
    case "status":
        print("查看状态")
    case str() as other:
        print(f"未知命令：{other}")
```

`match` 是结构化模式匹配，不只是 switch。初学阶段用于清晰的分支即可。

## 推导式

```python
numbers = [1, 2, 3, 4, 5, 6]
squares = [n * n for n in numbers]
evens = [n for n in numbers if n % 2 == 0]
index = {n: n * n for n in numbers}
unique = {n % 3 for n in numbers}

print(evens)
```

推导式适合简单的映射与过滤。嵌套超过两层时，改用普通循环更易读。

## 输入与输出

```python
name = input("请输入姓名：")
try:
    age = int(input("请输入年龄："))
except ValueError:
    print("年龄必须是整数")
else:
    print(f"{name}，明年你 {age + 1} 岁")
```

`input()` 总是返回字符串。类型转换可能失败，需要捕获 `ValueError`。

:::note 命名规范
变量和函数用 `snake_case`，常量用 `UPPER_CASE`，类用 `PascalCase`。名字要表达业务含义，避免 `data`、`temp`、`x1` 泛滥。
:::

## 小练习

1. 输入一个整数，判断是否为质数。
2. 输出 1–100 中所有能被 3 或 5 整除的数。
3. 用推导式生成一个字典，键为 1–10，值为平方。

## 下一步

- [Python 数据结构](/python/data-structures.html)
- [函数与模块](/python/functions.html)
