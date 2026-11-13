---
title: Python 综合练习课
description: 用 10 道选择题、5 道判断题和 5 个脚本任务，全面检查 Python 语法、容器、函数、OOP、异常与文件处理。
category: python
order: 8
practice: true
tags: [Python, 练习, 测验, 综合]
updated: 2026-11-13
---

# Python 综合练习课

Python 的简洁语法只是入门，真正的功力体现在“能否把问题拆成函数、数据结构与异常边界”。先做选择题与判断题，再完成脚本任务，最后用自检清单复盘。

## 一、选择题

:::quiz
question: "下面哪种写法能安全地遍历列表并删除满足条件的元素？"
options:
  - "直接在 for 循环中调用 list.remove()"
  - "用列表推导式生成新列表"
  - "用 while 循环逐个 pop(0)"
  - "把列表转成 set 再转回 list"
answer: B
explain: "边遍历边修改会跳过元素或抛错。`[x for x in lst if keep(x)]` 生成新列表，干净且不易出错。"
:::

:::quiz
question: "`asyncio.gather(*coros)` 的主要作用是？"
options:
  - "顺序等待每个协程完成"
  - "并发运行多个协程并等待全部完成"
  - "把协程放进线程池"
  - "取消所有协程"
answer: B
explain: "`gather` 一次性调度多个协程，返回按输入顺序排列的结果列表；任一异常传播时其余会被取消。"
:::

:::quiz
question: "为什么 `0.1 + 0.2 == 0.3` 在 Python 中为 False？"
options:
  - "Python 浮点运算有 bug"
  - "浮点数按 IEEE 754 存储，存在表示误差"
  - "== 运算符对浮点数失效"
  - "需要导入 math 模块"
answer: B
explain: "0.1 与 0.2 在二进制下无法精确表示，相加结果略偏 0.3。比较浮点应用 `abs(a - b) < 1e-9` 或 `decimal`。"
:::

:::quiz
question: "`with open('f.txt') as f:` 退出块时发生了什么？"
options:
  - "文件被关闭，但异常会丢失"
  - "文件被关闭，异常正常传播"
  - "文件不会被关闭，需要手动 close"
  - "文件被删除"
answer: B
explain: "`with` 调用 `__exit__` 关闭文件；块内异常会正常向外传播，资源一定被释放。"
:::

:::quiz
question: "`@lru_cache(maxsize=None)` 装饰一个递归斐波那契函数会带来什么效果？"
options:
  - "把递归改成循环"
  - "缓存已计算的 n，时间从指数级降到线性"
  - "让函数变成异步"
  - "消除栈溢出风险"
answer: B
explain: "记忆化让 `fib(n)` 只计算一次，后续直接查表；整体 O(n)，无需手动改循环。"
:::

:::quiz
question: "下面哪个对象可以作为字典的键？"
options:
  - "list"
  - "dict"
  - "tuple（元素都是不可变）"
  - "set"
answer: C
explain: "字典键必须可哈希。只有全部元素不可变的 tuple 可哈希；list、dict、set 都不可哈希。"
:::

:::quiz
question: "`str.format` 与 f-string 相比，f-string 的优势是？"
options:
  - "支持任意复杂度"
  - "可读性更好、性能略快"
  - "能跨版本兼容 Python 2"
  - "可以嵌套 format"
answer: B
explain: "f-string 把表达式直接写在字符串里，更直观；Python 3.6+ 默认首选。Python 2 兼容才用 format。"
:::

:::quiz
question: "函数中 `global x` 与 `nonlocal x` 的区别是？"
options:
  - "global 修改模块级，nonlocal 修改外层函数级"
  - "global 只能读，nonlocal 只能写"
  - "global 用于类，nonlocal 用于函数"
  - "没有区别"
answer: A
explain: "`global` 声明使用模块全局变量；`nonlocal` 声明使用外层嵌套函数的变量。两者都允许重新绑定。"
:::

:::quiz
question: "下列哪个表达式能正确把 `{'a': 1, 'b': 2}` 反转？"
options:
  - "{k: v for v, k in d.items()}"
  - "d[::-1]"
  - "list(d.keys()).reverse()"
  - "reversed(d)"
answer: A
explain: "推导式把键值互换。其它写法要么语法错（dict 不支持切片），要么只反转键序列而不是键值对。"
:::

:::quiz
question: "`collections.Counter` 与 `defaultdict(int)` 在统计词频上的主要区别？"
options:
  - "Counter 提供 most_common 等专用方法"
  - "defaultdict 性能更好"
  - "Counter 只能统计数字"
  - "defaultdict 支持集合运算"
