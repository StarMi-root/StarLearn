---
title: 前端学习地图：基础、框架与可视化
description: 从 HTML/CSS/JavaScript 到 TypeScript、React/Vue、Next.js、CSS 框架与 ECharts 数据可视化。
category: frontend
order: 8
tags: [前端, React, Vue, 数据可视化]
updated: 2026-11-12
---

# 前端学习地图：基础、框架与可视化

前端的第一道分水岭不是框架，而是浏览器：DOM 如何工作、CSS 如何布局、JavaScript 如何异步、网络请求如何发出。基础扎实后，框架只是组织代码的方式。先做一个响应式页面，再进入组件化与工程化。

![前端开发图标（Simple Icons CC0 / Lucide ISC）](/static/img/icons/si-html5.svg)

:::tip 先选一条主线
不要同时开五门课。先按下面的顺序完成一个最小项目，再把目录里的其他主题当作按需查阅的工具书。
:::

## 推荐学习顺序

1. **HTML、CSS 与 JavaScript**：能徒手写出语义化、响应式页面，理解事件循环、作用域和异步。
2. **TypeScript 与 HTML DOM**：给代码加类型，能直接操作 DOM、处理表单和浏览器事件。
3. **AJAX 与 JSON**：理解请求响应、状态码、跨域和错误处理，能对接真实 API。
4. **React、Vue3 或 Angular**：选一个框架掌握组件、状态、路由和构建流程；Next.js 用于 React 全栈场景。
5. **CSS 框架与组件库**：用 Tailwind、Bootstrap 或 Foundation 提升交付速度，但保留自定义能力。
6. **ECharts、Chart.js、SVG**：把数据变成可读的图表和图形，兼顾性能与无障碍。

## 全部主题

下表覆盖本方向在 StarLearn 课程目录中的全部主题。标记为“本站精讲”的可以直接进入中文教程；标记为“详细文档”的会打开对应技术的官方文档，适合补充语法细节和查阅示例。

| 主题 | 学什么 | 入口 |
| --- | --- | --- |
| HTML | 语义化标签、文档结构、表单与可访问性基础。 | [本站精讲](../frontend/html.html) |
| HTML5 | 语义标签、音视频、Canvas、本地存储与现代浏览器能力。 | [详细文档 ↗](https://developer.mozilla.org/en-US/docs/Web/HTML) |
| CSS | 选择器、盒模型、层叠、布局与响应式设计基础。 | [本站精讲](../frontend/css.html) |
| CSS3 | 圆角、阴影、渐变、动画、媒体查询与现代布局。 | [详细文档 ↗](https://developer.mozilla.org/en-US/docs/Web/CSS) |
| JavaScript | 变量、函数、对象、异步、DOM 操作与浏览器 API。 | [本站精讲](../frontend/javascript.html) |
| HTML DOM | 用 JavaScript 查找、修改、创建和删除网页元素。 | [详细文档 ↗](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) |
| TypeScript | 类型系统、接口、泛型与大型前端项目的工程化基础。 | [本站精讲](../frontend/typescript.html) |
| AJAX | 异步请求、局部刷新与前后端数据交互。 | [详细文档 ↗](https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX) |
| JSON | 轻量数据交换格式、语法、解析与 API 数据传输。 | [详细文档 ↗](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/JSON) |
| Tailwind CSS | 原子化 CSS 框架，用工具类快速构建一致界面。 | [详细文档 ↗](https://tailwindcss.com/docs/installation/using-vite) |
| Bootstrap 4 | 经典响应式组件库、栅格系统与常用 UI 组件。 | [详细文档 ↗](https://getbootstrap.com/docs/4.6/getting-started/introduction/) |
| Bootstrap 5 | 不依赖 jQuery 的现代 Bootstrap，响应式布局与组件。 | [详细文档 ↗](https://getbootstrap.com/docs/5.3/getting-started/introduction/) |
| Foundation | 面向响应式网站的前端框架与可访问组件。 | [详细文档 ↗](https://get.foundation/sites/docs/) |
| Vue.js | 渐进式 JavaScript 框架，组件、指令与响应式数据。 | [详细文档 ↗](https://v2.vuejs.org/v2/guide/) |
| Vue3 | 组合式 API、响应式系统与现代 Vue 工程实践。 | [详细文档 ↗](https://vuejs.org/guide/introduction.html) |
| React | 组件、Props、State、Hooks 与单页应用开发。 | [本站精讲](../frontend/react.html) |
| Next.js | 基于 React 的全栈框架，路由、渲染与部署一体化。 | [详细文档 ↗](https://nextjs.org/learn) |
| AngularJS | 经典 Angular 1.x 框架，双向绑定与依赖注入。 | [详细文档 ↗](https://docs.angularjs.org/tutorial) |
| Angular | 基于 TypeScript 的现代 Angular 框架与组件体系。 | [详细文档 ↗](https://angular.dev/tutorials) |
| jQuery | 用简洁 API 操作 DOM、处理事件与发送请求。 | [详细文档 ↗](https://learn.jquery.com/) |
| jQuery UI | 基于 jQuery 的交互组件、拖拽、日期选择与主题。 | [详细文档 ↗](https://jqueryui.com/) |
| jQuery EasyUI | 快速搭建后台管理界面的 jQuery 组件库。 | [详细文档 ↗](https://www.jeasyui.com/documentation/) |
| ECharts | 百度开源的数据可视化图表库，交互与主题丰富。 | [详细文档 ↗](https://echarts.apache.org/handbook/en/get-started/) |
| Chart.js | 轻量 HTML5 图表库，快速绘制常见统计图。 | [详细文档 ↗](https://www.chartjs.org/docs/latest/) |
| Highcharts | 功能完整的商业图表库，适合仪表盘与数据报告。 | [详细文档 ↗](https://www.highcharts.com/docs/index) |
| Google 地图 API | 在网页中嵌入地图、标记、路线与位置服务。 | [详细文档 ↗](https://developers.google.com/maps/documentation/javascript/tutorials) |
| SVG | 可缩放矢量图形、路径、动画与图标系统。 | [详细文档 ↗](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial) |
| Font Awesome | 常用图标字体与图标组件，快速提升界面表达。 | [详细文档 ↗](https://docs.fontawesome.com/) |

## 学完后的检查点

- 能独立完成一个移动端适配的页面。
- 能从接口取数并处理加载、空数据和错误状态。
- 能解释组件状态与 URL、缓存、服务端数据之间的关系。

:::note 学习建议
每学完一个主题，至少留下三样东西：一段可运行的代码、一条自己的解释、一个能复现的踩坑记录。把它们放进笔记或项目仓库，比“看过”更能证明掌握。
:::

