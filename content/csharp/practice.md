---
title: C# 练习课
description: 用 5 道选择题和 3 个编程任务检验 C# 类型、OOP、LINQ 与异步编程的掌握程度。
category: csharp
order: 7
practice: true
tags: [C#, 练习, 测验]
updated: 2026-11-12
---

# C# 练习课

先独立完成，再展开解析。选择题可以反复作答；编程任务建议在本地 `dotnet new console` 中实现。

:::quiz
question: "下面哪个类型是值类型？"
options:
  - "string"
  - "class"
  - "struct"
  - "array"
answer: C
explain: "`struct` 是值类型，赋值时复制整个值。`string`、数组和类都是引用类型。"
:::

:::quiz
question: "LINQ 的 `Where` 通常什么时候执行？"
options:
  - "调用 Where 时立即执行"
  - "枚举查询结果时执行"
  - "编译时执行"
  - "只在 ToList 后执行"
answer: B
explain: "LINQ 查询默认是延迟执行的，直到 foreach、ToList、Count 等操作枚举序列时才真正执行。"
:::

:::quiz
question: "异步方法中，哪种返回类型通常不应使用？"
options:
  - "Task"
  - "Task<T>"
  - "async void"
  - "ValueTask"
answer: C
explain: "`async void` 的异常无法被调用方通过 Task 捕获，只适合事件处理器。普通异步方法应返回 Task 或 Task<T>。"
:::

:::quiz
question: "在 ASP.NET Core 中，DbContext 通常注册为哪种生命周期？"
options:
  - "Singleton"
  - "Scoped"
  - "Transient"
  - "Static"
answer: B
explain: "DbContext 不是线程安全的，通常按请求注册为 Scoped。Singleton 捕获 Scoped 服务会导致生命周期错误。"
:::

:::quiz
question: "`record` 类型默认提供哪项能力？"
options:
  - "自动生成值相等比较"
  - "自动创建数据库表"
  - "自动实现多线程"
  - "自动生成 UI"
answer: A
explain: "`record` 会根据所有字段生成值相等、GetHashCode、ToString，并支持 with 表达式。"
:::

## 编程任务

### 任务 1：成绩统计

读取一组学生姓名与分数，输出平均分、最高分学生，并按分数降序打印。要求使用 `record` 表示学生。

### 任务 2：订单筛选

给定订单列表（客户、金额、城市、日期），完成：

1. 筛选金额大于 100 的订单；
2. 按城市分组统计总金额；
3. 找出消费最高的客户。

建议用 LINQ 实现，并思考每组查询是否会重复枚举。

### 任务 3：并发下载器

写一个控制台程序，同时请求 5 个 URL，输出每个请求的状态码与耗时。要求：

- 使用 `HttpClient` 与 `Task.WhenAll`；
- 支持整体 10 秒超时；
- 某一个请求失败时，不影响其他结果收集。

## 自检清单

- 能否解释值类型与引用类型在赋值时的区别？
- 能否说出 `First` 与 `FirstOrDefault` 的差异？
- 是否知道 `async void` 为什么危险？
- 能否说清 Scoped 与 Singleton 的区别？

## 返回

- [C# 教程首页](/csharp/index.html)
- [继续做综合测验](/exercises.html)
