# 第 9 章 进阶特性

# 45. 命名元组与 dataclass 对比

## 学习目标

- 掌握 namedtuple
- 了解与 dataclass 的差异
- 学会选型

## 45.1 基本用法

```python
from collections import namedtuple

Point = namedtuple("Point", ["x", "y"])
p = Point(1, 2)
print(p.x, p.y)

# 或
Point2 = namedtuple("Point", "x y")
p2 = Point2(3, 4)
```

## 45.2 特性

```python
# 元组操作
p[0]          # 1
len(p)        # 2
list(p)       # [1, 2]

# 属性访问
p.x           # 1
p.y           # 2

# 解包
x, y = p

# 不可变
p.x = 5  # AttributeError
```

## 45.3 _asdict 与 _replace

```python
p = Point(1, 2)
p._asdict()  # {'x': 1, 'y': 2}
p._replace(x=10)  # Point(x=10, y=2)
```

## 45.4 默认值（Python 3.6.1+）

```python
Point = namedtuple("Point", ["x", "y"], defaults=[0, 0])
p = Point()  # Point(x=0, y=0)
```

## 45.5 dataclass 对比

| 特性 | namedtuple | dataclass |
|------|------------|-----------|
| 不可变 | 是 | 可选（frozen） |
| 默认值 | 有限 | 灵活 |
| 方法 | 无 | 可加 |
| 可读性 | 一般 | 好 |
| 性能 | 略快 | 略慢 |
| 字段类型 | 不支持 | 支持 |
| 继承 | 不支持 | 支持 |

## 45.6 何时用

- **namedtuple**：固定结构、轻量、函数返回值
- **dataclass**：需要默认值、方法、类型注解

## 45.7 实际场景

```python
# 数据库行
Row = namedtuple("Row", ["id", "name", "email"])
row = Row(1, "Alice", "a@b.com")

# 配置
from dataclasses import dataclass
@dataclass
class Config:
    host: str = "localhost"
    port: int = 8080
```

## 45.8 性能考虑

```python
# 大量数据
import timeit
Point = namedtuple("Point", ["x", "y"])
# 比 dataclass 略快（元组底层）
```

## 45.9 陷阱

```python
# 命名不能是关键字
Point = namedtuple("Point", ["class"])  # 错

# 字段不能重复
Point = namedtuple("Point", ["x", "x"])  # 错
```

## 小结

- namedtuple 轻量固定
- dataclass 灵活可扩展
- 简单记录用 namedtuple
- 复杂数据用 dataclass
