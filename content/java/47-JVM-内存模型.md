# 第 12 章 JVM 与性能

# 47. JVM 内存模型

## 学习目标

- 理解堆与栈
- 掌握方法区
- 学会内存管理

## 47.1 堆

- 对象分配
- GC 管理
- 分代

```
young gen
├── eden
├── survivor 0
└── survivor 1
old gen
```

## 47.2 栈

- 方法调用
- 局部变量
- 线程隔离

## 47.3 方法区

- 类元数据
- 常量池
- 元空间（Metaspace）

## 47.4 直接内存

- NIO 使用
- ByteBuffer
- 不受 GC 管

## 47.5 参数

```bash
java -Xms2g -Xmx4g -Xss1m -XX:MetaspaceSize=256m
```

## 47.6 陷阱

- 栈溢出
- 堆溢出
- 直接内存泄漏

## 47.7 最佳实践

- 合理堆大小
- 避免大对象
- 监控

## 小结

- 堆对象
- 栈方法
- 方法区类
- 参数调优
