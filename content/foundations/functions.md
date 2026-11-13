---
title: 函数：把逻辑封装成可复用单元
description: 参数、返回值、作用域、默认参数、重载、递归、闭包、纯函数与异常处理，用四种语言掌握函数设计。
category: foundations
order: 6
tags: [函数, 参数, 返回值, 递归, 闭包]
updated: 2026-11-13
---

# 函数：把逻辑封装成可复用单元

函数把一段逻辑命名、隔离并复用。好的函数有清晰输入、明确输出和尽量少的副作用；坏的函数依赖隐藏状态、修改外部变量，让调用者无法预测结果。

## 定义与调用

```csharp
static int Add(int a, int b)
{
    return a + b;
}

Console.WriteLine(Add(2, 3)); // 5
```

```python
def add(a, b):
    return a + b

print(add(2, 3))
```

```java
static int add(int a, int b) {
    return a + b;
}

System.out.println(add(2, 3));
```

```javascript
function add(a, b) {
  return a + b;
}

console.log(add(2, 3));
```

- 参数是输入，返回值是输出。
- `void` 表示没有返回值。
- Python 没写 `return` 时返回 `None`；JavaScript 没写 `return` 时返回 `undefined`。

## 参数设计

### 位置参数与命名参数

```csharp
SendEmail(to: "a@example.com", subject: "欢迎", body: "你好");
```

命名参数能让调用处更易读，尤其是多个同类型参数。

### 默认参数

```python
def greet(name, greeting="你好"):
    return f"{greeting}，{name}"

print(greet("星米"))
print(greet("星米", "欢迎"))
```

C# 使用可选参数 `string greeting = "你好"`；Java 通常用重载或 Builder；JavaScript 从 ES6 起支持默认参数。

### 可变参数

```csharp
static int Sum(params int[] values)
{
    return values.Sum();
}
```

```python
def total(*values):
    return sum(values)
```

不要把一堆不相关参数塞进一个函数。参数超过 4-5 个时，考虑用配置对象或拆分函数。

## 返回值与早返回

函数应尽量只有一个明确出口，但遇到错误时“早返回”更清晰：

```csharp
static decimal? CalculateDiscount(decimal price, bool isMember)
{
    if (price < 0) return null;
    if (!isMember) return price;
    return price * 0.9m;
}
```

返回 `null` 表示失败时，调用方必须处理；也可以抛异常、返回结果对象。团队要统一约定，不要同一项目混用多种错误风格。

## 作用域与闭包

函数内部声明的变量默认只在该函数内可见。闭包是“函数记住了定义它的环境”：

```javascript
function counter() {
  let count = 0;
  return () => {
    count += 1;
    return count;
  };
}

const next = counter();
console.log(next()); // 1
console.log(next()); // 2
```

Python 的闭包类似，但修改外层变量需要 `nonlocal`：

```python
def counter():
    count = 0
    def next_value():
        nonlocal count
        count += 1
        return count
    return next_value
```

闭包适合封装状态，但状态不可见会让调试变难。对外暴露的 API 尽量保持无状态。

## 递归

递归是函数调用自身，必须有终止条件：

```python
def factorial(n):
    if n < 0:
        raise ValueError("n 必须是非负整数")
    if n <= 1:
        return 1
    return n * factorial(n - 1)
```

递归适合树、图、分治等天然递归的问题。每次调用都会占用调用栈，深度过大可能栈溢出。能用循环清晰表达时，优先循环。

## 重载与多态

C# 和 Java 支持方法重载：同名方法、不同参数列表。

```csharp
static string Format(int value) => value.ToString();
static string Format(decimal value) => value.ToString("0.00");
```

Python 和 JavaScript 不支持传统重载，通常通过默认参数、类型判断或不同函数名解决。不要依赖运行时类型分支写“万能函数”。

## 纯函数与副作用

纯函数满足两个条件：

1. 相同输入总是得到相同输出。
2. 不修改外部状态，不产生 I/O。

```python
def add_tax(price, rate):
    return price * (1 + rate)
```

纯函数容易测试、组合和并行。副作用（写数据库、发请求、改全局变量）应尽量集中在边界层，核心计算保持纯函数。

## 异常与错误处理

```csharp
try
{
    var user = FindUser(id) ?? throw new InvalidOperationException("用户不存在");
}
catch (InvalidOperationException ex)
{
    logger.LogWarning(ex, "查询用户失败");
}
```

```python
try:
    user = find_user(user_id)
except UserNotFoundError as error:
    logger.warning("查询用户失败: %s", error)
```

异常用于“异常情况”，不要用它做正常分支。可预期的失败（例如表单校验）可以返回结果对象；不可恢复的程序错误才抛异常。

## 函数设计清单

- 名字是动词或动词短语：`calculateTotal`、`sendEmail`。
- 只做一件事；如果描述里出现多个“并且”，考虑拆分。
- 参数尽量少，输入明确。
- 避免修改传入的可变对象，除非函数名表明会修改。
- 错误处理方式统一。
- 为边界和异常写测试。

## 练习：函数

:::quiz
question: 纯函数的核心特征是？
options:
  - "一定没有参数"
  - "相同输入得到相同输出且无副作用"
  - "一定使用递归"
  - "一定返回字符串"
answer: B
explain: 纯函数不依赖外部可变状态，也不修改外部状态。
:::

:::quiz
question: 递归函数必须具备什么？
options:
  - "至少两个参数"
  - "终止条件"
  - "全局变量"
  - "循环"
answer: B
explain: 没有终止条件会无限递归，最终栈溢出。
:::

:::quiz
question: Python 中修改闭包外层变量需要使用？
options:
  - "global"
  - "nonlocal"
  - "static"
  - "final"
answer: B
explain: nonlocal 用于声明并修改外层函数作用域的变量。
:::

:::quiz
question: 函数参数超过 5 个时，较好的做法是？
options:
  - "继续增加参数"
  - "用配置对象或拆分函数"
  - "全部改成全局变量"
  - "删除参数"
answer: B
explain: 参数过多通常意味着职责过多，配置对象能提升可读性。
:::

:::quiz
question: 关于异常，下列说法正确的是？
options:
  - "所有分支都应该用异常"
  - "异常适合不可预期或无法继续的情况"
  - "异常一定比返回值快"
  - "异常不需要捕获"
answer: B
explain: 可预期失败可用结果对象，异常用于异常情况。
:::

:::quiz
question: 哪个函数名更符合“计算总价”的语义？
options:
  - "total"
  - "calculateTotal"
  - "data"
  - "run"
answer: B
explain: 动词短语能直接表达函数行为。
:::

## 下一步

- 用《综合练习》检验变量、数组、条件和循环。
- 给自己写的每个函数补一个正常用例和一个边界用例。
- 把重复三次以上的逻辑提取成函数。
