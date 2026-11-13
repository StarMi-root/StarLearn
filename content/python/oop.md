---
title: Python 面向对象
description: 类、实例、属性、继承、dataclass、property 与组合，写出清晰可维护的 Python 对象模型。
category: python
order: 5
tags: [Python, OOP, dataclass, 继承]
updated: 2026-11-12
---

# Python 面向对象

Python 一切皆对象，但并不意味着所有代码都要写成类。类适合封装**状态 + 行为**，尤其是当多个函数共享同一组数据时。

## 类与实例

```python
class Course:
    platform = "StarLearn"  # 类属性，所有实例共享

    def __init__(self, title: str, minutes: int):
        self.title = title
        self.minutes = minutes

    def summary(self) -> str:
        return f"{self.title}：{self.minutes} 分钟"

    def __repr__(self) -> str:
        return f"Course(title={self.title!r}, minutes={self.minutes})"


course = Course("Python", 200)
print(course.summary())
print(course)
```

- `__init__` 初始化实例。
- `self` 指向当前实例。
- `__repr__` 面向开发者，调试时有用；`__str__` 面向用户。

## 属性与校验

```python
class Course:
    def __init__(self, title: str, minutes: int):
        self.title = title
        self.minutes = minutes

    @property
    def minutes(self) -> int:
        return self._minutes

    @minutes.setter
    def minutes(self, value: int) -> None:
        if value <= 0:
            raise ValueError("时长必须大于 0")
        self._minutes = value
```

`property` 让外部像访问属性一样调用 getter/setter，同时保留校验逻辑。不要为每个字段机械地写 getter/setter，优先使用普通属性。

## dataclass

```python
from dataclasses import dataclass, field


@dataclass(frozen=True)
class Money:
    amount: float
    currency: str = "CNY"

    def add(self, other: "Money") -> "Money":
        if self.currency != other.currency:
            raise ValueError("币种不一致")
        return Money(self.amount + other.amount, self.currency)


price = Money(99.0)
print(price.add(Money(1.0)))
```

`dataclass` 自动生成 `__init__`、`__repr__`、`__eq__`。`frozen=True` 生成不可变对象，适合值对象与配置。

需要可变默认值时用 `field(default_factory=list)`。

## 继承与多态

```python
from abc import ABC, abstractmethod


class Exporter(ABC):
    @abstractmethod
    def export(self, data: list[dict]) -> str:
        raise NotImplementedError


class JsonExporter(Exporter):
    def export(self, data: list[dict]) -> str:
        import json
        return json.dumps(data, ensure_ascii=False, indent=2)


class CsvExporter(Exporter):
    def export(self, data: list[dict]) -> str:
        if not data:
            return ""
        headers = ",".join(data[0].keys())
        rows = [",".join(str(v) for v in row.values()) for row in data]
        return "\n".join([headers, *rows])
```

调用方只依赖 `Exporter`，未来增加 Markdown 导出不需要改业务代码。继承适合“is-a”关系，复杂场景优先组合。

## 组合

```python
class CourseService:
    def __init__(self, repository, exporter):
        self.repository = repository
        self.exporter = exporter

    def export_all(self) -> str:
        courses = self.repository.list_all()
        return self.exporter.export([c.__dict__ for c in courses])
```

组合让依赖显式化，也更容易测试。把“数据库、导出格式、通知方式”拆成可替换组件。

## 魔术方法

```python
class Course:
    def __init__(self, title: str):
        self.title = title

    def __str__(self) -> str:
        return self.title

    def __len__(self) -> int:
        return len(self.title)

    def __eq__(self, other: object) -> bool:
        return isinstance(other, Course) and self.title == other.title
```

常见魔术方法：`__str__`、`__repr__`、`__eq__`、`__hash__`、`__iter__`、`__enter__/__exit__`。只在语义自然时实现，避免魔法过头。

## 类方法与静态方法

```python
class Course:
    def __init__(self, title: str):
        self.title = title

    @classmethod
    def from_dict(cls, data: dict) -> "Course":
        return cls(data["title"])

    @staticmethod
    def is_valid_title(title: str) -> bool:
        return bool(title and title.strip())
```

`classmethod` 常用于替代构造函数，`staticmethod` 只是放在类命名空间里的普通函数。若函数不需要类状态，放在模块级也很好。

:::tip 设计检查
如果一个类只有一个方法，或者所有方法都不使用 `self`，它可能更适合写成函数。对象应该封装真正的状态与不变量。
:::

## 小练习

1. 用 `dataclass` 表示订单与订单项，计算总价。
2. 定义 `PaymentMethod` 抽象类，实现微信、支付宝、银行卡三种策略。
3. 给课程类增加 `duration_text` 属性，输出“3 小时 20 分钟”。

## 下一步

- [文件、异常与 JSON](/python/files.html)
- [Python 练习课](/python/practice.html)
