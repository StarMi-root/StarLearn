---
title: Python 列表、字典与集合
description: 掌握 list、tuple、dict、set 的常用操作、切片、推导式、可变性与深浅拷贝。
category: python
order: 3
tags: [Python, list, dict, set, 数据结构]
updated: 2026-11-12
---

# Python 列表、字典与集合

Python 内置容器是日常开发的主力。选择正确的结构，代码往往能同时变得更短、更快、更清晰。

## 列表 list

有序、可变、元素可重复。

```python
courses = ["C#", "Python", "Linux"]
courses.append("AI")
courses.insert(1, "Avalonia")
courses.remove("Python")
last = courses.pop()

print(courses)
print(courses[0], courses[-1])
print(courses[1:3])
```

常用操作：

```python
nums = [3, 1, 4, 1, 5]
nums.sort()                 # 原地排序
ordered = sorted(nums, reverse=True)
print(nums.count(1))
print(len(nums), sum(nums), max(nums), min(nums))
print(2 in nums)
```

切片 `start:stop:step` 不包含 `stop`。切片的赋值可以替换一段元素：

```python
letters = list("abcdef")
letters[1:3] = ["X", "Y", "Z"]
print(letters)  # ['a', 'X', 'Y', 'Z', 'd', 'e', 'f']
```

## 元组 tuple

有序、不可变，适合表达固定结构的数据。

```python
point = (3, 5)
x, y = point
print(x, y)

def min_max(values):
    return min(values), max(values)

low, high = min_max([4, 2, 9])
```

单元素元组必须带逗号：`(1,)`，否则只是带括号的整数。

## 字典 dict

键值映射，键必须可哈希且唯一。Python 3.7+ 保持插入顺序。

```python
course = {
    "title": "Python 入门",
    "minutes": 180,
    "tags": ["python", "基础"],
}

print(course["title"])
print(course.get("level", "未设置"))
course["level"] = "初级"

for key, value in course.items():
    print(key, value)

updated = {**course, "minutes": 200}
```

遍历字典时不要同时增删键，需要修改时先复制键列表或构造新字典。

## 集合 set

无序、元素唯一，适合去重与集合运算。

```python
a = {"csharp", "python", "linux"}
b = {"python", "ai", "linux"}

print(a | b)   # 并集
print(a & b)   # 交集
print(a - b)   # 差集
print(a ^ b)   # 对称差

tags = ["python", "ai", "python"]
unique = list(set(tags))
```

集合元素必须可哈希，列表不能直接放进集合；需要时转成元组。

## 推导式

```python
courses = [
    {"title": "C#", "minutes": 180},
    {"title": "Python", "minutes": 200},
    {"title": "AI", "minutes": 300},
]

titles = [c["title"] for c in courses]
long_courses = {c["title"]: c["minutes"] for c in courses if c["minutes"] >= 200}
print(titles, long_courses)
```

推导式适合“转换 + 过滤”。如果逻辑需要多个分支或副作用，用普通循环。

## 可变性与拷贝

```python
a = [1, 2, 3]
b = a          # 同一个对象
b.append(4)
print(a)       # [1, 2, 3, 4]

c = a.copy()   # 浅拷贝
c.append(5)
print(a)       # 不变

nested = [[1, 2], [3, 4]]
shallow = nested.copy()
shallow[0][0] = 99
print(nested)  # [[99, 2], [3, 4]]
```

浅拷贝只复制第一层，嵌套对象仍共享。需要完全独立时用 `copy.deepcopy`。

## 什么时候用什么

| 需求 | 选择 |
|---|---|
| 有序、需要增删 | `list` |
| 固定记录、不可变 | `tuple` / `NamedTuple` / `dataclass(frozen=True)` |
| 按键查找 | `dict` |
| 去重、集合运算 | `set` |
| 先进先出队列 | `collections.deque` |
| 计数 | `collections.Counter` |

```python
from collections import Counter, defaultdict

words = ["py", "ai", "py", "linux"]
counts = Counter(words)
print(counts.most_common(2))

groups = defaultdict(list)
for name, level in [("Ada", "高级"), ("Linus", "初级"), ("Grace", "高级")]:
    groups[level].append(name)
print(dict(groups))
```

:::tip 可读性优先
能用一个 `dict` 解决的问题，不要写三个并行列表。能用 `dataclass` 表达的结构，不要用位置元组硬凑。
:::

## 小练习

1. 统计一段文本中每个单词出现的次数，输出前 5 个。
2. 合并两个字典，重复键以第二个字典为准。
3. 给定课程列表，按分类分组并计算每类总时长。

## 下一步

- [函数与模块](/python/functions.html)
- [面向对象](/python/oop.html)
