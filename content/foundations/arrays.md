---
title: 数组与集合：批量数据的组织方式
description: 从固定数组、动态列表到字典和集合，理解下标、长度、遍历、扩容与复杂度，用四种语言对照掌握批量数据。
category: foundations
order: 2
tags: [数组, 列表, 字典, 集合, 复杂度]
updated: 2026-11-13
---

# 数组与集合：批量数据的组织方式

一个变量只能保存一个值。要处理 100 个学生、1000 条日志或一百万条订单，就需要把同类数据组织成集合。数组和集合解决的核心问题是：**如何连续地存放、按位置访问、批量遍历和动态增删。**

## 固定数组

数组是一段连续的内存，元素类型相同，通过下标访问。绝大多数语言下标从 0 开始。

```csharp
// C#
int[] scores = new int[3];
scores[0] = 90;
scores[1] = 85;
scores[2] = 77;
Console.WriteLine(scores.Length); // 3
```

```python
# Python 的 list 是动态数组，不是固定长度数组
scores = [90, 85, 77]
print(len(scores))
```

```java
// Java
int[] scores = { 90, 85, 77 };
System.out.println(scores.length);
```

```javascript
// JavaScript
const scores = [90, 85, 77];
console.log(scores.length);
```

数组的关键规则：

- 下标从 0 到 `length - 1`，越界会报错。
- 长度在创建时确定，C#/Java 的普通数组不能直接变长。
- 连续内存让随机访问很快：`scores[50]` 是 O(1)。
- 中间插入或删除需要移动元素，平均是 O(n)。

```csharp
int[] numbers = { 1, 2, 3 };
Console.WriteLine(numbers[3]); // IndexOutOfRangeException
```

:::warn 越界不是“返回空”
数组越界通常是运行时异常，不会自动返回 0 或 null。循环条件要用 `< length`，不是 `<= length`。
:::

## 二维数组与交错数组

二维数组适合表格、矩阵和棋盘：

```csharp
int[,] grid = new int[2, 3];
grid[1, 2] = 9;
Console.WriteLine(grid.GetLength(0)); // 2 行
Console.WriteLine(grid.GetLength(1)); // 3 列
```

```python
grid = [[0 for _ in range(3)] for _ in range(2)]
grid[1][2] = 9
```

C# 还有“交错数组”`int[][]`，每一行长度可以不同；Java 的 `int[][]` 本质上也是数组的数组。不要把二维数组和交错数组混用。

## 动态列表

固定数组不够灵活时，使用动态数组。它们会在容量不足时自动扩容，通常按 1.5 或 2 倍增长。

```csharp
var names = new List<string>();
names.Add("Ada");
names.Add("Linus");
names.Remove("Ada");
Console.WriteLine(names.Count);
```

```python
names = []
names.append("Ada")
names.append("Linus")
names.remove("Ada")
print(len(names))
```

```java
var names = new ArrayList<String>();
names.add("Ada");
names.add("Linus");
names.remove("Ada");
System.out.println(names.size());
```

```javascript
const names = [];
names.push("Ada");
names.push("Linus");
names.splice(names.indexOf("Ada"), 1);
```

动态数组的追加通常是 O(1) 摊销；在中间插入/删除是 O(n)。不要因为“列表能自动扩容”就无脑在中间频繁插入。

## 下标、切片与遍历

### 下标访问

```python
items = ["a", "b", "c"]
print(items[0])   # a
print(items[-1])  # c，Python 支持负下标
```

C# 也支持从末尾索引：

```csharp
var last = items[^1];
```

Java 和 JavaScript 不支持负下标，`items[-1]` 在 JS 中是 `undefined`，不会报错，容易隐藏 bug。

### 切片

```python
nums = [10, 20, 30, 40, 50]
print(nums[1:4])  # [20, 30, 40]
print(nums[::-1]) # 反转
```

JavaScript 使用 `slice(start, end)`，C# 使用 `Skip/Take` 或 `Range`。切片通常创建新集合，原集合不变。

### 遍历

```csharp
foreach (int score in scores)
{
    Console.WriteLine(score);
}
```

```python
for score in scores:
    print(score)
```

```java
for (int score : scores) {
    System.out.println(score);
}
```

```javascript
for (const score of scores) {
    console.log(score);
}
```

需要下标时，C# 用 `for`，Python 用 `enumerate`，JavaScript 用 `entries()`：

```python
for index, score in enumerate(scores):
    print(index, score)
```

## 查找、过滤与转换

集合操作通常组合“判断 + 转换 + 聚合”。以“找出及格分数并加 5 分”为例：

```csharp
var passed = scores.Where(s => s >= 60).Select(s => s + 5).ToList();
```

