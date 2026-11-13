# 第 6 章 包与模块化

# 26. Java 模块系统

## 学习目标

- 理解 JPMS
- 学会 module-info
- 掌握模块导出

## 26.1 模块描述符

```java
// module-info.java
module com.example.app {
    requires java.logging;
    exports com.example.api;
}
```

## 26.2 requires

```java
requires java.sql;
requires transitive java.io;  // 传递
```

## 26.3 exports

```java
exports com.example.api;  // 对外公开
opens com.example.model;  // 反射
```

## 26.4 provides / uses

```java
provides com.example.api.Service with com.example.impl.MyService;
uses com.example.api.Service;
```

## 26.5 模块路径

```bash
javac --module-path out --module com.example.app
java --module-path out -m com.example.app/Main
```

## 26.6 陷阱

- 类路径与模块路径混用
- 循环依赖
- 反射访问

## 26.7 最佳实践

- 显式导出
- 最小 requires
- 测试模块边界

## 小结

- module-info 声明
- exports 公开 API
- provides 服务
