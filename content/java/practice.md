---
title: Java 综合练习课
description: 用 10 道选择题、5 道判断题和 5 个脚本任务，全面检查 Java 语法、集合、OOP、异常与并发。
category: java
order: 8
practice: true
tags: [Java, 练习, 测验, 综合]
updated: 2026-11-13
---

# Java 综合练习课

Java 的语法严谨，真正的功力在于“能否用集合、泛型与并发把问题拆成可维护的模块”。先做选择题与判断题，再完成脚本任务，最后用自检清单复盘。

## 一、选择题

:::quiz
question: "下面哪种写法能安全地遍历列表并删除满足条件的元素？"
options:
  - "直接在 for-each 中调用 list.remove()"
  - "用 list.removeIf(pred) 过滤"
  - "用 while 循环逐个 remove(0)"
  - "把列表转成 Set 再转回 List"
answer: B
explain: "for-each 中修改集合会抛 ConcurrentModificationException。`removeIf` 是 JDK 8+ 提供的安全删除 API。"
:::

:::quiz
question: "`CompletableFuture.supplyAsync(...).thenApply(...)` 的主要特点是？"
options:
  - "顺序执行，阻塞调用线程"
  - "异步执行，非阻塞组合"
  - "把任务放进线程池后顺序运行"
  - "取消所有后续任务"
answer: B
explain: "`supplyAsync` 提交到 ForkJoinPool，`thenApply` 链式组合；整个流不阻塞当前线程。"
:::

:::quiz
question: "为什么 `0.1 + 0.2 == 0.3` 在 Java 中为 false？"
options:
  - "Java 浮点运算有 bug"
  - "浮点按 IEEE 754 存储，存在表示误差"
  - "== 运算符对 double 失效"
  - "需要导入 Math 模块"
answer: B
explain: "0.1 与 0.2 在二进制下无法精确表示，相加结果略偏 0.3。比较浮点应用 `Math.abs(a - b) < 1e-9` 或 `BigDecimal`。"
:::

:::quiz
question: "`try (BufferedReader r = new BufferedReader(...)) { ... }` 退出块时发生了什么？"
options:
  - "流被关闭，但异常会丢失"
  - "流被关闭，异常正常传播"
  - "流不会被关闭，需要手动 close"
  - "流被 GC 回收"
answer: B
explain: "try-with-resources 调用 `close()` 释放资源；块内异常会正常向外传播。"
:::

:::quiz
question: "`@Override` 注解的主要作用是？"
options:
  - "让方法变成静态"
  - "编译期检查方法是否真正重写父类"
  - "让方法线程安全"
  - "自动调用父类方法"
answer: B
explain: "`@Override` 在编译期校验方法签名与父类匹配，避免拼写错误导致的“伪重写”。"
:::

:::quiz
question: "下面哪个对象可以作为 HashMap 的键？"
options:
  - "ArrayList"
  - "HashMap"
  - "String"
  - "int[]"
answer: C
explain: "HashMap 键必须可哈希且正确实现 equals/hashCode。String 满足；集合与数组不行。"
:::

:::quiz
question: "泛型方法 `static <T> List<T> reverse(List<T> list)` 中，类型参数 T 的约束是？"
options:
  - "必须是 Number 子类"
  - "必须是 Object 子类"
  - "无约束，默认 Object 上界"
  - "必须是 Serializable"
answer: C
explain: "未显式 extends 时，T 上界为 Object。需要约束时用 `extends` 或 `super`。"
:::

:::quiz
question: "`Stream` 的 `collect(Collectors.toList())` 返回什么？"
options:
  - "一个不可变 List"
  - "一个可变 ArrayList"
  - "一个 Set"
  - "一个 Map"
answer: B
explain: "`Collectors.toList()` 默认返回可变 ArrayList。需要不可变用 `Collectors.toUnmodifiableList()`。"
:::

:::quiz
question: "线程池中 `Executors.newFixedThreadPool(n)` 返回的线程池特性是？"
options:
  - "无界队列，O(N) 线程"
  - "固定 n 个线程 + 无界队列"
  - "最多 n 个线程，超出即拒绝"
  - "按需创建，无上限"
answer: B
explain: "`newFixedThreadPool` 固定核心线程数，任务进无界队列；队列满才会拒绝。"
:::

:::quiz
question: "下面哪个是 `record` 的自动方法？"
options:
  - "equals / hashCode / toString"
  - "clone()"
  - "wait()"
  - "synchronized()"
