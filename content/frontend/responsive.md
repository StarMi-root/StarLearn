---
title: 响应式设计与可访问性
description: 移动优先、断点、流式布局、图片适配、触控目标与可访问性检查，让页面在每块屏幕上都能用。
category: frontend
order: 6
tags: [响应式, 移动优先, 可访问性, CSS]
updated: 2026-11-12
---

# 响应式设计与可访问性

响应式不是“加几个媒体查询”，而是让内容在不同屏幕、输入方式和网络条件下都保持可用。可访问性是其中不可分割的一部分。

## 从移动端开始

先写窄屏布局，再逐步增强：

```css
.page {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 720px) {
  .page {
    grid-template-columns: 220px minmax(0, 1fr);
  }
}

@media (min-width: 1120px) {
  .page {
    grid-template-columns: 240px minmax(0, 1fr) 220px;
  }
}
```

移动优先能逼迫你优先保留核心内容，而不是把桌面布局硬塞进手机。

## 断点选择

断点应来自内容需要，而不是某款设备：

- 约 560px：单列转双列。
- 约 820px：隐藏侧边栏，显示移动菜单。
- 约 1100px：三栏文章布局。

```css
@media (max-width: 820px) {
  .sidebar { display: none; }
  .mobile-menu-btn { display: inline-flex; }
}
```

使用 `min-width` 还是 `max-width` 要统一。混用容易产生覆盖顺序问题。

## 流式布局

```css
.container {
  width: min(1200px, calc(100% - 32px));
  margin-inline: auto;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}
```

`minmax(0, 1fr)` 防止长单词或代码块撑破网格。`clamp()` 控制字号：

```css
h1 {
  font-size: clamp(2rem, 5vw, 4rem);
}
```

## 图片与媒体

```css
img, video {
  max-width: 100%;
  height: auto;
}

.cover {
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
```

```html
<img
  src="cover-800.jpg"
  srcset="cover-400.jpg 400w, cover-800.jpg 800w, cover-1600.jpg 1600w"
  sizes="(max-width: 700px) 100vw, 800px"
  alt="课程封面"
  loading="lazy"
  width="800" height="450">
```

提供合适尺寸的图片，避免手机下载桌面大图。首屏主图可设置 `fetchpriority="high"`。

## 触控与交互

- 可点击区域至少 44×44px。
- 悬停效果不能是唯一的信息来源。
- 移动端避免依赖 hover 的下拉菜单。
- 表单输入使用合适的 `type` 与 `autocomplete`。
- 固定底栏要留出安全区域：`padding-bottom: env(safe-area-inset-bottom)`。

```css
.btn {
  min-height: 44px;
  padding: 0 18px;
  touch-action: manipulation;
}
```

## 可访问性检查

1. 只用键盘能否完成主要操作？
2. 焦点是否可见？
3. 图片是否有合适的 alt？
4. 表单是否有 label 和错误提示？
5. 颜色对比度是否足够？
6. 页面缩放 200% 是否仍可用？
7. 动态内容是否通过 `aria-live` 通知？

```html
<button aria-expanded="false" aria-controls="menu">菜单</button>
<nav id="menu" hidden>...</nav>
<div role="status" aria-live="polite">已保存</div>
```

优先使用原生元素。`<button>` 自带键盘与焦点行为，比 `<div role="button" tabindex="0">` 更可靠。

## 深色模式

```css
:root {
  color-scheme: light dark;
  --bg: #f6f8fa;
  --text: #0f172a;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #08111c;
    --text: #e8eef6;
  }
}

html[data-theme="dark"] {
  color-scheme: dark;
}
```

提供手动切换时，尊重系统偏好作为默认值，并保存用户选择。深色模式不是简单反色，要重新检查对比度与图片可读性。

## 移动导航

- 抽屉菜单要有遮罩、关闭按钮和 Esc 支持。
- 打开时锁定背景滚动。
- 关闭后焦点回到触发按钮。
- 菜单项点击后自动关闭。
- 不要嵌套过多层级。

## 性能与响应式

- 避免在滚动事件中做重计算，使用 `requestAnimationFrame` 节流。
- 图片懒加载，但不要懒加载首屏 LCP 图片。
- 字体加载使用 `font-display: swap`。
- 复杂动画在移动端可能掉帧，提供降级。

:::warn 测试提醒
只在桌面浏览器缩放窗口是不够的。用真实手机或 DevTools 设备模拟检查触控、输入法、横向滚动和固定定位。再跑一次键盘导航与屏幕阅读器抽查。
:::

## 小练习

1. 把一个三栏文章页改为移动端单栏 + 抽屉导航。
2. 为图片添加 `srcset` 与 `sizes`。
3. 用键盘完整走一遍页面，修复焦点顺序和可见性。

## 下一步

- [前端练习课](/frontend/practice.html)
- [JavaScript 交互](/frontend/javascript.html)
