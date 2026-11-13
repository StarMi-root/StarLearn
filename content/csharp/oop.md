---
title: C# 面向对象与接口
description: 类、属性、构造函数、继承、多态、接口、record 与组合，写出可维护的 C# 领域模型。
category: csharp
order: 3
tags: [C#, OOP, 接口, record]
updated: 2026-11-12
---

# C# 面向对象与接口

面向对象不是“把代码塞进类里”，而是用类型表达业务概念、约束和变化点。C# 提供了类、结构体、接口、record、继承和组合等工具。

## 类与属性

```csharp
public class Course
{
    public string Title { get; init; }
    public int Minutes { get; private set; }
    public bool IsPublished { get; set; }

    public Course(string title, int minutes)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("标题不能为空", nameof(title));

        Title = title;
        Minutes = Math.Max(1, minutes);
    }

    public void Extend(int minutes)
    {
        if (minutes > 0) Minutes += minutes;
    }
}
```

- `get; init;` 表示对象初始化后不可再改。
- `private set` 让外部只能读，修改必须走方法。
- 构造函数负责保证对象初始状态合法。

## 封装：只暴露必要行为

不要给所有字段都加 public setter。外部代码依赖的入口越少，未来修改越安全。

```csharp
public class BankAccount
{
    private decimal _balance;

    public decimal Balance => _balance;

    public void Deposit(decimal amount)
    {
        if (amount <= 0) throw new ArgumentOutOfRangeException(nameof(amount));
        _balance += amount;
    }

    public bool TryWithdraw(decimal amount)
    {
        if (amount <= 0 || amount > _balance) return false;
        _balance -= amount;
        return true;
    }
}
```

## 继承与多态

```csharp
public abstract class Notification
{
    public abstract string Channel { get; }
    public abstract Task SendAsync(string message, CancellationToken ct = default);
}

public sealed class EmailNotification : Notification
{
    public override string Channel => "email";
    public override Task SendAsync(string message, CancellationToken ct = default)
    {
        Console.WriteLine($"发送邮件：{message}");
        return Task.CompletedTask;
    }
}
```

抽象类适合“共享部分实现 + 要求子类补齐行为”的场景。继承层次不宜过深，优先组合。

## 接口：定义能力契约

```csharp
public interface IRepository<T>
{
    Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task AddAsync(T entity, CancellationToken ct = default);
}

public sealed class InMemoryRepository<T> : IRepository<T>
{
    private readonly Dictionary<Guid, T> _items = new();

    public Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => Task.FromResult(_items.GetValueOrDefault(id));

    public Task AddAsync(T entity, CancellationToken ct = default)
    {
        _items[Guid.NewGuid()] = entity;
        return Task.CompletedTask;
    }
}
```

接口让上层依赖抽象，而不是具体数据库。测试时可以替换为内存实现或 mock。

## record：表达不可变数据

```csharp
public record Money(decimal Amount, string Currency)
{
    public Money Add(Money other)
    {
        if (Currency != other.Currency)
            throw new InvalidOperationException("币种不一致");
        return this with { Amount = Amount + other.Amount };
    }
}

var total = new Money(99m, "CNY").Add(new Money(1m, "CNY"));
Console.WriteLine(total); // Money { Amount = 100, Currency = CNY }
```

`record` 自动生成值相等、`ToString` 和 `with` 表达式，非常适合 DTO、值对象和配置。

## 组合优于继承

```csharp
public class OrderService
{
    private readonly IRepository<Order> _orders;
    private readonly IPaymentGateway _payments;

    public OrderService(IRepository<Order> orders, IPaymentGateway payments)
    {
        _orders = orders;
        _payments = payments;
    }

    public async Task<OrderResult> PayAsync(Order order, CancellationToken ct = default)
    {
        var result = await _payments.ChargeAsync(order.Total, ct);
        if (!result.Success) return OrderResult.Failed(result.Message);
        await _orders.AddAsync(order, ct);
        return OrderResult.Ok();
    }
}
```

依赖通过构造函数注入，测试时能替换，生产时能配置生命周期。这正是 ASP.NET Core 依赖注入的基础。

## 常见设计错误

- 一个类承担读写数据库、发邮件、生成报表等所有职责。
- 用继承复用代码，导致父类一改，所有子类都受影响。
- 接口只有“实现类会用到”的方法，而不是调用方真正需要的契约。
- 公开可变集合，如 `public List<Order> Orders { get; set; }`。

:::tip 检查方法
写完一个类，问自己：它能否用一句话描述职责？如果一句话里出现三个“并且”，通常该拆分了。
:::

## 下一步

- [集合与 LINQ](/csharp/linq.html)
- [异步编程](/csharp/async.html)
- [ASP.NET Core Web API](/csharp/aspnet.html)