answer: A
explain: "record 自动生成交付构造器、访问器、equals、hashCode、toString；不可变且 final。"
:::

## 二、判断题

:::judge
statement: "在 Java 中，`null` 可以作为任何引用类型的合法值。"
answer: True
explain: "引用类型默认值即为 null，显式赋值也合法；基本类型不能为 null。"
:::

:::judge
statement: "数组是引用类型，`==` 比较两个数组会比较内容。"
answer: False
explain: "`==` 比较身份；内容比较用 `Arrays.equals(a, b)`。"
:::

:::judge
statement: "在 `try/catch/finally` 中，即使 catch 处理了异常，finally 仍会执行。"
answer: True
explain: "finally 块无论如何都执行，常用于释放资源。"
:::

:::judge
statement: "Java 的 `synchronized` 块只能修饰方法，不能修饰代码块。"
answer: False
explain: "`synchronized (obj) { ... }` 可以修饰任意代码块，对象锁由 obj 决定。"
:::

:::judge
statement: "泛型在运行时会被擦除，因此 `List<String>` 与 `List<Integer>` 在字节码层面相同。"
answer: True
explain: "类型擦除后都变成 `List`；泛型信息仅存在于编译期，无法 `instanceof` 判断。"
:::

## 三、脚本任务

### 任务 1：JSON 配置校验器

给定一个 JSON 配置文件（包含数据库连接、超时、白名单等字段），写一个校验函数：

- 必填字段缺失时抛 `IllegalArgumentException` 并指明字段名；
- 数值字段必须为正数，否则抛 `NumberFormatException`；
- 白名单必须是字符串列表，否则抛 `ClassCastException`；
- 全部通过后返回一个 `record` 对象。

要求使用 `record`、`ObjectMapper`（Jackson）与显式异常。

### 任务 2：Markdown 相对链接检查器

扫描一个目录下的所有 `.md` 文件，解析其中指向本地文件的相对链接（形如 `[text](path/file.md)`）：

- 对每个链接计算其绝对路径；
- 检查目标文件是否存在；
- 输出 `(源文件, 行号, 缺失目标)` 三元组列表。

要求使用 `java.nio.file`、正则匹配，并以 `Stream` 逐行流式处理，避免一次性读入全部文件。

### 任务 3：带重试与日志的下载器

写一个下载函数，支持：

- 设置超时（毫秒）；
- 最多重试 3 次；
- 指数退避（1s、2s、4s）；
- 用 `java.util.logging` 记录每次失败原因与耗时；
- 成功后把内容写入本地文件（原子写：先写临时文件再 `Files.move`）；
- 返回最终是否成功。

要求使用 `java.net.http.HttpClient`，并演示 `CompletableFuture` 异步组合。

### 任务 4：日志解析器

给定一个 `app.log` 文件，每行形如：

```
2026-11-13 10:22:01 INFO  user=alice action=login
2026-11-13 10:22:05 ERROR user=bob   action=login reason=bad_password
```

写一个解析器：

- 用正则提取时间、级别、`key=value` 键值对；
- 返回 `List<LogEntry>`（`LogEntry` 用 `record` 表示）；
- 统计每个级别的计数与每个用户的登录次数；
- 输出失败登录（reason=bad_password）的 IP 列表。

要求使用 `Pattern`、`record`、`Map.merge` 或 `Collectors.groupingBy`。

### 任务 5：简易表达式求值器

实现一个支持 `+ - * / ( )` 与整数运算的表达式求值函数 `int evalExpr(String s)`：

- 不依赖脚本引擎；
- 正确处理优先级与括号；
- 输入非法（如 `2 +`、`(1`、`1 / 0`）时抛 `IllegalArgumentException` 或 `ArithmeticException`；
- 用递归下降或调度场算法（shunting-yard）。

参考：`evalExpr("(1 + 2) * 3") == 9`，`evalExpr("1 + 2 * 3") == 7`。

## 自检清单

- 能否解释 `==` 与 `.equals()` 在比较对象时的区别？
- 是否知道 `var` 与显式类型在局部变量上的差异？
- 能否用 `record` 与 `enum` 替代一长串魔法数字？
- 是否养成了 try-with-resources 与显式编码 `UTF-8` 的习惯？
- 能否写出带异常处理与重试的健壮 I/O 函数？
- 是否了解 JVM 类型擦除对泛型 `instanceof` 的影响？

## 返回

- [Java 教程首页](/java/index.html)
- [综合测验](/exercises.html)
