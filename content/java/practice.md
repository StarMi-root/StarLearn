---
title: Java 练习课
description: 用 5 道选择题和 3 个编程任务，检查 Java 类型、OOP、集合、Stream 与 Spring Boot。
category: java
order: 6
practice: true
tags: [Java, 练习, 测验]
updated: 2026-11-12
---

# Java 练习课

选择题用于检查概念，编程任务用于检验能否独立写出可运行代码。建议使用 Java 21。

:::quiz
question: "Java 中 `String` 类型的特点是？"
options:
  - "不可变"
  - "只能存数字"
  - "必须用 new 创建"
  - "不能拼接"
answer: A
explain: "String 是不可变对象，拼接、截取等操作都会返回新字符串。大量拼接应使用 StringBuilder。"
:::

:::quiz
question: "接口中的方法默认是什么访问级别？"
options:
  - "public"
  - "private"
  - "protected"
  - "包级私有"
answer: A
explain: "接口方法默认是 public abstract（Java 8+ 可以有 default/static 方法）。实现类必须公开实现这些方法。"
:::

:::quiz
question: "`record` 类型会自动生成哪些方法？"
options:
  - "equals、hashCode、toString"
  - "main 方法"
  - "数据库表"
  - "线程池"
answer: A
explain: "record 自动生成规范构造器、访问器、equals、hashCode 和 toString，适合不可变数据载体。"
:::

:::quiz
question: "Stream 的 `filter` 属于哪类操作？"
options:
  - "中间操作"
  - "终止操作"
  - "编译指令"
  - "线程同步"
answer: A
explain: "filter 是中间操作，返回新的 Stream；只有遇到 toList、collect、forEach 等终止操作时才会执行。"
:::

:::quiz
question: "Spring Boot 中用于声明 REST 控制器的注解是？"
options:
  - "@RestController"
  - "@Entity"
  - "@Configuration"
  - "@Bean"
answer: A
explain: "@RestController 组合了 @Controller 与 @ResponseBody，返回值会直接序列化为响应体。"
:::

## 编程任务

### 任务 1：课程管理

定义 `Course` record，包含 id、title、category、minutes。实现一个内存版 Repository，支持新增、按 id 查询、按分类筛选。用 JUnit 写出至少 3 个测试。

### 任务 2：成绩统计

给定学生与成绩列表，使用 Stream 完成：

- 计算平均分；
- 按班级分组统计人数与平均分；
- 找出每个班级的最高分学生。

要求处理空列表与重复姓名的情况。

### 任务 3：Spring Boot API

创建一个 Spring Boot 项目，提供：

- `GET /api/courses` 分页查询；
- `POST /api/courses` 创建课程；
- 参数校验与统一错误处理；
- 用 H2 数据库持久化。

完成后用 curl 或 Swagger 测试，并打包为可执行 JAR。

## 自检清单

- 能否解释 JVM、JRE、JDK 的区别？
- 是否理解接口与抽象类的适用场景？
- 能否说出 ArrayList 与 LinkedList 的差异？
- 是否知道 Stream 的延迟执行？
- 能否把一个 Spring Boot JAR 部署到 Linux 服务器？

## 返回

- [Java 教程首页](/java/index.html)
- [综合测验](/exercises.html)
