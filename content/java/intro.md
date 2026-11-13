---
title: Java 简介与环境搭建
description: 理解 JDK、JRE 与 JVM，安装 Java 21，运行第一个程序，并用 Maven 管理项目。
category: java
order: 1
tags: [Java, JDK, JVM, Maven]
updated: 2026-11-12
---

# Java 简介与环境搭建

Java 是运行在 JVM 上的面向对象语言，以稳定性、跨平台和企业生态著称。Android、金融系统、大型 Web 后端和数据处理平台中都能看到它。

![Java 插画（开源图标：Simple Icons CC0 / Lucide ISC）](/static/img/icons/si-openjdk.svg)

## JDK、JRE 与 JVM

- **JVM**：Java 虚拟机，执行字节码。
- **JRE**：Java 运行时环境，包含 JVM 与核心类库，适合只运行程序。
- **JDK**：Java 开发工具包，包含编译器 `javac`、运行时和调试工具。

开发需要安装 JDK。建议使用 Java 21 LTS 或更新的 LTS 版本。

## 安装 JDK

### Windows

从 Adoptium、Oracle 或 Microsoft OpenJDK 下载安装包。安装后验证：

```powershell
java -version
javac -version
```

### Linux

```bash
sudo apt update
sudo apt install -y openjdk-21-jdk
java -version
javac -version
```

### macOS

```bash
brew install openjdk@21
java -version
```

如果系统存在多个 JDK，可以用 `update-alternatives`（Linux）或 `JAVA_HOME` 指定默认版本。

## 第一个 Java 程序

创建 `Hello.java`：

```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, StarLearn!");
    }
}
```

编译并运行：

```bash
javac Hello.java
java Hello
```

注意：文件名必须与 public 类名一致，即 `Hello.java`。运行 `java Hello` 时不要加 `.class`。

使用 Java 11+ 的单文件源码模式可以直接运行：

```bash
java Hello.java
```

## 包与目录结构

真实项目不会把所有类放在根目录。包名通常使用倒置域名：

```text
src/main/java/
└── com/starlearn/demo/
    ├── App.java
    └── service/
        └── CourseService.java
```

```java
package com.starlearn.demo;

public class App {
    public static void main(String[] args) {
        System.out.println("包结构示例");
    }
}
```

包名与目录结构必须匹配，否则编译或运行会找不到类。

## Maven 项目

Maven 是 Java 常用的构建与依赖管理工具。`pom.xml` 描述项目：

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.starlearn</groupId>
  <artifactId>demo</artifactId>
  <version>1.0.0</version>

  <properties>
    <maven.compiler.release>21</maven.compiler.release>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
  </properties>
</project>
```

常用命令：

```bash
mvn clean package
mvn test
mvn spring-boot:run
```

Gradle 也是主流选择，语法更灵活。初学阶段先掌握一种，理解依赖、构建、测试和打包的流程。

## IDE 与调试

- **IntelliJ IDEA**：Java 生态最常用，社区版足够学习。
- **VS Code**：安装 Extension Pack for Java。
- **Eclipse**：经典选择，企业环境常见。

调试时重点看：调用栈、变量值、断点条件、异常原因（Caused by）。不要只盯最后一行错误。

## 常见问题

**`javac` 不是内部或外部命令**：JDK 未安装或 PATH 未配置。安装 JDK，而不是只安装 JRE。

**版本不匹配**：用 `javac -version` 和 `java -version` 确认编译器与运行时一致。Maven 项目还要看 `maven.compiler.release`。

**中文乱码**：源文件使用 UTF-8，编译时加 `-encoding UTF-8`；Maven 设置 `project.build.sourceEncoding`。

:::tip 学习建议
先不用 IDE 的自动生成，手写几次类、接口和 main 方法。理解编译单元、包和类路径后，再享受 IDE 的效率。
:::

## 下一步

- [Java 基础语法](/java/syntax.html)
- [面向对象](/java/oop.html)
- [集合与 Stream](/java/collections.html)
