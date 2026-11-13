---
title: Avalonia 练习课
description: 通过 4 道选择题和 3 个界面任务，检查 XAML 布局、MVVM、命令与发布知识。
category: avalonia
order: 7
practice: true
tags: [Avalonia, 练习, MVVM, XAML]
updated: 2026-11-12
---

# Avalonia 练习课

建议先自己搭界面、写绑定，再对照解析。每道题都可以重复选择。

:::quiz
question: "Avalonia 中哪个属性用于告诉编译绑定当前 ViewModel 的类型？"
options:
  - "x:Class"
  - "x:DataType"
  - "DataContextType"
  - "BindingType"
answer: B
explain: "`x:DataType` 指定绑定的数据类型，使编译绑定能在编译期检查属性名与类型。"
:::

:::quiz
question: "在 Grid 中，`ColumnDefinitions=\"200,*\"` 表示什么？"
options:
  - "第一列 200 像素，第二列占剩余空间"
  - "两列各占 200 像素"
  - "第一列占剩余空间，第二列 200 像素"
  - "两列按 200:1 比例分配"
answer: A
explain: "`200` 是固定像素，`*` 表示占据剩余空间。`2*` 才是按比例分配剩余空间。"
:::

:::quiz
question: "使用 CommunityToolkit.Mvvm 时，`[ObservableProperty] private int _count;` 会生成什么？"
options:
  - "一个名为 _count 的公共字段"
  - "一个名为 Count 的属性并触发属性通知"
  - "一个数据库列"
  - "一个 XAML 控件"
answer: B
explain: "源生成器会生成公共属性 Count，并在赋值时触发 PropertyChanged。类需要标记 partial。"
:::

:::quiz
question: "在 Avalonia 中，后台线程完成工作后要更新 UI，应该怎么做？"
options:
  - "直接修改控件属性"
  - "调用 Dispatcher.UIThread.Post 或 InvokeAsync"
  - "重启应用"
  - "使用 Thread.Sleep"
answer: B
explain: "UI 控件具有线程亲和性，必须在 UI 线程更新。Dispatcher 可以把回调切回 UI 线程。"
:::

## 界面任务

### 任务 1：课程列表

创建一个窗口，左侧是课程分类列表，右侧显示所选分类的课程卡片。要求：

- 使用 Grid 与 ListBox；
- 分类与课程来自 ViewModel；
- 选中分类后右侧内容更新。

### 任务 2：计数器升级版

在计数器基础上增加：

- 步长输入框（1–10）；
- “减一”命令；
- 计数为 0 时“减一”按钮自动禁用；
- 深色/浅色主题切换按钮。

### 任务 3：Markdown 笔记阅读器

实现一个简化笔记应用：

- 左侧笔记列表，右侧显示标题与正文；
- “新建笔记”命令；
- 编辑后自动保存到本地 JSON 文件；
- 发布为 Linux x64 自包含单文件。

## 自检清单

- 能否在不写 code-behind 的情况下完成按钮逻辑？
- 是否理解 `ObservableCollection` 与普通 `List` 的区别？
- 能否解释 `DynamicResource` 与 `StaticResource` 的差异？
- 发布产物在干净 Linux 机器上能否直接运行？

## 返回

- [Avalonia 教程首页](/avalonia/index.html)
- [综合测验](/exercises.html)
