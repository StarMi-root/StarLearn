---
title: 变量与数据类型：从内存到类型系统
description: 讲透变量、常量、基本数据类型、值类型与引用类型、作用域、类型转换和空值，用 C#、Python、Java、JavaScript 对照学习。
category: foundations
order: 1
tags: [变量, 数据类型, 内存, 类型转换]
updated: 2026-11-13
---

# 变量与数据类型：从内存到类型系统

变量是程序给一块内存起的名字。名字本身不重要，重要的是这块内存里存什么、占多大、谁能修改、什么时候释放。把这些搞清楚，后面的数组、对象、函数和并发都会顺很多。

## 变量、常量与字面量

一个变量通常包含三件事：**名字**、**类型**、**当前值**。常量则是初始化后不允许重新赋值的名字。

```csharp
// C#
int age = 18;              // 变量
const double Pi = 3.14159; // 编译期常量
var name = "StarLearn";    // 编译器推断为 string
```

```python
# Python
age = 18
PI = 3.14159
name = "StarLearn"
```

```java
// Java
int age = 18;
final double PI = 3.14159;
String name = "StarLearn";
```

```javascript
// JavaScript
let age = 18;
const PI = 3.14159;
const name = "StarLearn";
```

Python 没有真正意义上的“常量声明”，`PI` 只是约定俗成的大写变量。JavaScript 的 `const` 阻止的是“重新绑定变量”，并不会冻结对象内部的内容：

```javascript
const user = { name: "Star" };
user.name = "StarMi"; // 允许
// user = {};         // 报错：不能重新赋值
```

## 基本数据类型

| 类型 | 典型语言 | 用途 | 注意点 |
| --- | --- | --- | --- |
| 整数 | `int` / `long` / `number` | 计数、编号、下标 | 有范围，溢出会回绕或抛异常 |
| 浮点数 | `float` / `double` / `number` | 测量值、比例 | 二进制无法精确表示所有小数 |
| 布尔 | `bool` / `boolean` | 条件判断 | 不要用 0/1 代替可读的布尔值 |
| 字符与字符串 | `char` / `string` / `str` | 文本 | 字符串通常不可变 |
| 精确小数 | `decimal` / `BigDecimal` | 金额 | 比浮点慢，但避免精度灾难 |

浮点数的经典问题：

```javascript
console.log(0.1 + 0.2);        // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3); // false
```

处理金额时，C# 用 `decimal`，Java 用 `BigDecimal`，Python 可用 `decimal.Decimal`。不要用 `double` 直接比较金额。

### 整数范围

C# 的 `int` 是 32 位有符号整数，范围约为 -21 亿到 21 亿。超过范围会发生溢出。C# 默认不检查溢出，可用 `checked` 主动检查：

```csharp
int max = int.MaxValue;
// int bad = checked(max + 1); // 抛出 OverflowException
long safe = (long)max + 1;     // 先提升到 long 再计算
```

Java 的 `int` 溢出会回绕；Python 的 `int` 是任意精度，不会因为数值大而溢出，但会消耗更多内存。

## 值类型与引用类型

这是理解“赋值”的关键。

- **值类型**：变量直接保存数据。把一个值类型赋给另一个变量，会复制一份。C# 的 `int`、`double`、`bool`、`struct` 属于值类型。
- **引用类型**：变量保存的是对象在堆上的地址。赋值复制的是地址，两个变量可能指向同一个对象。C# 的 `class`、数组、字符串属于引用类型。

```csharp
int a = 10;
int b = a;
b = 20;
Console.WriteLine(a); // 10，互不影响

int[] x = { 1, 2, 3 };
int[] y = x;
y[0] = 99;
Console.WriteLine(x[0]); // 99，同一个数组对象
```

Python 的变量更像“贴在对象上的标签”。`a = [1, 2]` 后，`b = a` 让两个名字指向同一个列表：

```python
a = [1, 2]
b = a
b.append(3)
print(a)  # [1, 2, 3]

c = a.copy()  # 浅拷贝，修改 c 的顶层元素不会影响 a
```

Java 的对象和数组同样是引用；基本类型 `int`、`double`、`boolean` 是值。JavaScript 的对象、数组、函数是引用，字符串和数字是原始值。

:::tip 一句话判断
“改 b 会不会影响 a？”先看类型：值类型通常不会，引用类型要看两个变量是否指向同一个对象。需要独立副本时，明确做拷贝。
:::

## 作用域与生命周期

作用域决定一个名字在哪些代码里可见。常见层级：

1. **块级作用域**：`if`、`for`、`{}` 内部声明的变量只在该块内可见。
2. **函数作用域**：函数参数和函数内变量在函数执行期间存在。
3. **模块/全局作用域**：整个文件或程序可见，容易造成命名冲突。

```csharp
int total = 0;
for (int i = 0; i < 3; i++)
{
    int temp = i * 2; // 只在循环体内可见
    total += temp;
}
// Console.WriteLine(temp); // 编译错误
```

Python 没有块级作用域，循环里定义的变量在循环结束后仍然存在：

