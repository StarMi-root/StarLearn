# 第 4 章 方法

# 17. 方法引用与 Lambda

## 学习目标

- 掌握 Lambda 表达式
- 学会方法引用
- 理解函数式接口

## 17.1 Lambda 基础

```java
// 函数式接口
List<String> names = List.of("Alice", "Bob", "carol");
names.sort((a, b) -> a.length() - b.length());
```

## 17.2 方法引用

```java
names.sort(String::compareToIgnoreCase);
names.forEach(System.out::println);
```

## 17.3 常见函数式接口

| 接口 | 形式 |
|------|------|
| `Predicate<T>` | `boolean test(T)` |
| `Consumer<T>` | `void accept(T)` |
| `Function<T, R>` | `R apply(T)` |
| `Supplier<T>` | `T get()` |
| `UnaryOperator<T>` | `T apply(T)` |

```java
Predicate<String> isLong = s -> s.length() > 5;
Function<String, Integer> len = String::length;
Supplier<List<String>> factory = ArrayList::new;
Consumer<String> printer = System.out::println;
```

## 17.4 与 Stream 配合

```java
names.stream()
    .filter(isLong)
    .map(len)
    .forEach(printer);
```

## 17.5 方法引用形式

```java
String::length              // 实例方法
String::compareToIgnoreCase // 静态
ArrayList::new              // 构造器
int[]::new                 // 数组
```

## 17.6 陷阱

- Lambda 捕获的变量必须 final 或 effectively final
- 复杂逻辑用方法
- 避免嵌套 Lambda

## 17.7 最佳实践

- 简单单行用 Lambda
- 复杂逻辑提取方法
- 方法引用更清晰

## 小结

- Lambda 简洁
- 方法引用更直观
- 函数式接口组合
- 捕获变量不可变
