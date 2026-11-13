---
title: 编程基础综合练习：100 题中的核心 15 题
description: 变量、数据类型、数组、条件、循环、函数与运算符混合练习，附答案和详细解析。
category: foundations
order: 7
practice: true
tags: [练习, 综合, 基础]
updated: 2026-11-13
---

# 编程基础综合练习

下面 15 道题覆盖变量、数组、条件、循环、运算符和函数。建议先遮住答案独立完成，再对照解析。每道题都问自己：**输入是什么？边界在哪里？时间复杂度是多少？**

:::quiz
question: 下列哪个变量名最符合“用户是否已激活”的语义？
options:
  - "flag"
  - "isActive"
  - "user1"
  - "activeFlagYes"
answer: B
explain: 布尔变量用 is/has/can 开头，isActive 直接表达含义。
:::

:::quiz
question: C# 中 `double price = 19.9; int yuan = (int)price;` 的结果是？
options:
  - "20"
  - "19.9"
  - "19"
  - "编译错误"
answer: C
explain: 显式转换会截断小数部分，不做四舍五入。
:::

:::quiz
question: 数组长度为 10，最后一个元素的下标是？
options:
  - "10"
  - "9"
  - "0"
  - "11"
answer: B
explain: 下标从 0 开始，最后一个为 length - 1。
:::

:::quiz
question: `score = 59`，执行 `if (score >= 60) pass else fail` 后结果是？
options:
  - "pass"
  - "fail"
  - "报错"
  - "无输出"
answer: B
explain: 59 不满足 >= 60，进入 else。
:::

:::quiz
question: 下列哪个循环一定会执行至少一次？
options:
  - "for"
  - "while"
  - "do-while"
  - "foreach"
answer: C
explain: do-while 先执行循环体，再判断条件。
:::

:::quiz
question: Python 中 `[x * 2 for x in range(3)]` 的结果是？
options:
  - "[0, 2, 4]"
  - "[2, 4, 6]"
  - "[0, 1, 2]"
  - "[1, 2, 3]"
answer: A
explain: range(3) 是 0,1,2，各乘 2 得到 0,2,4。
:::

:::quiz
question: 函数没有显式 return 时，Python 返回什么？
options:
  - "0"
  - "None"
  - "空字符串"
  - "报错"
answer: B
explain: Python 函数默认返回 None。
:::

:::quiz
question: 哪个操作最适合用字典而不是数组？
options:
  - "保存一周七天的温度"
  - "按学号查找学生"
  - "遍历打印 1 到 100"
  - "保存固定顺序的步骤"
answer: B
explain: 字典按键查找平均 O(1)，适合 ID 映射。
:::

:::quiz
question: 下面哪个表达式可能因为短路而让 `save()` 不执行？
options:
  - "a && save()"
  - "save() && a"
  - "a || save()"
  - "save() || a"
answer: A
explain: a 为假时，&& 右边不会执行。
:::

:::quiz
question: 比较两个金额是否相等，较合适的类型是？
options:
  - "float"
  - "double"
  - "decimal / BigDecimal"
  - "int"
answer: C
explain: 金额需要十进制精确类型。
:::

:::quiz
question: 一个函数既读数据库又计算税费又发邮件，最应该？
options:
  - "保留，函数越长越完整"
  - "拆成职责单一的函数"
  - "改成递归"
  - "全部放进 main"
answer: B
explain: 单一职责让测试、复用和维护更容易。
:::

:::quiz
question: 遍历列表并删除元素时，最安全的方式是？
options:
  - "直接 remove"
  - "倒序遍历或先收集再删除"
  - "清空列表"
  - "用无限循环"
answer: B
explain: 正序删除会改变下标；倒序或先收集能避免跳过元素。
:::

:::quiz
question: 嵌套两层循环遍历 n 个元素，时间复杂度通常是？
options:
  - "O(1)"
  - "O(log n)"
  - "O(n)"
  - "O(n²)"
answer: D
explain: 外层 n 次，每次内层 n 次，总计 n²。
:::

:::quiz
question: 写函数时，哪个做法最有利于测试？
options:
  - "依赖全局变量"
  - "输入参数明确、输出可预测"
  - "修改传入的列表"
  - "隐藏所有返回值"
answer: B
explain: 明确输入输出、减少副作用，测试更容易编写。
:::

:::quiz
question: 看到 `while (true)` 时，首先应该检查什么？
options:
  - "是否有 break 或 return"
  - "是否有数组"
  - "是否用了字符串"
  - "是否有注释"
answer: A
explain: 无限循环必须有明确的退出路径。
:::

## 如何继续练

1. 把每道题改一个边界条件，例如空数组、负数、最大整数。
2. 用另一种语言重写同一道题，比较语法差异。
3. 给错题建立“错误原因 → 正确规则 → 反例”的笔记。
4. 进入具体语言路线，把基础能力用到真实项目里。
