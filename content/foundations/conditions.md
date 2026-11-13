---
title: 条件判断：让程序学会做选择
description: 布尔表达式、比较运算、if/else、switch、三元表达式、守卫语句与真值规则，覆盖四种语言的条件判断细节。
category: foundations
order: 3
tags: [条件判断, 布尔, if, switch]
updated: 2026-11-13
---

# 条件判断：让程序学会做选择

程序与计算器的区别之一，是它能根据输入走不同路径。条件判断的本质是：**计算一个布尔表达式，再根据 true/false 选择执行哪段代码。**

## 布尔表达式

布尔值只有两个：`true` 和 `false`。比较运算会生成布尔值。

| 运算符 | 含义 | 示例 |
| --- | --- | --- |
| `==` | 等于 | `age == 18` |
| `!=` | 不等于 | `status != "closed"` |
| `>` `<` | 大于/小于 | `score > 60` |
| `>=` `<=` | 大于等于/小于等于 | `count >= 0` |
| `&&` / `and` | 逻辑与 | `isLogin && isAdmin` |
| `||` / `or` | 逻辑或 | `isGuest || isAdmin` |
| `!` / `not` | 逻辑非 | `!isDisabled` |

不同语言的写法：

```csharp
bool canEdit = isLogin && (isOwner || isAdmin);
```

```python
can_edit = is_login and (is_owner or is_admin)
```

```java
boolean canEdit = isLogin && (isOwner || isAdmin);
```

```javascript
const canEdit = isLogin && (isOwner || isAdmin);
```

## if / else if / else

```csharp
if (score >= 90)
{
    Console.WriteLine("优秀");
}
else if (score >= 60)
{
    Console.WriteLine("及格");
}
else
{
    Console.WriteLine("不及格");
}
```

```python
if score >= 90:
    print("优秀")
elif score >= 60:
    print("及格")
else:
    print("不及格")
```

```java
if (score >= 90) {
    System.out.println("优秀");
} else if (score >= 60) {
    System.out.println("及格");
} else {
    System.out.println("不及格");
}
```

```javascript
if (score >= 90) {
  console.log("优秀");
} else if (score >= 60) {
  console.log("及格");
} else {
  console.log("不及格");
}
```

判断顺序很重要。上面的 `score >= 90` 必须先判断；如果先判断 `score >= 60`，90 分也会进入“及格”分支。

## 嵌套与守卫语句

嵌套太深会让代码难以阅读。优先使用“提前返回”的守卫语句：

```csharp
// 不推荐：三层嵌套
if (user != null)
{
    if (user.IsActive)
    {
        if (user.HasPermission)
        {
            DoWork();
        }
    }
}

// 推荐：先排除异常情况
if (user is null) return;
if (!user.IsActive) return;
if (!user.HasPermission) return;
DoWork();
```

守卫语句把“不满足条件”的分支提前结束，主流程留在最外层。函数越长，这种写法收益越明显。

## switch 与模式匹配

当条件是“同一个变量等于若干固定值”时，`switch` 比长串 `else if` 更清晰。

```csharp
switch (status)
{
    case "pending":
        Console.WriteLine("等待处理");
        break;
    case "paid":
    case "shipped":
        Console.WriteLine("进行中");
        break;
    default:
        Console.WriteLine("未知状态");
        break;
}
```

现代 C# 支持 switch 表达式：

```csharp
string label = status switch
{
    "pending" => "等待处理",
    "paid" or "shipped" => "进行中",
    _ => "未知状态",
};
```

Python 3.10+ 支持 `match`：

```python
match status:
    case "pending":
        print("等待处理")
    case "paid" | "shipped":
        print("进行中")
    case _:
        print("未知状态")
```

JavaScript 的 `switch` 使用严格比较 `===`，忘记 `break` 会“贯穿”到下一个分支。Java 的现代 `switch` 表达式也能直接返回值。

## 三元表达式

简单二选一可以写成一行：

```csharp
string level = score >= 60 ? "及格" : "不及格";
```

```python
level = "及格" if score >= 60 else "不及格"
```

```java
String level = score >= 60 ? "及格" : "不及格";
```

