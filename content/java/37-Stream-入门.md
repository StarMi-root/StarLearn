# 第 10 章 Stream 与函数式

# 37. Stream 入门

## 学习目标

- 掌握 Stream 基本操作
- 学会中间操作
- 理解终端操作

## 37.1 创建 Stream

```java
List<String> list = List.of("a", "b", "c");
Stream<String> s = list.stream();

int[] arr = {1, 2, 3};
IntStream is = Arrays.stream(arr);

Stream<Integer> gen = Stream.iterate(0, n -> n + 1).limit(10);
```

## 37.2 中间操作

```java
s.filter(x -> x > 0)
 .map(x -> x * 2)
 .sorted()
 .distinct()
```

## 37.3 终端操作

```java
int count = s.count();
List<Integer> result = s.collect(Collectors.toList());
Optional<Integer> max = s.max(Integer::compareTo);
s.forEach(System.out::println);
```

## 37.4 示例

```java
List<String> upper = list.stream()
    .filter(s -> s.length() > 2)
    .map(String::toUpperCase)
    .sorted()
    .toList();
```

## 37.5 陷阱

- Stream 只能遍历一次
- 中间操作惰性
- 并行 Stream 副作用

## 37.6 最佳实践

- 链式简洁
- 避免副作用
- 终端操作必须

## 小结

- Stream 惰性
- 中间 + 终端
- 链式简洁
- 不能重用
