---
title: Java 基础语法
description: 基本类型、变量、字符串、条件、循环、数组、方法与 switch 表达式，建立 Java 语法基础。
category: java
order: 2
tags: [Java, 语法, 类型, 数组]
updated: 2026-11-12
---

# Java 基础语法

Java 是静态类型语言，每个变量都有确定类型。语法风格接近 C/C++，但去掉了指针，并提供了自动内存管理。

## 基本类型

| 类型 | 大小 | 示例 |
|---|---|---|
| `byte` | 8 位 | `byte b = 100;` |
| `short` | 16 位 | `short s = 1000;` |
| `int` | 32 位 | `int count = 42;` |
| `long` | 64 位 | `long total = 10_000_000_000L;` |
| `float` | 32 位 | `float f = 3.14f;` |
| `double` | 64 位 | `double d = 3.14;` |
| `char` | 16 位 | `char c = 'A';` |
| `boolean` | — | `boolean ok = true;` |

金额计算不要用 `double`，应使用 `BigDecimal`。

```java
import java.math.BigDecimal;

BigDecimal price = new BigDecimal("19.90");
BigDecimal total = price.multiply(new BigDecimal("3"));
System.out.println(total); // 59.70
```

## 变量与常量

```java
int count = 3;
double price = 19.9;
String name = "StarLearn";
final int MAX_RETRY = 3;

var message = "类型由编译器推断"; // Java 10+
```

`var` 只能用于局部变量，并且必须有初始值。它不是动态类型。

## 字符串

```java
String name = "StarLearn";
String greeting = "你好，" + name + "！";
String formatted = String.format("课程：%s，时长：%d 分钟", name, 180);

System.out.println(greeting.length());
System.out.println(greeting.toUpperCase());
System.out.println(greeting.substring(0, 2));
System.out.println(greeting.contains("Code"));
```

字符串不可变。大量拼接使用 `StringBuilder`：

```java
var builder = new StringBuilder();
for (int i = 0; i < 3; i++) {
    builder.append(i).append(",");
}
System.out.println(builder);
```

文本块适合多行字符串：

```java
String json = """
        {
          "name": "StarLearn",
          "type": "learning"
        }
        """;
```

## 条件与循环

```java
int score = 86;

if (score >= 90) {
    System.out.println("优秀");
} else if (score >= 60) {
    System.out.println("及格");
} else {
    System.out.println("需要复习");
}

for (int i = 1; i <= 3; i++) {
    System.out.println("第 " + i + " 次");
}

String[] courses = {"C#", "Python", "Linux"};
for (String course : courses) {
    System.out.println(course);
}

int n = 0;
while (n < 2) {
    System.out.println("while " + n);
    n++;
}
```

## switch 表达式

```java
String command = "deploy";

String action = switch (command) {
    case "deploy", "release" -> "开始部署";
    case "status" -> "查看状态";
    default -> "未知命令";
};

System.out.println(action);
```

传统 switch 需要 `break`，新式箭头语法避免了穿透问题，并且可以作为表达式返回值。

## 数组

```java
int[] numbers = {3, 1, 4, 1, 5};
System.out.println(numbers.length);
System.out.println(numbers[0]);

int[] filled = new int[5];
Arrays.fill(filled, 7);

Arrays.sort(numbers);
System.out.println(Arrays.toString(numbers));
```

数组长度固定。需要动态增删时使用 `ArrayList`，后续集合章节会讲。

## 方法

```java
public class Calculator {
    public static int add(int a, int b) {
        return a + b;
    }

    public static double average(int... values) {
        if (values.length == 0) {
            throw new IllegalArgumentException("values 不能为空");
        }
        int sum = 0;
        for (int value : values) {
            sum += value;
        }
        return (double) sum / values.length;
    }

    public static void main(String[] args) {
        System.out.println(add(1, 2));
        System.out.println(average(80, 90, 100));
    }
}
```

Java 使用值传递：基本类型传值，对象传引用的副本。方法内重新赋值引用不会影响调用方，但修改对象内容会影响。

## 异常初探

```java
try {
    int value = Integer.parseInt("abc");
    System.out.println(value);
} catch (NumberFormatException e) {
    System.out.println("不是合法整数：" + e.getMessage());
} finally {
    System.out.println("无论成功失败都会执行");
}
```

不要捕获异常后什么都不做。至少要记录日志，或转换成调用方能理解的错误。

## 命名与代码风格

- 类名 `PascalCase`，方法名与变量 `camelCase`，常量 `UPPER_SNAKE_CASE`。
- 包名全小写，使用倒置域名。
- 左大括号通常不换行。
- 一个方法尽量不超过一屏，参数过多时考虑封装对象。
- 使用 `final` 表达不可变意图，但不要机械地给所有变量加。

:::note 关于分号
Java 语句必须以分号结束。初学阶段最常见的问题之一是漏分号或括号不匹配，编译器错误通常能定位到具体行。
:::

## 小练习

1. 输入三个整数，输出最大值。
2. 判断一个字符串是否为回文（忽略大小写）。
3. 用方法计算 1! + 2! + ... + 10!。

## 下一步

- [Java 面向对象](/java/oop.html)
- [集合与 Stream](/java/collections.html)
