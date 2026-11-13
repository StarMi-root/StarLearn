---
title: Java 集合与 Stream
description: List、Set、Map、泛型、迭代器与 Stream API，用现代 Java 处理数据集合。
category: java
order: 4
tags: [Java, 集合, Stream, 泛型]
updated: 2026-11-12
---

# Java 集合与 Stream

Java 集合框架提供列表、集合、映射等数据结构；Stream 则提供声明式的数据处理管道。两者配合，能显著减少样板循环。

## List

```java
import java.util.ArrayList;
import java.util.List;

List<String> courses = new ArrayList<>();
courses.add("C#");
courses.add("Python");
courses.add("Linux");

System.out.println(courses.get(0));
System.out.println(courses.size());
System.out.println(courses.contains("Java"));

for (String course : courses) {
    System.out.println(course);
}
```

`ArrayList` 基于数组，随机访问快；`LinkedList` 适合频繁在两端增删，但现代代码中 `ArrayList` 通常是默认选择。

## Map

```java
import java.util.HashMap;
import java.util.Map;

Map<String, Integer> scores = new HashMap<>();
scores.put("Ada", 98);
scores.put("Linus", 95);
scores.putIfAbsent("Grace", 99);

for (Map.Entry<String, Integer> entry : scores.entrySet()) {
    System.out.println(entry.getKey() + " = " + entry.getValue());
}

int ada = scores.getOrDefault("Ada", 0);
```

需要保持插入顺序用 `LinkedHashMap`；需要按 key 排序用 `TreeMap`。

## Set

```java
import java.util.HashSet;
import java.util.Set;

Set<String> tags = new HashSet<>();
tags.add("java");
tags.add("backend");
tags.add("java"); // 不会重复

System.out.println(tags.size()); // 2
```

`HashSet` 依赖 `equals` 与 `hashCode`。自定义对象放入 Set 或作为 Map 的 key 时，必须正确实现这两个方法；`record` 会自动生成。

## 泛型

```java
public class Box<T> {
    private T value;

    public void set(T value) {
        this.value = value;
    }

    public T get() {
        return value;
    }
}

Box<String> box = new Box<>();
box.set("hello");
System.out.println(box.get().toUpperCase());
```

泛型在编译期提供类型检查，避免运行时强制转换。通配符 `? extends T` 适合读取，`? super T` 适合写入。

## Collections 工具

```java
import java.util.Collections;
import java.util.List;

List<Integer> numbers = new ArrayList<>(List.of(3, 1, 4, 1, 5));
Collections.sort(numbers);
System.out.println(numbers);

List<Integer> immutable = List.of(1, 2, 3);
// immutable.add(4); // UnsupportedOperationException
```

`List.of`、`Map.of` 创建不可变集合，适合常量数据。需要修改时再复制到可变集合。

## Stream 入门

```java
import java.util.List;
import java.util.stream.Collectors;

List<Course> courses = List.of(
    new Course("C#", "backend", 180),
    new Course("Python", "ai", 200),
    new Course("Linux", "ops", 150),
    new Course("Avalonia", "desktop", 240)
);

List<String> longCourseTitles = courses.stream()
    .filter(c -> c.minutes() >= 180)
    .sorted((a, b) -> Integer.compare(b.minutes(), a.minutes()))
    .map(Course::title)
    .toList();

System.out.println(longCourseTitles);
```

`stream()` 创建管道，`filter`、`map`、`sorted` 是中间操作，`toList`、`collect`、`forEach` 是终止操作。没有终止操作时不会执行。

## 分组与统计

```java
Map<String, List<Course>> byCategory = courses.stream()
    .collect(Collectors.groupingBy(Course::category));

Map<String, Integer> totalMinutes = courses.stream()
    .collect(Collectors.groupingBy(
        Course::category,
        Collectors.summingInt(Course::minutes)
    ));

long count = courses.stream()
    .filter(c -> c.minutes() > 180)
    .count();
```

## Optional

```java
Optional<Course> found = courses.stream()
    .filter(c -> c.title().equals("Java"))
    .findFirst();

String title = found.map(Course::title).orElse("未找到");
```

`Optional` 用于表达“可能没有结果”，不要用它替代所有 null 检查，也不要把 `Optional` 作为字段类型滥用。

## 性能与可读性

- 小集合优先考虑可读性，不要过早优化。
- 避免在 Stream 中产生副作用（修改外部集合、打印日志）。
- 大数据量注意装箱成本，必要时用 `IntStream`。
- 并行流 `parallelStream()` 不是银弹，I/O 与共享状态场景可能更慢。

:::warn 常见陷阱
在 `forEach` 中修改正在遍历的集合会抛 `ConcurrentModificationException`。需要删除元素时使用 `removeIf` 或显式迭代器。
:::

## 小练习

1. 给定学生成绩，按班级分组求平均分。
2. 从课程列表中找出时长最长的 3 门课。
3. 统计一段文本中每个单词的出现次数（用 Map）。

## 下一步

- [Spring Boot 入门](/java/springboot.html)
- [Java 练习课](/java/practice.html)
