---
title: 前端练习课
description: 用 5 道选择题和 3 个页面任务，检查 HTML 语义、CSS 布局、JavaScript 异步与 React 组件。
category: frontend
order: 7
practice: true
tags: [前端, 练习, HTML, React]
updated: 2026-11-12
---

# 前端练习课

前端学习最怕“看得懂、写不出”。先做选择题，再独立完成页面任务，最后用键盘和手机尺寸验收。

:::quiz
question: "页面唯一的主要内容区域应使用哪个语义标签？"
options:
  - "<main>"
  - "<div>"
  - "<span>"
  - "<center>"
answer: A
explain: "<main> 表示文档的主要内容区域，通常每页只有一个，有利于可访问性与 SEO。"
:::

:::quiz
question: "CSS 中 `box-sizing: border-box` 的作用是？"
options:
  - "width 包含 padding 与 border"
  - "隐藏所有边框"
  - "让元素变成圆形"
  - "禁用盒模型"
answer: A
explain: "border-box 让设置的 width 包含 padding 和 border，布局尺寸更直观，通常全局设置。"
:::

:::quiz
question: "`fetch` 遇到 HTTP 404 时默认会怎样？"
options:
  - "Promise resolve，需要检查 response.ok"
  - "直接抛出异常"
  - "自动重试"
  - "返回 null"
answer: A
explain: "fetch 只有在网络失败时 reject。HTTP 404/500 仍然 resolve，必须检查 response.ok 或 status。"
:::

:::quiz
question: "React 列表中 key 的最佳选择是？"
options:
  - "稳定且唯一的业务 ID"
  - "数组索引（任何情况）"
  - "随机数"
  - "不需要 key"
answer: A
explain: "key 帮助 React 识别列表项身份。会增删排序的列表不要用索引作为 key，否则状态可能错位。"
:::

:::quiz
question: "移动优先的 CSS 通常使用哪种媒体查询？"
options:
  - "min-width"
  - "max-width"
  - "print"
  - "prefers-reduced-motion"
answer: A
explain: "移动优先先写窄屏基础样式，再用 min-width 逐步增强大屏布局。"
:::

## 页面任务

### 任务 1：课程目录页

使用语义 HTML 与 CSS Grid 完成：

- 顶部导航、搜索框、分类筛选；
- 课程卡片网格，移动端单列、桌面三列；
- 每张卡片有标题、简介、标签和“开始学习”按钮；
- 代码块与长标题不会撑破布局。

### 任务 2：待办应用

用原生 JavaScript 实现：

- 添加、完成、删除待办；
- 过滤“全部/未完成/已完成”；
- localStorage 持久化；
- 空状态与错误提示；
- 所有操作可键盘完成。

### 任务 3：React 课程搜索

用 Vite + React + TypeScript 实现：

- 从本地 JSON 加载课程；
- 按关键词和分类筛选；
- 加载中、空结果、错误三种状态；
- 自定义 Hook 封装请求；
- 用 `AbortController` 取消过期请求。

## 验收清单

- 手机 375px 宽度无横向滚动。
- Tab 键顺序合理，焦点可见。
- 图片有 alt，表单有 label。
- 控制台无报错。
- `npm run build` 成功，产物可静态部署。

## 返回

- [前端教程首页](/frontend/index.html)
- [综合测验](/exercises.html)
