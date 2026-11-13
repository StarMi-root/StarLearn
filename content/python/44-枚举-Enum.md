# 第 9 章 进阶特性

# 44. 枚举 Enum

## 学习目标

- 理解枚举意义
- 掌握 Enum 与 IntEnum
- 学会自定义枚举

## 44.1 基本用法

```python
from enum import Enum, auto

class Color(Enum):
    RED = 1
    GREEN = 2
    BLUE = 3

print(Color.RED)        # Color.RED
print(Color.RED.value)   # 1
print(Color(1))          # Color.RED
```

## 44.2 auto()

```python
class Status(Enum):
    PENDING = auto()    # 1
    ACTIVE = auto()     # 2
    CLOSED = auto()     # 3
```

## 44.3 IntEnum 与 IntFlag

```python
from enum import IntEnum, IntFlag

class HTTPMethod(IntEnum):
    GET = 1
    POST = 2
    PUT = 3

# 与 int 比较
print(HTTPMethod.GET == 1)  # True
```

```python
class Permission(IntFlag):
    READ = 1
    WRITE = 2
    EXECUTE = 4

p = Permission.READ | Permission.WRITE
print(Permission.READ in p)  # True
```

## 44.4 枚举成员方法

```python
class Color(Enum):
    RED = 1
    GREEN = 2

    @property
    def hex(self):
        return {1: "#ff0000", 2: "#00ff00"}.get(self.value)

print(Color.RED.hex)  # #ff0000
```

## 44.5 比较

```python
Color.RED == Color.RED      # True
Color.RED is Color.RED      # True（单例）
Color.RED == 1              # False（Enum 不与 int 比较）
```

## 44.6 迭代

```python
for c in Color:
    print(c.name, c.value)
```

## 44.7 序列化

```python
import json

class Color(Enum):
    RED = 1

# 直接序列化 value
json.dumps({"color": Color.RED.value})

# 自定义
def default(o):
    if isinstance(o, Color):
        return o.value
json.dumps({"color": Color.RED}, default=default)
```

## 44.8 何时用

- 固定集合（状态、颜色、权限）
- 替代魔法数字
- 类型安全

## 44.9 替代方案

- 常量（`class Constants:`）
- 字符串枚举
- dataclass 枚举

## 44.10 最佳实践

```python
# 差
status = "active"

# 好
class Status(Enum):
    ACTIVE = "active"

status = Status.ACTIVE
```

## 小结

- 枚举替代魔法数字
- `IntEnum` 可与 int 比较
- `IntFlag` 支持位运算
- 序列化用 value
