# 第 4 章 函数

# 18. lambda 函数

## 学习目标

- 理解 lambda 语法
- 学会与 map、filter、sorted 配合
- 知道何时该用普通函数

## 18.1 基本语法

```python
# 普通函数
def square(x):
    return x * x

# lambda
square = lambda x: x * x
```

lambda 只能写**单个表达式**。

## 18.2 常见用法

### 与 sorted 配合

```python
words = ["banana", "apple", "cherry"]
words.sort(key=len)                    # 按长度
words.sort(key=str.lower)              # 忽略大小写
words.sort(key=lambda s: s[-1])        # 按最后一个字符
```

### 与 map 配合

```python
nums = [1, 2, 3, 4]
doubled = list(map(lambda x: x * 2, nums))
# [2, 4, 6, 8]
```

### 与 filter 配合

```python
evens = list(filter(lambda x: x % 2 == 0, nums))
# [2, 4]
```

## 18.3 何时用 lambda

| 场景 | 推荐 |
|------|------|
| 简单单表达式 | lambda |
| 复杂逻辑 | def |
| 需要调试 | def |
| 需要文档 | def |

## 18.4 常见陷阱

```python
# 闭包陷阱
funcs = []
for i in range(5):
    funcs.append(lambda: i)

[f() for f in funcs]  # [4, 4, 4, 4, 4]（不是 [0,1,2,3,4]）

# 修复
funcs = []
for i in range(5):
    funcs.append(lambda i=i: i)
```

## 18.5 与列表推导对比

```python
# lambda + map
squares = list(map(lambda x: x * x, range(10)))

# 推导式（更 Pythonic）
squares = [x * x for x in range(10)]
```

推导式通常更清晰，优先使用。

## 小结

- lambda 适合简短、单行
- 复杂逻辑用 def
- 闭包陷阱：用默认值固定变量
