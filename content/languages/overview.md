---
title: 编程语言学习地图：系统、脚本与硬件描述
description: C、C++、Zig、Scala、Ruby、Perl、Lua、Dart、汇编与 Verilog 的定位、学习顺序与适用场景。
category: languages
order: 1
tags: [C, C++, Rust, Verilog]
updated: 2026-11-12
---

# 编程语言学习地图：系统、脚本与硬件描述

语言没有绝对高低，只有约束与场景。系统编程关注内存和性能，脚本语言关注表达效率，JVM 语言关注生态，硬件描述语言关注时序与电路。先精通一门，再用“对照学习”扩展第二门。

![编程语言图标（Simple Icons CC0 / Lucide ISC）](/static/img/icons/si-cplusplus.svg)

:::tip 先选一条主线
不要同时开五门课。先按下面的顺序完成一个最小项目，再把目录里的其他主题当作按需查阅的工具书。
:::

## 推荐学习顺序

1. **C 语言**：理解指针、内存、结构体和编译链接，这是系统编程的共同底座。
2. **C++ 或 Zig**：在 C 之上学习抽象、资源管理和工程化；Zig 适合观察显式内存控制。
3. **脚本语言**：Ruby、Perl、Lua 任选一门，练习文本处理、自动化和嵌入脚本。
4. **JVM 与客户端语言**：Scala 用于函数式/JVM 生态，Dart 服务于 Flutter 客户端。
5. **汇编与 Verilog**：从指令和电路层面理解程序如何真正运行。

## 全部主题

下表覆盖本方向在 StarLearn 课程目录中的全部主题。标记为“本站精讲”的可以直接进入中文教程；标记为“详细文档”的会打开对应技术的官方文档，适合补充语法细节和查阅示例。

| 主题 | 学什么 | 入口 |
| --- | --- | --- |
| C 语言 | 指针、结构体、内存管理与系统级编程基础。 | [详细文档 ↗](https://en.cppreference.com/w/c/language) |
| C++ | 面向对象、STL、模板与高性能程序设计。 | [详细文档 ↗](https://en.cppreference.com/w/cpp/language) |
| Zig | 强调显式内存管理与可预测性能的现代系统语言。 | [详细文档 ↗](https://ziglang.org/learn/) |
| Scala | 函数式与面向对象融合的 JVM 语言。 | [详细文档 ↗](https://docs.scala-lang.org/tour/tour-of-scala.html) |
| Ruby | 优雅简洁的脚本语言与 Rails 生态。 | [详细文档 ↗](https://www.ruby-lang.org/en/documentation/quickstart/) |
| Perl | 文本处理、正则表达式与系统管理脚本。 | [详细文档 ↗](https://perldoc.perl.org/perlintro) |
| Lua | 轻量嵌入式脚本语言，游戏与配置场景常用。 | [详细文档 ↗](https://www.lua.org/manual/5.4/) |
| Dart | Flutter 使用的客户端语言，异步与面向对象。 | [详细文档 ↗](https://dart.dev/language) |
| 汇编语言 | 寄存器、指令集、内存寻址与底层程序分析。 | [详细文档 ↗](https://en.wikibooks.org/wiki/X86_Assembly) |
| Verilog | 数字电路建模、时序逻辑与硬件描述语言入门。 | [详细文档 ↗](https://www.chipverify.com/verilog/verilog-tutorial) |

## 学完后的检查点

- 能解释栈、堆、指针和值/引用传递。
- 能说出编译型、解释型和 JIT 的差异。
- 能用 Verilog 写一个简单时序逻辑模块并说明时钟作用。

:::note 学习建议
每学完一个主题，至少留下三样东西：一段可运行的代码、一条自己的解释、一个能复现的踩坑记录。把它们放进笔记或项目仓库，比“看过”更能证明掌握。
:::

