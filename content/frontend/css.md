---
title: CSS 布局与设计系统
description: 选择器、盒模型、Flex、Grid、CSS 变量与响应式，用现代 CSS 构建稳定界面。
category: frontend
order: 2
tags: [CSS, Flex, Grid, 响应式]
updated: 2026-11-12
---

# CSS 布局与设计系统

CSS 的核心不是“背属性”，而是理解布局模型：元素如何占据空间、如何对齐、如何在屏幕变化时调整。

![CSS 插画（开源图标：Simple Icons CC0 / Lucide ISC）](/static/img/icons/si-css.svg)

## 选择器

```css
/* 类型 */
h1 { color: #0f172a; }

/* 类 */
.card { border-radius: 12px; }

/* ID 少用，优先级高且难复用 */
#main { padding: 24px; }

/* 属性 */
a[target="_blank"] { text-decoration: underline; }

/* 伪类 */
button:hover { background: #166534; }
li:nth-child(2n) { background: #f8fafc; }

/* 组合 */
.card > .title { font-weight: 700; }
```

优先使用类选择器，避免层层嵌套和 `!important`。选择器应表达组件边界，而不是页面位置。

## 盒模型

```css
*, *::before, *::after {
  box-sizing: border-box;
}

.card {
  width: 320px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  margin: 16px;
}
```

`border-box` 让 `width` 包含 padding 与 border，布局计算更符合直觉。几乎所有项目都会全局设置。

## 自定义属性

```css
:root {
  --bg: #f6f8fa;
  --surface: #ffffff;
  --text: #0f172a;
  --muted: #64748b;
  --brand: #15803d;
  --radius: 12px;
}

.card {
  background: var(--surface);
  color: var(--text);
  border-radius: var(--radius);
}
```

变量让主题、间距和颜色集中管理。深色模式只需覆盖变量：

```css
html[data-theme="dark"] {
  --bg: #08111c;
  --surface: #101d2e;
  --text: #e8eef6;
  --muted: #8fa1b7;
}
```

## Flexbox

一维布局首选。适合导航、工具栏、卡片内部对齐。

```css
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.nav-links {
  display: flex;
  gap: 8px;
}

.card-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.card-row > .card {
  flex: 1 1 260px;
}
```

- `justify-content` 主轴对齐。
- `align-items` 交叉轴对齐。
- `gap` 比 margin 更清晰。
- `flex: 1 1 260px` 让卡片自动伸缩并换行。

## Grid

二维布局首选。适合页面骨架、卡片网格和表单。

```css
.page {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 24px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.hero {
  display: grid;
  grid-template-columns: 1.1fr .9fr;
  align-items: center;
  gap: 40px;
}
```

`minmax(0, 1fr)` 能防止长内容把网格撑破。`auto-fit` + `minmax` 可以少写很多断点。

## 响应式

```css
@media (max-width: 900px) {
  .page {
    grid-template-columns: 1fr;
  }

  .hero {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}
```

建议移动优先：

```css
.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

@media (min-width: 700px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1100px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## 文字与可读性

```css
body {
  font-size: 16px;
  line-height: 1.7;
  color: var(--text);
  background: var(--bg);
}

.article p {
  max-width: 72ch;
  margin: 0 0 1em;
}

h1 {
  font-size: clamp(2rem, 4vw, 3.5rem);
  line-height: 1.1;
  letter-spacing: -0.04em;
}
```

中文正文行高建议 1.7–1.9，行长不超过 75 个字符。`clamp()` 可以让标题随视口平滑变化。

## 代码块与表格

```css
pre {
  overflow-x: auto;
  padding: 20px;
  border-radius: 12px;
  background: #0b1220;
  color: #e2e8f0;
}

table {
  width: 100%;
  border-collapse: collapse;
}

.table-wrap {
  overflow-x: auto;
}
```

不要让代码块撑破移动端布局，外层容器必须有 `min-width: 0` 或 `overflow-x: auto`。

## 过渡与动效

```css
.btn {
  transition: background-color .18s ease, transform .18s ease;
}

.btn:hover {
  background: #166534;
  transform: translateY(-1px);
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: .01ms !important;
    transition-duration: .01ms !important;
  }
}
```

动效用于反馈，不用于拖延。尊重用户的“减少动态效果”设置。

:::tip 调布局的方法
先给容器临时加背景色，确认它实际占了多少空间；再检查 `min-width`、`flex-shrink`、`overflow`。大部分“布局坏了”都是容器约束问题。
:::

## 小练习

1. 用 Grid 实现一个三栏文章页，窄屏变单栏。
2. 用 Flex 做导航栏，右侧按钮在移动端换行。
3. 用 CSS 变量实现浅色/深色主题切换。

## 下一步

- [JavaScript 交互与异步](/frontend/javascript.html)
- [响应式设计](/frontend/responsive.html)