```javascript
const level = score >= 60 ? "及格" : "不及格";
```

三元表达式适合“短、无副作用、一眼能懂”的选择。嵌套三元表达式会迅速降低可读性，应改用 `if` 或查表。

## 真值与类型转换

不同语言对“什么算真”有不同规则：

- C#：`if` 只接受 `bool`，`if (1)` 编译错误。
- Java：只接受 `boolean`，不能用 0/1。
- Python：`0`、`0.0`、`""`、`[]`、`{}`、`None` 为假。
- JavaScript：`0`、`""`、`null`、`undefined`、`NaN`、`false` 为假；`[]` 和 `{}` 为真。

```javascript
if ([]) {
  console.log("空数组在 JS 中也是真");
}
```

Python/JS 的隐式真值很方便，但在接口边界容易把 `"0"`、空数组或 `NaN` 当成意外值。需要明确判断时，写清楚：

```javascript
if (items.length > 0) { /* ... */ }
```

## 浮点数与字符串比较

不要直接用 `==` 比较浮点数：

```csharp
bool equal = Math.Abs(a - b) < 1e-9;
```

字符串比较要注意大小写、区域性和空白：

- C#：`string.Equals(a, b, StringComparison.OrdinalIgnoreCase)`
- Java：`a.equalsIgnoreCase(b)`
- Python：`a.casefold() == b.casefold()`
- JavaScript：`a.localeCompare(b, undefined, { sensitivity: "base" }) === 0`

C# 的 `==` 对字符串比较的是内容，不是引用；Java 的 `==` 比较引用，内容要用 `equals`。这是初学者最常见的差异之一。

## 常见错误

1. **把 `=` 写成 `==`**：赋值表达式可能被当成条件，或在强类型语言中直接报错。
2. **条件顺序错误**：宽泛条件放在前面，具体条件永远进不去。
3. **布尔表达式太长**：拆成有名字的变量，例如 `isEligible`。
4. **忽略空值**：`user.Name` 在 `user` 为 null 时崩溃。
5. **浮点数直接相等**：使用误差范围或 decimal。
6. **switch 忘记 break**：在 C/Java/JS 中会贯穿。

## 练习：条件判断

:::quiz
question: `score = 85` 时，下面哪个判断会输出“优秀”？
options:
  - "if (score >= 60) 优秀 else if (score >= 90) 及格"
  - "if (score >= 90) 优秀 else if (score >= 60) 及格"
  - "if (score < 60) 优秀"
  - "以上都不会"
answer: B
explain: 具体条件必须先判断，否则 85 会先命中 >= 60。
:::

:::quiz
question: C# 中 `if (1)` 的结果是？
options:
  - "总是 true"
  - "总是 false"
  - "编译错误，条件必须是 bool"
  - "运行时异常"
answer: C
explain: C# 不像 C/JS 那样把 0/1 隐式当作布尔值。
:::

:::quiz
question: JavaScript 中哪个值在条件里是假值？
options:
  - "[]"
  - "{}"
  - "\"0\""
  - "0"
answer: D
explain: 0 是假值；空数组、空对象和非空字符串 "0" 都是真值。
:::

:::quiz
question: 比较两个浮点数是否相等，较稳妥的做法是？
options:
  - "直接用 =="
  - "比较差值是否小于误差阈值"
  - "转成字符串比较"
  - "用位运算"
answer: B
explain: 浮点数有二进制精度误差，应使用误差范围或 decimal。
:::

:::quiz
question: Java 中比较两个字符串内容是否相同，应该用？
options:
  - "=="
  - "equals()"
  - "compareTo() == 1"
  - "is()"
answer: B
explain: == 比较引用；equals 比较内容。
:::

:::quiz
question: 守卫语句的主要作用是？
options:
  - "增加嵌套层级"
  - "提前处理异常分支，保持主流程扁平"
  - "替代所有循环"
  - "让代码更长"
answer: B
explain: 先排除不满足条件的情况，可以显著降低嵌套深度。
:::

## 下一步

- 用《循环》重复执行条件判断。
- 把复杂条件提取成有名字的布尔变量。
- 给每个分支写一个测试用例，覆盖边界值。