```python
passed = [score + 5 for score in scores if score >= 60]
```

```java
var passed = Arrays.stream(scores)
    .filter(s -> s >= 60)
    .map(s -> s + 5)
    .boxed()
    .toList();
```

```javascript
const passed = scores.filter(s => s >= 60).map(s => s + 5);
```

这些写法不会修改原数组。需要原地修改时，要明确说明副作用，避免调用方意外。

## 字典与集合

### 字典（Map）

字典保存“键 → 值”的映射，适合按 ID、用户名或配置名查找。

```csharp
var ages = new Dictionary<string, int>
{
    ["Ada"] = 36,
    ["Linus"] = 54,
};
Console.WriteLine(ages["Ada"]);
```

```python
ages = {"Ada": 36, "Linus": 54}
print(ages["Ada"])
print(ages.get("Unknown", 0))
```

```java
Map<String, Integer> ages = new HashMap<>();
ages.put("Ada", 36);
System.out.println(ages.get("Ada"));
```

```javascript
const ages = new Map([["Ada", 36], ["Linus", 54]]);
console.log(ages.get("Ada"));
```

字典的关键点：

- 键必须唯一。
- 哈希表平均查找 O(1)，最坏可能退化。
- 遍历顺序不一定等于插入顺序，除非使用有序字典。
- 不存在的键：C# 直接索引会抛异常，Python/JS 返回默认/undefined，Java 返回 null。接口边界要统一行为。

### 集合（Set）

集合用于去重和成员判断：

```python
unique = set([1, 2, 2, 3])
print(unique)  # {1, 2, 3}
print(2 in unique)
```

C# 用 `HashSet<T>`，Java 用 `HashSet<T>`，JavaScript 用 `Set`。集合不保证顺序，需要顺序时用有序集合。

## 复杂度速查

| 操作 | 数组/列表 | 字典/集合 |
| --- | --- | --- |
| 按下标访问 | O(1) | 不适用 |
| 按值查找 | O(n) | O(1) 平均 |
| 末尾追加 | O(1) 摊销 | O(1) 平均 |
| 中间插入/删除 | O(n) | O(1) 平均 |
| 遍历 | O(n) | O(n) |

选择数据结构的顺序：先问“最常做哪种操作”，再看内存和顺序要求。不要为了“看起来高级”把所有东西都塞进字典。

## 常见错误

1. **循环条件写成 `<= length`**：越界。
2. **在遍历中删除元素**：可能跳过元素或抛并发修改异常。先收集要删除的项，再统一删除。
3. **把数组当可变长度使用**：C#/Java 固定数组不能追加。
4. **比较数组用 `==`**：很多语言比较的是引用，不是内容。
5. **忽略空集合**：求最大值、平均值前要判断长度是否为 0。

## 练习：数组与集合

:::quiz
question: 长度为 5 的数组，合法下标范围是？
options:
  - "1 到 5"
  - "0 到 5"
  - "0 到 4"
  - "1 到 4"
answer: C
explain: 下标从 0 开始，最后一个下标是 length - 1。
:::

:::quiz
question: 在数组中间插入一个元素，通常的时间复杂度是？
options:
  - "O(1)"
  - "O(log n)"
  - "O(n)"
  - "O(n²)"
answer: C
explain: 需要移动插入位置之后的元素，平均 O(n)。
:::

:::quiz
question: 需要按用户 ID 快速查找用户，最合适的数据结构是？
options:
  - "数组"
  - "栈"
  - "字典/哈希表"
  - "队列"
answer: C
explain: 哈希表按键查找平均 O(1)。
:::

:::quiz
question: Python 中 `nums = [10, 20, 30, 40]`，`nums[1:3]` 的结果是？
options:
  - "[10, 20]"
  - "[20, 30]"
  - "[20, 30, 40]"
  - "[10, 20, 30]"
answer: B
explain: 切片包含起点、不包含终点。
:::

:::quiz
question: 遍历列表时删除元素，最稳妥的做法是？
options:
  - "直接在 for 循环里 remove"
  - "先收集要删除的元素，再统一删除"
  - "把列表清空"
  - "使用 while(true)"
answer: B
explain: 遍历中删除会导致下标错位或并发修改异常，先收集再删除更安全。
:::

:::quiz
question: 关于集合 Set，下列说法正确的是？
options:
  - "保证按插入顺序遍历"
  - "主要用于去重和成员判断"
  - "可以通过下标访问"
  - "只能保存字符串"
answer: B
explain: Set 的核心语义是唯一性；顺序取决于具体实现。
:::

## 下一步

- 用《条件判断》处理集合中的筛选。
- 用《循环》实现求和、计数、查找和排序。
- 亲手实现一个动态数组，理解扩容为什么是摊销 O(1)。