```python
for i in range(3):
    last = i
print(last)  # 2
```

C# 和 Java 允许局部变量遮蔽外层变量，但过度遮蔽会让代码难读。团队项目里应避免同名变量跨越太多层。

## 类型转换

### 隐式转换

小范围类型自动提升为大范围类型，通常安全：

```csharp
int count = 3;
double rate = count; // int -> double
```

### 显式转换

大范围转小范围可能丢数据，必须显式写出：

```csharp
double price = 9.99;
int yuan = (int)price; // 9，小数部分被截断
```

### 字符串与数字互转

```csharp
string text = "42";
int n = int.Parse(text);
bool ok = int.TryParse("abc", out int value); // 更安全的写法
string s = n.ToString();
```

```python
n = int("42")
s = str(42)
```

```java
int n = Integer.parseInt("42");
String s = String.valueOf(n);
```

```javascript
const n = Number("42");
const s = String(42);
```

`int.Parse("abc")` 会抛异常；接收用户输入时优先使用 `TryParse` 或先校验，避免把异常当流程控制。

## null、undefined 与空值

- C#：引用类型可以为 `null`；可空值类型写作 `int?`。
- Java：引用类型可以为 `null`；`Optional` 用于表达“可能没有值”。
- Python：只有 `None`。
- JavaScript：有 `null` 和 `undefined` 两个概念。

```csharp
string? nickname = null;
int length = nickname?.Length ?? 0; // 空安全访问 + 默认值
```

```python
nickname = None
length = len(nickname) if nickname is not None else 0
```

空值不是空字符串，也不是 0。接口设计里要明确“没有值”和“空值”的区别，避免一层层判空。

## 命名与可读性

- 使用能表达业务含义的名字：`remainingDays` 比 `x` 好。
- 布尔变量用 `is`、`has`、`can` 开头：`isActive`、`hasPermission`。
- 常量全大写或用 `const`/`final` 明确表达意图。
- 不要把类型塞进名字：`userList` 可以，`userString` 通常没必要。
- 避免魔法数字：把 `3.14` 命名为 `Pi` 或配置项。

## 常见错误清单

| 错误 | 后果 | 修正 |
| --- | --- | --- |
| 用 `==` 比较浮点数 | 精度误差导致判断失败 | 比较差值是否小于阈值 |
| 认为 `const` 对象不可修改 | 内部字段仍可变 | 需要不可变对象或深拷贝 |
| 引用赋值后修改副本 | 原对象被意外修改 | 明确拷贝或使用不可变结构 |
| 整数除法丢失小数 | 结果被截断 | 先把操作数转为浮点 |
| 变量未初始化就使用 | 编译错误或默认值陷阱 | 声明时初始化 |
| 在循环里重复拼接大字符串 | 性能下降 | 使用 `StringBuilder` / `join` |

## 练习：检查你的理解

:::quiz
question: 在 C# 中，`int a = 10; int b = a; b = 20;` 之后 `a` 的值是什么？
options:
  - "20"
  - "10"
  - "0"
  - "编译错误"
answer: B
explain: int 是值类型，赋值会复制数据，修改 b 不影响 a。
:::

:::quiz
question: 下面哪种类型最适合表示金额？
options:
  - "double"
  - "float"
  - "decimal"
  - "int"
answer: C
explain: decimal 是十进制精确类型，适合金额；double/float 会有二进制精度误差。
:::

:::quiz
question: Python 中 `a = [1, 2]; b = a; b.append(3)` 后，`a` 是什么？
options:
  - "[1, 2]"
  - "[1, 2, 3]"
  - "[3, 1, 2]"
  - "报错"
answer: B
explain: a 和 b 指向同一个列表对象，append 会同时反映在 a 上。
:::

:::quiz
question: 哪个写法能在 C# 中安全地把用户输入转换为整数而不抛异常？
options:
  - "int.Parse(input)"
  - "Convert.ToInt32(input)"
  - "int.TryParse(input, out int value)"
  - "(int)input"
answer: C
explain: TryParse 返回布尔值表示是否成功，适合处理不可信输入。
:::

:::quiz
question: JavaScript 中 `const user = { name: 'A' }; user.name = 'B';` 的结果是？
options:
  - "报错，const 不能修改"
  - "允许，const 只阻止重新绑定"
  - "user 变成 null"
  - "name 仍然是 A"
answer: B
explain: const 约束的是变量绑定，不是对象内部属性。
:::

:::quiz
question: 关于作用域，下列说法正确的是？
options:
  - "Python 的 for 循环变量在循环结束后一定不可见"
  - "C# 的局部变量只在所属代码块内可见"
  - "所有语言都有块级作用域"
  - "全局变量永远比局部变量安全"
answer: B
explain: C# 使用块级作用域；Python 的循环变量在函数或模块作用域内仍然可见。
:::

## 下一步

- 进入《数组与集合》理解批量数据如何组织。
- 进入《条件判断》学习如何让程序做选择。
- 每写一个变量，问自己三个问题：它是什么类型？谁拥有它？什么时候失效？
