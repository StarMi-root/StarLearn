# 第 18 章 JSON 与序列化

# 67. Protocol Buffers

## 学习目标

- 理解 Protobuf
- 学会定义
- 掌握序列化

## 67.1 安装

```xml
<dependency>
    <groupId>com.google.protobuf</groupId>
    <artifactId>protobuf-java</artifactId>
    <version>3.x</version>
</dependency>
```

## 67.2 定义

```proto
syntax = "proto3";

message User {
    string name = 1;
    int32 age = 2;
}
```

## 67.3 生成

```bash
protoc --java_out=. user.proto
```

## 67.4 序列化

```java
User u = User.newBuilder()
    .setName("Alice")
    .setAge(30)
    .build();

byte[] bytes = u.toByteArray();
User parsed = User.parseFrom(bytes);
```

## 67.5 陷阱

- 字段顺序
- 兼容性
- 性能

## 67.6 最佳实践

- proto 定义
- 生成代码
- 跨语言

## 小结

- Protobuf 高效
- 跨语言
- 类型安全
- 生成代码
