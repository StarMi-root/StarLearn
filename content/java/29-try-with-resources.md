# 第 7 章 异常

# 29. try-with-resources

## 学习目标

- 掌握 AutoCloseable
- 学会 try-with-resources
- 理解资源管理

## 29.1 基本用法

```java
try (BufferedReader reader = new BufferedReader(new FileReader("data.txt"))) {
    String line = reader.readLine();
}
// 自动关闭
```

## 29.2 多个资源

```java
try (FileReader fr = new FileReader("a.txt");
     FileWriter fw = new FileWriter("b.txt")) {
    // ...
}
```

关闭顺序：逆序。

## 29.3 已有关闭的资源

```java
InputStream in = openStream();
try (in) {  // 有效 final 变量
    // ...
}
```

## 29.4 AutoCloseable 接口

```java
public interface MyResource extends AutoCloseable {
    @Override
    default void close() {
        // 实现
    }
}
```

## 29.5 陷阱

- 异常时仍关闭
- 资源已关闭
- 顺序错误

## 29.6 最佳实践

- 资源用 try-with-resources
- 实现 AutoCloseable
- 不手动 close

## 29.7 与 finally 对比

```java
// 差
FileInputStream in = null;
try {
    in = new FileInputStream("a");
    // ...
} finally {
    if (in != null) in.close();
}

// 好
try (FileInputStream in = new FileInputStream("a")) {
    // ...
}
```

## 小结

- try-with-resources 自动关闭
- AutoCloseable 接口
- 资源声明在 try 内