answer: A
explain: "`Counter` 是专为计数设计的 `dict` 子类，带 `most_common`、`+`/`-` 等运算符；`defaultdict(int)` 也能累加，但没有这些工具。"
:::

## 二、判断题

:::judge
statement: "在 Python 中，`None == 0` 的结果为 True。"
answer: False
explain: "`None` 只与自身相等（`None is None` 为 True），与任何数值比较都为 False。"
:::

:::judge
statement: "元组创建后，其内部元素如果是可变对象（如列表），仍然可以被修改。"
answer: True
explain: "元组本身不可变，但内部可变对象的引用不变，对象自身仍可被修改。"
:::

:::judge
statement: "使用 `is` 比较两个内容相同的字符串字面量，结果必定为 True。"
answer: False
explain: "小字符串可能被驻留而 `is` 为 True，但不可依赖。`==` 比较值，`is` 比较身份，语义不同。"
:::

:::judge
statement: "在 `try/except/finally` 中，即使 except 捕获了异常，finally 仍然会执行。"
answer: True
explain: "finally 块无论如何都执行，常用于释放资源。"
:::

:::judge
statement: "Python 的线程是真正的并行执行，可以同时利用多核 CPU。"
answer: False
explain: "受 GIL 限制，同一时刻只有一个线程执行字节码。需要并行计算应使用多进程。"
:::

## 三、脚本任务

### 任务 1：JSON 配置校验器

给定一个 JSON 配置文件（包含数据库连接、超时、白名单等字段），写一个校验函数：

- 必填字段缺失时报 `KeyError` 并指明字段名；
- 数值字段必须为正数，否则抛 `ValueError`；
- 白名单必须是字符串列表，否则抛 `TypeError`；
- 全部通过后返回一个 `dataclass` 对象。

要求使用 `dataclasses` 与显式异常。

### 任务 2：Markdown 相对链接检查器

扫描一个目录下的所有 `.md` 文件，解析其中指向本地文件的相对链接（形如 `[text](path/file.md)`）：

- 对每个链接计算其绝对路径；
- 检查目标文件是否存在；
- 输出 `(源文件, 行号, 缺失目标)` 三元组列表。

要求使用 `pathlib`、正则匹配，并以生成器逐行流式处理，避免一次性读入全部文件。

### 任务 3：带重试与日志的下载器

写一个异步下载函数，支持：

- 设置超时（秒）；
- 最多重试 3 次；
- 指数退避（1s、2s、4s）；
- 用 `logging` 记录每次失败原因与耗时；
- 成功后把内容写入本地文件（原子写：先写临时文件再 `rename`）；
- 返回最终是否成功。

要求使用 `asyncio` 与 `aiofiles` 或 `aiohttp`，并演示信号量限流。

### 任务 4：日志解析器

给定一个 `app.log` 文件，每行形如：

```
2026-11-13 10:22:01 INFO  user=alice action=login
2026-11-13 10:22:05 ERROR user=bob   action=login reason=bad_password
```

写一个解析器：

- 用正则提取时间、级别、`key=value` 键值对；
- 返回 `list[LogEntry]`（`LogEntry` 用 `dataclass` 表示）；
- 统计每个级别的计数与每个用户的登录次数；
- 输出失败登录（reason=bad_password）的 IP 列表。

要求使用 `re`、`dataclass`、`Counter`。

### 任务 5：简易表达式求值器

实现一个支持 `+ - * / ( )` 与整数运算的表达式求值函数 `eval_expr(s: str) -> int`：

- 不依赖 `eval`；
- 正确处理优先级与括号；
- 输入非法（如 `2 +`、`(1`、`1 / 0`）时抛 `ValueError` 或 `ZeroDivisionError`；
- 用递归下降或调度场算法（shunting-yard）。

参考：`eval_expr("(1 + 2) * 3") == 9`，`eval_expr("1 + 2 * 3") == 7`。

## 自检清单

- 能否解释 `==` 与 `is` 在比较对象时的区别？
- 是否知道 `*args` 收集剩余位置参数、`**kwargs` 收集剩余关键字参数？
- 能否用 `dataclass` 与 `enum` 替代一长串魔法数字？
- 是否养成了显式指定文件编码 `encoding="utf-8"` 的习惯？
- 能否写出带异常处理与重试的健壮 I/O 函数？
- 是否了解 GIL 对多线程并发的限制？

## 返回

- [Python 教程首页](/python/index.html)
- [综合测验](/exercises.html)
