---
title: Java 面向对象
description: 类、对象、封装、继承、接口、多态、record、enum 与包，构建清晰的 Java 领域模型。
category: java
order: 3
tags: [Java, OOP, 接口, record]
updated: 2026-11-12
---

# Java 面向对象

Java 的代码组织以类为核心。面向对象的目标是让类型表达业务概念，让变化被隔离在清晰的边界内。

## 类与对象

```java
public class Course {
    private final String title;
    private int minutes;

    public Course(String title, int minutes) {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("标题不能为空");
        }
        this.title = title;
        this.minutes = Math.max(1, minutes);
    }

    public String getTitle() {
        return title;
    }

    public int getMinutes() {
        return minutes;
    }

    public void extend(int minutes) {
        if (minutes > 0) {
            this.minutes += minutes;
        }
    }

    public String summary() {
        return "%s：%d 分钟".formatted(title, minutes);
    }
}
```

```java
var course = new Course("Java 入门", 180);
course.extend(20);
System.out.println(course.summary());
```

字段用 `private`，通过方法暴露行为。`final` 字段必须在构造函数中赋值。

## 封装

封装不是简单地写 getter/setter，而是**保护对象的不变量**。例如余额不能为负、订单状态不能随意跳转，这些规则应留在类内部。

```java
public class BankAccount {
    private long balanceCents;

    public void deposit(long cents) {
        if (cents <= 0) throw new IllegalArgumentException("金额必须为正");
        balanceCents += cents;
    }

    public boolean withdraw(long cents) {
        if (cents <= 0 || cents > balanceCents) return false;
        balanceCents -= cents;
        return true;
    }

    public long getBalanceCents() {
        return balanceCents;
    }
}
```

## 继承与多态

```java
public abstract class Notification {
    public abstract String channel();

    public void send(String message) {
        System.out.printf("[%s] %s%n", channel(), message);
    }
}

public class EmailNotification extends Notification {
    @Override
    public String channel() {
        return "EMAIL";
    }
}

Notification notification = new EmailNotification();
notification.send("欢迎学习 Java");
```

父类引用指向子类对象，调用时执行子类实现，这就是多态。继承应表达真正的“is-a”关系，不要为了复用几行代码而继承。

## 接口

```java
public interface Repository<T> {
    T findById(long id);
    void save(T entity);
}

public class InMemoryCourseRepository implements Repository<Course> {
    private final Map<Long, Course> store = new HashMap<>();
    private long sequence = 1;

    @Override
    public Course findById(long id) {
        return store.get(id);
    }

    @Override
    public void save(Course course) {
        store.put(sequence++, course);
    }
}
```

接口定义能力契约。一个类可以实现多个接口。Java 8+ 接口支持 `default` 方法，但不要用它堆业务逻辑。

## record

```java
public record Money(BigDecimal amount, String currency) {
    public Money {
        if (amount.signum() < 0) {
            throw new IllegalArgumentException("金额不能为负");
        }
        Objects.requireNonNull(currency);
    }

    public Money add(Money other) {
        if (!currency.equals(other.currency)) {
            throw new IllegalArgumentException("币种不一致");
        }
        return new Money(amount.add(other.amount), currency);
    }
}
```

`record` 自动生成构造器、访问器、`equals`、`hashCode` 和 `toString`，适合 DTO 与值对象。紧凑构造器可以校验参数。

## enum

```java
public enum OrderStatus {
    CREATED,
    PAID,
    SHIPPED,
    COMPLETED,
    CANCELLED;

    public boolean canCancel() {
        return this == CREATED || this == PAID;
    }
}
```

枚举比字符串常量安全，能限定取值范围，也能携带行为。

## 包与访问控制

```java
package com.starlearn.course;

public class CourseService {
    private final Repository<Course> repository;

    public CourseService(Repository<Course> repository) {
        this.repository = repository;
    }
}
```

访问修饰符：

| 修饰符 | 范围 |
|---|---|
| `private` | 当前类 |
| 默认（无） | 当前包 |
| `protected` | 当前包 + 子类 |
| `public` | 所有位置 |

优先使用最小可见性。公开 API 越少，维护成本越低。

## 组合优于继承

```java
public class CourseService {
    private final Repository<Course> repository;
    private final Exporter exporter;

    public CourseService(Repository<Course> repository, Exporter exporter) {
        this.repository = repository;
        this.exporter = exporter;
    }

    public String exportAll() {
        return exporter.export(repository.findAll());
    }
}
```

依赖通过构造函数传入，便于替换与测试。不要用 `new` 在业务类内部硬编码数据库连接或 HTTP 客户端。

:::tip 设计检查
如果一个类叫 `Manager`、`Util` 或 `Helper`，先停下来想清楚它的职责。名字模糊通常意味着边界模糊。
:::

## 小练习

1. 定义 `Shape` 接口，实现圆形、矩形，并计算面积。
2. 用 `record` 表示订单项，计算订单总价。
3. 用枚举实现订单状态流转，拒绝非法转换。

## 下一步

- [集合与 Stream](/java/collections.html)
- [Spring Boot 入门](/java/springboot.html)
