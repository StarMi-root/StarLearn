# 第 11 章 并发

# 43. CompletableFuture

## 学习目标

- 掌握异步组合
- 学会 thenApply
- 理解异常处理

## 43.1 基本用法

```java
CompletableFuture<String> future = CompletableFuture
    .supplyAsync(() -> "hello")
    .thenApply(s -> s + " world");

future.thenAccept(System.out::println);
```

## 43.2 组合

```java
CompletableFuture<A> f1 = ...;
CompletableFuture<B> f2 = ...;
CompletableFuture<Void> both = f1.thenCombine(f2, (a, b) -> { ... });
```

## 43.3 异常

```java
future.handle((result, ex) -> {
    if (ex != null) {
        log.error("failed", ex);
    }
    return default;
});
```

## 43.4 并行

```java
CompletableFuture.allOf(f1, f2, f3).join();
```

## 43.5 陷阱

- 阻塞调用
- 异常未处理
- 死锁

## 43.6 最佳实践

- 非阻塞
- handle 异常
- 组合简单

## 小结

- supplyAsync
- thenApply 链
- handle 异常
- 并行组合
