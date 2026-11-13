---
title: 运算符与表达式：从算术到短路求值
description: 算术、取模、比较、逻辑、位运算、赋值、优先级、溢出与字符串拼接，系统掌握表达式求值规则。
category: foundations
order: 5
tags: [运算符, 表达式, 优先级, 位运算]
updated: 2026-11-13
---

# 运算符与表达式：从算术到短路求值

表达式由操作数和运算符组成，最终产生一个值。看起来只是 `+ - * /`，但整数除法、取模、短路求值、优先级和溢出，都是实际项目里高频的 bug 来源。

## 算术运算符

| 运算符 | 含义 | 示例 | 结果 |
| --- | --- | --- | --- |
| `+` | 加 | `5 + 2` | `7` |
| `-` | 减 | `5 - 2` | `3` |
| `*` | 乘 | `5 * 2` | `10` |
| `/` | 除 | `5 / 2` | 取决于类型 |
| `%` | 取模 | `5 % 2` | `1` |
| `**` / `Math.Pow` | 幂 | `2 ** 3` | `8` |

### 整数除法

C#、Java、JavaScript 的整数相除会截断小数：

```csharp
Console.WriteLine(5 / 2);   // 2
Console.WriteLine(5 / 2.0); // 2.5
```

Python 的 `/` 总是浮点除法，整除用 `//`：

```python
print(5 / 2)   # 2.5
print(5 // 2)  # 2
```

Java 中如果两个操作数都是整数，`5 / 2` 也是 2。需要小数时至少把一边转成 `double`。

### 取模

`%` 返回余数，常用于判断奇偶、循环索引和分页：

```csharp
bool isEven = number % 2 == 0;
int page = index / pageSize;
int offset = index % pageSize;
```

负数取模在不同语言中可能不同。C# 的 `-5 % 2` 是 -1，Python 的 `-5 % 2` 是 1。涉及负数时先明确业务语义。

## 比较与逻辑运算

比较运算返回布尔值，逻辑运算组合布尔值。

```csharp
bool canAccess = isLoggedIn && (isOwner || isAdmin) && !isBanned;
```

C#/Java/JS 使用 `&&`、`||`、`!`；Python 使用 `and`、`or`、`not`。

### 短路求值

`&&` 和 `||` 会短路：

- `a && b`：a 为假时不再计算 b。
- `a || b`：a 为真时不再计算 b。

```csharp
if (user != null && user.IsActive)
{
    // user 为 null 时不会访问 IsActive
}
```

这既是便利，也是陷阱：如果 b 有副作用（例如写日志、调用接口），短路可能导致它没有执行。不要把关键副作用塞进条件表达式。

## 赋值与复合赋值

```csharp
int count = 0;
count += 1;  // count = count + 1
count *= 2;  // count = count * 2
```

自增 `i++` 和 `++i` 的区别：前者返回旧值再自增，后者先自增再返回。现代代码中尽量避免在同一条表达式里依赖这种差异。

```csharp
int i = 1;
Console.WriteLine(i++); // 1
Console.WriteLine(i);   // 2

int j = 1;
Console.WriteLine(++j); // 2
```

## 位运算

位运算直接操作二进制位，常见于权限、哈希、压缩和底层协议。

| 运算符 | 含义 | 示例 |
| --- | --- | --- |
| `&` | 按位与 | `6 & 3` = 2 |
| `|` | 按位或 | `6 | 3` = 7 |
| `^` | 按位异或 | `6 ^ 3` = 5 |
| `~` | 按位取反 | `~6` = -7 |
| `<<` | 左移 | `1 << 3` = 8 |
| `>>` | 右移 | `8 >> 2` = 2 |

权限位示例：

```csharp
const int Read = 1 << 0;    // 001
const int Write = 1 << 1;   // 010
const int Delete = 1 << 2;  // 100

int permissions = Read | Write;
bool canWrite = (permissions & Write) != 0;
```

不要用位运算替代可读的布尔逻辑，除非场景确实需要紧凑存储或底层操作。

## 运算符优先级

常见优先级从高到低：

1. 括号 `()`
2. 一元运算 `!`、`-`、`++`
3. 乘除、取模
4. 加减
5. 比较
6. 逻辑与
7. 逻辑或
8. 赋值

```csharp
bool result = a > 0 && b > 0 || c > 0;
// 等价于 ((a > 0) && (b > 0)) || (c > 0)
```

优先级记不住时，直接加括号。括号不会让代码变差，模糊的优先级会。

## 字符串拼接与插值

```csharp
string message = $"用户 {name} 有 {count} 条消息";
```

```python
message = f"用户 {name} 有 {count} 条消息"
```

```java
String message = "用户 " + name + " 有 " + count + " 条消息";
```

```javascript
const message = `用户 ${name} 有 ${count} 条消息`;
```

大量拼接时不要在循环里反复创建字符串。C# 用 `StringBuilder`，Python 用 `"".join(parts)`，Java 用 `StringBuilder`，JavaScript 用数组 `join`。

## 溢出与精度

整数有范围。C# 的 `checked` 能捕获溢出，Java 会回绕，Python 不会溢出。浮点数有精度误差，金额用 decimal/BigDecimal。

```csharp
int max = int.MaxValue;
int wrapped = unchecked(max + 1); // -2147483648
```

## 常见错误

1. **整数除法**：`5 / 2` 得到 2，不是 2.5。
2. **混淆 `=` 与 `==`**：条件里赋值。
3. **依赖短路副作用**：条件不成立时副作用没发生。
4. **浮点金额**：0.1 + 0.2 不等于 0.3。
5. **忽略优先级**：`a || b && c` 的执行顺序与直觉不同。
6. **字符串循环拼接**：数据量大时性能急剧下降。

## 练习：运算符与表达式

:::quiz
question: C# 中 `7 / 2` 的结果是？
options:
  - "3.5"
  - "3"
  - "4"
  - "编译错误"
answer: B
explain: 两个整数相除会截断小数部分。
:::

:::quiz
question: 表达式 `true || expensiveCall()` 中，expensiveCall 会执行吗？
options:
  - "会"
  - "不会，发生短路"
  - "取决于返回值"
  - "编译错误"
answer: B
explain: 左边为 true 时，逻辑或直接返回 true，不计算右边。
:::

:::quiz
question: `5 % 2` 的结果是？
options:
  - "2"
  - "1"
  - "0"
  - "2.5"
answer: B
explain: 5 除以 2 余 1。
:::

:::quiz
question: 哪个表达式可以判断整数 n 是偶数？
options:
  - "n / 2 == 0"
  - "n % 2 == 0"
  - "n * 2 == 0"
  - "n == 2"
answer: B
explain: 偶数除以 2 的余数为 0。
:::

:::quiz
question: 位运算 `permissions & Write` 常用于？
options:
  - "字符串拼接"
  - "检查某个权限位是否开启"
  - "浮点数比较"
  - "创建数组"
answer: B
explain: 按位与可以保留指定二进制位，用于权限判断。
:::

:::quiz
question: 大量字符串拼接时，较推荐的做法是？
options:
  - "在循环里不断用 +"
  - "用 StringBuilder / join 收集"
  - "用 int 保存"
  - "每次创建新变量"
answer: B
explain: StringBuilder/join 能减少中间字符串对象，提升性能。
:::

## 下一步

- 用《函数》封装复杂表达式。
- 为边界值写测试：0、负数、最大整数、空字符串。
- 看到复杂条件时，先加括号，再提取有名字的布尔变量。
