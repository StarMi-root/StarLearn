---
title: C# 异步编程：async 与 await
description: 理解 Task、async/await、并发与并行的区别，正确处理取消、异常和异步 I/O。
category: csharp
order: 5
tags: [C#, async, Task, 并发]
updated: 2026-11-12
---

# C# 异步编程：async 与 await

异步编程的目标不是“开更多线程”，而是**在等待 I/O 时不阻塞线程**。网络请求、文件读写、数据库查询都适合异步；纯 CPU 计算则需要并行或后台任务。

## 从同步到异步

同步写法：

```csharp
using var client = new HttpClient();
var html = client.GetStringAsync("https://example.com").Result;
Console.WriteLine(html.Length);
```

`.Result` 会阻塞线程，在某些上下文里还可能导致死锁。正确写法：

```csharp
using var client = new HttpClient();
var html = await client.GetStringAsync("https://example.com");
Console.WriteLine(html.Length);
```

`await` 表示“等待这个异步操作完成，期间把当前线程让出去”。编译器会把方法改写成状态机。

## async 方法

```csharp
public static async Task<int> CountWordsAsync(string url, CancellationToken ct = default)
{
    using var client = new HttpClient();
    var text = await client.GetStringAsync(url, ct);

    await Task.Delay(100, ct); // 模拟额外异步工作
    return text.Split(' ', StringSplitOptions.RemoveEmptyEntries).Length;
}
```

返回类型通常是：

- `Task`：没有返回值。
- `Task<T>`：有返回值。
- `ValueTask<T>`：高频、可能同步完成的场景，需谨慎使用。
- `async void`：只应用于事件处理器，异常无法被调用方捕获。

## 并发执行多个任务

```csharp
var urls = new[]
{
    "https://example.com",
    "https://example.org",
    "https://example.net"
};

using var client = new HttpClient();
var tasks = urls.Select(url => client.GetStringAsync(url));
var pages = await Task.WhenAll(tasks);

foreach (var page in pages)
    Console.WriteLine(page.Length);
```

`Task.WhenAll` 等待全部完成；`Task.WhenAny` 可用于超时或竞速。注意：`Task.WhenAll` 会等所有任务结束，即使其中某个已经失败。

## 取消与超时

```csharp
using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));

try
{
    var data = await DownloadAsync("https://example.com", cts.Token);
    Console.WriteLine(data.Length);
}
catch (OperationCanceledException)
{
    Console.WriteLine("操作超时或被取消");
}
```

把 `CancellationToken` 一路传递到真正执行 I/O 的 API，取消才有意义。不要只在最外层检查。

## 异常处理

```csharp
try
{
    var result = await DoWorkAsync();
}
catch (HttpRequestException ex)
{
    Console.WriteLine($"网络错误：{ex.Message}");
}
catch (Exception ex)
{
    Console.WriteLine($"未预期错误：{ex.Message}");
}
```

异步方法的异常会被包装进 `Task`，在 `await` 时重新抛出。不要用 `.Result` 或 `.Wait()` 把异步变回同步。

## 并发与并行的区别

- **并发**：多个任务在时间上交错推进，适合 I/O。
- **并行**：多个 CPU 核心同时计算，适合 CPU 密集型任务。

CPU 密集任务可以用 `Task.Run` 移到线程池，但在 ASP.NET Core 请求中不要滥用，I/O 本身已经是异步的。

```csharp
var result = await Task.Run(() => ExpensiveCalculation(1_000_000));
```

## 常见错误清单

- 在异步方法里使用 `.Result` / `.Wait()`。
- `async void` 吞掉异常。
- 忘记传递 `CancellationToken`。
- 在循环中逐个 `await`，本可并发却串行执行。
- 用 `Thread.Sleep` 代替 `await Task.Delay`。

:::tip 实践建议
先问“这里等的是什么”：网络、磁盘、数据库，还是 CPU？I/O 用 async/await；CPU 密集再考虑并行。不要把异步当成性能银弹。
:::

## 练习

写一个方法，同时请求三个 URL，返回每个 URL 的状态码与耗时；要求支持 5 秒超时，并保证任一请求失败时仍能收集其他请求的结果。

## 下一步

- [ASP.NET Core Web API](/csharp/aspnet.html)
- [C# 练习课](/csharp/practice.html)
