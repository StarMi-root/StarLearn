---
title: C# 基础语法与类型
description: 变量、值类型与引用类型、可空类型、字符串、数组、流程控制和模式匹配，一次建立可靠的 C# 语法基础。
category: csharp
order: 2
tags: [C#, 语法, 类型, 流程控制]
updated: 2026-11-12
---

# C# 基础语法与类型

C# 是静态类型语言：变量在编译时就有确定类型。理解值类型、引用类型和可空性，是后面学习类、集合与异步的基础。

## 变量与常量

```csharp
int count = 3;
double price = 19.9;
decimal money = 199.90m;   // 金额优先用 decimal
bool isReady = true;
char grade = 'A';
string name = "StarLearn";
const int MaxRetry = 3;
var message = $"欢迎，{name}！课程数：{count}";
```

- `var` 不是动态类型，只是让编译器推断类型。
- `const` 必须在编译期确定；运行期只读可用 `readonly`。
- 金额计算避免用 `double`，优先 `decimal`。

## 值类型与引用类型

| 类别 | 示例 | 赋值行为 |
|---|---|---|
| 值类型 | `int`、`double`、`bool`、`struct`、`enum` | 复制值 |
| 引用类型 | `string`、数组、`class`、`record` | 复制引用 |

```csharp
int a = 10;
int b = a;
b = 20;
Console.WriteLine(a); // 10

int[] x = { 1, 2 };
int[] y = x;
y[0] = 99;
Console.WriteLine(x[0]); // 99
```

`string` 虽然是引用类型，但具有不可变性，修改会创建新字符串，因此表现得更像值。

## 可空类型

开启可空上下文后，`string` 表示“不应为 null”，`string?` 表示“可能为 null”。

```csharp
string? nickname = null;
Console.WriteLine(nickname?.Length ?? 0);

if (nickname is not null)
{
    Console.WriteLine(nickname.ToUpper());
}
```

不要用 `!` 到处压制警告；先想清楚这个值是否真的可能为空。

## 流程控制

```csharp
int score = 86;

if (score >= 90)
    Console.WriteLine("优秀");
else if (score >= 60)
    Console.WriteLine("及格");
else
    Console.WriteLine("需要复习");

for (int i = 1; i <= 3; i++)
    Console.WriteLine($"第 {i} 次");

foreach (var item in new[] { "C#", "Avalonia", "AI" })
    Console.WriteLine(item);

int n = 0;
while (n < 2)
{
    Console.WriteLine($"while {n}");
    n++;
}
```

## switch 与模式匹配

```csharp
object value = 42;

string result = value switch
{
    int i when i > 0 => $"正整数 {i}",
    int i => $"非正整数 {i}",
    string s => $"字符串 {s}",
    null => "空值",
    _ => "其他类型"
};
```

模式匹配能让分支逻辑更紧凑，但不要为了炫技牺牲可读性。

## 方法与参数

```csharp
static decimal CalculateTotal(decimal unitPrice, int quantity, decimal discount = 0m)
{
    var subtotal = unitPrice * quantity;
    return subtotal * (1 - discount);
}

var total = CalculateTotal(29.9m, 3, 0.1m);
Console.WriteLine($"应付：{total:C}");
```

- 默认参数必须放在参数列表末尾。
- 需要返回多个值时，优先考虑定义一个小 `record`，而不是堆叠 `out` 参数。

## 数组与集合初探

```csharp
var numbers = new[] { 3, 1, 4, 1, 5 };
Array.Sort(numbers);
Console.WriteLine(string.Join(", ", numbers));

var names = new List<string> { "Ada", "Linus" };
names.Add("Anders");
Console.WriteLine(names.Count);
```

数组长度固定，`List<T>` 更常用于动态增删。集合与 LINQ 会在后续章节展开。

:::note 命名规范
类型、方法、属性用 PascalCase；局部变量和参数用 camelCase；接口以 `I` 开头，如 `IRepository`。团队项目里应使用 `.editorconfig` 统一风格。
:::

## 动手练习

1. 写一个程序，输入三个整数并输出最大值。
2. 用 `switch` 表达式把 1–7 映射为星期几，并处理非法输入。
3. 写方法 `IsPalindrome(string)`，忽略大小写判断回文。

## 下一步

- [面向对象与接口](/csharp/oop.html)
- [集合与 LINQ](/csharp/linq.html)
- [异步编程](/csharp/async.html)
