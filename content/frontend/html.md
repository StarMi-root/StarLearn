---
title: HTML 语义化与页面结构
description: 从文档骨架、语义标签、表单、图片到可访问性，写出现代浏览器和搜索引擎都理解的 HTML。
category: frontend
order: 1
tags: [HTML, 语义化, 表单, 可访问性]
updated: 2026-11-12
---

# HTML 语义化与页面结构

HTML 负责内容和结构，CSS 负责表现，JavaScript 负责行为。把三者混在一起，页面会很快失控。语义化 HTML 还能提升可访问性、SEO 和可维护性。

![HTML 图像占位示意（开源图标：Simple Icons CC0 / Lucide ISC）](/static/img/icons/lu-image.svg)

## 文档骨架

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>StarLearn · 前端教程</title>
  <meta name="description" content="HTML、CSS、JavaScript 与 React 实战教程。">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</body>
</html>
```

- `lang` 帮助屏幕阅读器与搜索引擎。
- `viewport` 是响应式页面的前提。
- `title` 与 `description` 影响搜索结果的展示。

## 语义标签

| 标签 | 用途 |
|---|---|
| `<header>` | 页头或区块头部 |
| `<nav>` | 主要导航 |
| `<main>` | 页面唯一主要内容 |
| `<article>` | 可独立分发的内容 |
| `<section>` | 有主题的内容分组 |
| `<aside>` | 侧边栏、相关推荐 |
| `<footer>` | 页脚或区块尾部 |
| `<figure>` + `<figcaption>` | 图片与说明 |

```html
<header class="site-header">
  <a href="/" class="brand">StarLearn</a>
  <nav aria-label="主导航">
    <a href="/csharp/">C#</a>
    <a href="/python/">Python</a>
    <a href="/linux/">Linux</a>
  </nav>
</header>

<main>
  <article>
    <h1>C# 异步编程</h1>
    <p>理解 async 与 await 的执行流程。</p>
    <section aria-labelledby="example">
      <h2 id="example">代码示例</h2>
      <pre><code>await Task.Delay(1000);</code></pre>
    </section>
  </article>
</main>

<footer>© 2026 StarLearn</footer>
```

不要用一堆 `<div>` 代替语义标签，也不要因为“看起来一样”就滥用 `<section>`。语义标签首先表达结构含义。

## 标题层级

- 每页通常只有一个 `<h1>`。
- 标题按层级递进：`h1 → h2 → h3`，不要跳级。
- 不要为了字号选择标题，字号交给 CSS。
- 标题应描述内容，而不是“标题一”“更多”。

## 链接与按钮

```html
<a href="/python/intro.html">学习 Python</a>
<button type="button" id="copy">复制代码</button>
```

- 跳转到另一个地址用 `<a>`。
- 触发当前页面行为用 `<button>`。
- 不要用 `<div onclick>` 模拟按钮，键盘用户无法操作。

## 图片

```html
<img src="/static/img/icons/si-python.svg"
     alt="Python 教程插图"
     width="320" height="200"
     loading="lazy">
```

- `alt` 描述图片内容；纯装饰图片用 `alt=""`。
- 写宽高可以减少布局抖动。
- 首屏关键图片不要懒加载，避免 LCP 变差。
- 需要说明时使用 `<figure>`：

```html
<figure>
  <img src="diagram.png" alt="请求经过 Nginx 转发到后端服务">
  <figcaption>图 1：反向代理请求流程</figcaption>
</figure>
```

## 表单

```html
<form action="/subscribe" method="post">
  <label for="email">邮箱</label>
  <input id="email" name="email" type="email" required
         placeholder="you@example.com" autocomplete="email">

  <label for="level">学习阶段</label>
  <select id="level" name="level">
    <option value="beginner">入门</option>
    <option value="intermediate">进阶</option>
  </select>

  <label>
    <input type="checkbox" name="agree" required>
    我同意接收学习邮件
  </label>

  <button type="submit">订阅</button>
</form>
```

- 每个输入都要有可关联的 `<label>`。
- 使用正确的 `type`：`email`、`password`、`number`、`date`。
- 客户端校验只是体验，服务端必须再次校验。
- 错误提示要与字段关联，使用 `aria-describedby`。

## 可访问性基础

```html
<button aria-label="关闭对话框">×</button>
<div role="status" aria-live="polite">已保存</div>
```

- 保持可见焦点样式，不要全局 `outline: none`。
- 颜色对比度足够。
- 交互元素可键盘操作。
- 图片有替代文本，视频有字幕。
- 使用 `aria-*` 前先优先使用原生语义。

## 元数据与分享

```html
<meta property="og:title" content="C# 异步编程">
<meta property="og:description" content="理解 Task 与 async/await。">
<meta property="og:type" content="article">
<meta name="twitter:card" content="summary_large_image">
```

社交平台抓取通常依赖 Open Graph 标签。分享图建议 1200×630。

:::tip 检查方法
临时禁用 CSS 打开页面。如果内容仍然有清晰层级、链接可读、表单可用，说明 HTML 结构基本合格。
:::

## 小练习

1. 用语义标签搭建一个博客文章页。
2. 写一个带标签、校验和错误提示的注册表单。
3. 用键盘 Tab 走一遍页面，修复焦点不可见或顺序混乱的问题。

## 下一步

- [CSS 布局与设计系统](/frontend/css.html)
- [JavaScript 交互](/frontend/javascript.html)
