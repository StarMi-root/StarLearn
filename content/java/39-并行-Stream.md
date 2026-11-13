# 第 10 章 Stream 与函数式

# 39. 并行 Stream

## 学习目标

- 掌握 parallel
- 学会性能调优
- 理解陷阱

## 39.1 基本用法

```java
List<Integer> result = list.parallelStream()
    .map(x -> x * x)
    .collect(Collectors.toList());
```

## 39.2 何时用

- 大数据集（> 10 万）
- CPU 密集
- 无共享状态

## 39.3 陷阱

- 副作用
- 顺序敏感
- 小数据反而慢

## 39.4 性能

```java
// 串行
list.stream().map(...).collect(...);

// 并行
list.parallelStream().map(...).collect(...);
```

## 39.5 分片

- 基于 ForkJoinPool
- 自适应分片

## 39.6 避免共享

```java
List<String> shared = new ArrayList<>();
list.parallelStream().forEach(x -> shared.add(x));  // 错
```

## 39.7 正确共享

```java
ConcurrentLinkedQueue<String> shared = new ConcurrentLinkedQueue<>();
```

## 39.8 调试

- JMH 基准测试
- 观察 CPU 使用

## 39.9 最佳实践

- 大数据用并行
- 无副作用
- 避免共享可变

## 小结

- parallelStream
- CPU 密集
- 避免副作用
- 基准测试
