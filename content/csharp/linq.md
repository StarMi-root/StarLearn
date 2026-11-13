---
title: 集合与 LINQ
description: 掌握 List、Dictionary、HashSet 与 LINQ 常用操作，理解延迟执行、投影、分组和排序。
category: csharp
order: 4
tags: [C#, LINQ, 集合, IEnumerable]
updated: 2026-11-12
---

# 集合与 LINQ

C# 的集合类型覆盖列表、字典、集合和队列。LINQ 则把查询能力统一到 `IEnumerable<T>` 上，让过滤、投影、分组和排序表达得更接近业务语言。

## 常用集合

```csharp
var list = new List<string> { "C#", "Python", "Linux" };
list.Add("AI");
Console.WriteLine(list.Count);

var scores = new Dictionary<string, int>
{
    ["Ada"] = 98,
    ["Linus"] = 95
};
scores["Anders"] = 99;

if (scores.TryGetValue("Ada", out var adaScore))
    Console.WriteLine($"Ada: {adaScore}");

var tags = new HashSet<string> { "dotnet", "csharp" };
tags.Add("dotnet"); // 不会重复
```

| 类型 | 特点 | 典型用途 |
|---|---|---|
| `List<T>` | 有序、可重复、按索引访问 | 列表数据 |
| `Dictionary<TKey,TValue>` | 键值对、键唯一 | 查找表 |
| `HashSet<T>` | 去重、快速包含判断 | 标签、ID 集合 |
| `Queue<T>` / `Stack<T>` | 先进先出 / 后进先出 | 任务队列、撤销栈 |

## 第一个 LINQ 查询

```csharp
var courses = new[]
{
    new { Title = "C# 入门", Level = "初级", Minutes = 180 },
    new { Title = "Avalonia", Level = "中级", Minutes = 240 },
    new { Title = "llama.cpp", Level = "高级", Minutes = 300 },
    new { Title = "Linux", Level = "初级", Minutes = 150 }
};

var result = courses
    .Where(c => c.Minutes >= 180)
    .OrderBy(c => c.Level)
    .ThenByDescending(c => c.Minutes)
    .Select(c => new { c.Title, Hours = Math.Round(c.Minutes / 60.0, 1) });

foreach (var item in result)
    Console.WriteLine($"{item.Title}：{item.Hours} 小时");
```

查询语法也可以写成：

```csharp
var query = from c in courses
            where c.Level == "初级"
            orderby c.Minutes descending
            select c.Title;
```

## 常用操作速查

```csharp
var numbers = new[] { 1, 2, 3, 4, 5, 6 };

bool hasEven = numbers.Any(n => n % 2 == 0);
int count = numbers.Count(n => n > 3);
int sum = numbers.Sum();
double average = numbers.Average();
int max = numbers.Max();
var squares = numbers.Select(n => n * n).ToList();
var chunks = numbers.Chunk(2);
var firstBig = numbers.FirstOrDefault(n => n > 10); // 0
```

`First` 在无结果时抛异常，`FirstOrDefault` 返回默认值。对引用类型默认值是 `null`，要配合可空检查。

## 分组与连接

```csharp
var byLevel = courses
    .GroupBy(c => c.Level)
    .Select(g => new
    {
        Level = g.Key,
        Count = g.Count(),
        TotalMinutes = g.Sum(c => c.Minutes)
    });

foreach (var group in byLevel)
    Console.WriteLine($"{group.Level}: {group.Count} 门，共 {group.TotalMinutes} 分钟");
```

多数据源关联可以用 `Join`：

```csharp
var authors = new[] { new { Id = 1, Name = "Ada" }, new { Id = 2, Name = "Linus" } };
var books = new[] { new { Title = "C#", AuthorId = 1 }, new { Title = "Linux", AuthorId = 2 } };

var joined = books.Join(
    authors,
    book => book.AuthorId,
    author => author.Id,
    (book, author) => new { book.Title, author.Name });
```

## 延迟执行

LINQ 查询通常是延迟执行的：定义查询时不会立即遍历，直到 `foreach`、`ToList()`、`Count()` 等触发。

```csharp
var source = new List<int> { 1, 2, 3 };
var query = source.Where(n => n > 1);
source.Add(4);
Console.WriteLine(string.Join(",", query)); // 2,3,4
```

如果希望固定结果，显式调用 `ToList()` 或 `ToArray()`。在 EF Core 中，延迟执行还意味着查询可能被翻译成 SQL，注意不要在循环里反复枚举数据库查询。

:::warn 性能提醒
`Count()` 会遍历序列；对 `ICollection` 优先用 `.Count` 属性。嵌套循环里反复 `Any` 查询数据库，往往意味着需要一次查询把数据取回。
:::

## 练习方向

1. 给定一组订单，筛选金额大于 100 的订单并按日期倒序。
2. 按城市分组统计订单总金额。
3. 用 `SelectMany` 把每个订单的商品列表展开。

## 下一步

- [异步编程](/csharp/async.html)
- [ASP.NET Core Web API](/csharp/aspnet.html)
