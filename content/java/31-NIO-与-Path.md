# 第 8 章 文件与 IO

# 31. NIO 与 Path

## 学习目标

- 掌握 java.nio.file
- 学会 Path 操作
- 理解 Files 工具

## 31.1 Path 基础

```java
import java.nio.file.Path;
import java.nio.file.Paths;

Path p = Paths.get("/tmp/data/file.txt");
p.getParent();
p.getFileName();
p.toAbsolutePath();
p.normalize();
```

## 31.2 Files 工具

```java
import java.nio.file.Files;

// 读
String text = Files.readString(p);
byte[] bytes = Files.readAllBytes(p);

// 写
Files.writeString(p, "hello");
Files.write(p, byte[] data);

// 属性
FileAttributes attr = Files.getAttribute(p, "size");
Files.size(p);
Files.exists(p);

// 创建目录
Files.createDirectories(dir);
```

## 31.3 文件遍历

```java
try (Stream<Path> stream = Files.walk(p)) {
    stream.filter(Files::isRegularFile)
          .filter(f -> f.toString().endsWith(".txt"))
          .forEach(System.out::println);
}
```

## 31.4 文件通道（Channel）

```java
try (FileChannel channel = FileChannel.open(p, StandardOpenOption.READ)) {
    ByteBuffer buf = ByteBuffer.allocate(1024);
    channel.read(buf);
}
```

## 31.5 内存映射

```java
FileChannel ch = FileChannel.open(p);
ByteBuffer buf = ch.map(FileChannel.MapMode.READ_ONLY, 0, size);
```

## 31.6 文件锁定

```java
FileLock lock = channel.lock();
// ...
lock.release();
```

## 31.7 陷阱

- 大文件内存
- 路径穿越
- 编码

## 31.8 最佳实践

- Files.readString 简洁
- walk 遍历
- 显式编码

## 小结

- Path 现代
- Files 工具
- Channel 高性能
- 编码显式
