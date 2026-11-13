# 第 10 章 Stream 与函数式

# 38. Stream 聚合

## 学习目标

- 掌握 collect
- 学会分组
- 理解 Reducer

## 38.1 基本聚合

```java
int sum = list.stream().mapToInt(Integer::intValue).sum();
double avg = list.stream().mapToInt(Integer::intValue).average().orElse(0);
```

## 38.2 collect

```java
import java.util.stream.Collectors;

List<String> result = list.stream()
    .filter(s -> s.length() > 2)
    .collect(Collectors.toList());
```

## 38.3 分组

```java
Map<String, List<User>> byDept = users.stream()
    .collect(Collectors.groupingBy(User::getDept));
```

## 38.4 多键分组

```java
Map<String, Map<String, List<User>>> byDeptAndCity =
    users.stream()
    .collect(Collectors.groupingBy(User::getDept,
        Collectors.groupingBy(User::getCity)));
```

## 38.5 聚合

```java
Map<String, Integer> countByDept = users.stream()
    .collect(Collectors.groupingBy(User::getDept,
        Collectors.counting()));

Map<String, Double> avgByDept = users.stream()
    .collect(Collectors.groupingBy(User::getDept,
        Collectors.averagingInt(User::getAge)));
```

## 38.6 join

```java
String names = users.stream()
    .map(User::getName)
    .collect(Collectors.joining(", ", "[", "]"));
// [Alice, Bob, Carol]
```

## 38.7 reduce

```java
int sum = list.stream().reduce(0, Integer::sum, (a, b) -> a + b);
```

## 38.8 陷阱

- 分组性能
- 空集合
- 副作用

## 38.9 最佳实践

- groupingBy 简化
- join 拼接
- reduce 灵活

## 小结

- collect 强大
- 分组多键
- reduce 灵活
- join 拼接
