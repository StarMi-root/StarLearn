# 第 9 章 进阶特性

# 43. 数据类 dataclass

## 学习目标

- 掌握 @dataclass
- 学会字段定义
- 了解高级选项

## 43.1 基本用法

```python
from dataclasses import dataclass

@dataclass
class Point:
    x: float
    y: float

p = Point(1.0, 2.0)
print(p)  # Point(x=1.0, y=2.0)
print(p.x)
```

自动生成 `__init__`、`__repr__`、`__eq__`。

## 43.2 字段默认值

```python
@dataclass
class Config:
    host: str = "localhost"
    port: int = 8080
    debug: bool = False
```

## 43.3 默认值工厂

```python
from dataclasses import field

@dataclass
class Order:
    items: list = field(default_factory=list)
    total: float = 0.0
```

避免可变默认值陷阱。

## 43.4 不可变

```python
@dataclass(frozen=True)
class Point:
    x: float
    y: float

p = Point(1, 2)
p.x = 3  # FrozenInstanceError
```

frozen 后可哈希。

## 43.5 顺序

```python
@dataclass(order=True)
class Student:
    name: str
    score: int = field(compare=False)  # 不参与比较

# 或
@dataclass(order=True)
class Student:
    score: int
    name: str = field(compare=False)
```

## 43.6 转换

```python
from dataclasses import asdict

p = Point(1, 2)
asdict(p)  # {'x': 1, 'y': 2}

# 嵌套
from dataclasses import asdict, fields
for f in fields(p):
    print(f.name, f.default)
```

## 43.7 继承

```python
@dataclass
class Animal:
    name: str

@dataclass
class Dog(Animal):
    breed: str

Dog("Rex", "Lab")  # Dog(name='Rex', breed='Lab')
```

## 43.8 与普通类对比

| 特性 | 普通类 | dataclass |
|------|--------|-----------|
| 样板代码 | 手写 | 自动生成 |
| 不可变 | 手动 | frozen=True |
| 可读性 | 高 | 高 |

## 43.9 何时用

- 纯数据容器
- 配置对象
- API 模型
- 需要 `__eq__` 比较

## 43.10 何时不用

- 复杂行为
- 需要自定义 `__init__` 逻辑
- 性能敏感（dataclass 略有开销）

## 小结

- `@dataclass` 减少样板
- 默认值用 `field(default_factory=...)`
- `frozen=True` 不可变
- 嵌套转换用 `asdict`
