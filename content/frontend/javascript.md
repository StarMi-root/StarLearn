---
title: JavaScript 交互与异步
description: 变量、函数、数组方法、DOM、事件、fetch、Promise 与模块，写出真正可用的浏览器交互。
category: frontend
order: 3
tags: [JavaScript, DOM, 异步, fetch]
updated: 2026-11-12
---

# JavaScript 交互与异步

JavaScript 运行在浏览器中，负责页面交互、数据处理和网络请求。现代 JavaScript 已经具备模块、异步、类和丰富的数组方法。

![JavaScript 插画（开源图标：Simple Icons CC0 / Lucide ISC）](/static/img/icons/si-javascript.svg)

## 变量与类型

```javascript
const name = "StarLearn";
let count = 0;
count += 1;

const user = { name, level: "beginner" };
const tags = ["javascript", "frontend"];
const nothing = null;
```

优先使用 `const`，需要重新赋值时用 `let`。避免 `var`。JavaScript 是动态类型，但可以用 TypeScript 或 JSDoc 增加约束。

## 函数

```javascript
function greet(name) {
  return `你好，${name}！`;
}

const add = (a, b) => a + b;
const double = (n) => n * 2;

console.log(greet("StarLearn"));
console.log(add(1, 2));
console.log([1, 2, 3].map(double));
```

箭头函数没有自己的 `this`，适合回调和短函数。对象方法或需要动态 `this` 时使用普通函数。

## 数组方法

```javascript
const courses = [
  { title: "C#", minutes: 180, level: "beginner" },
  { title: "Python", minutes: 200, level: "beginner" },
  { title: "AI", minutes: 300, level: "advanced" },
];

const titles = courses.map((course) => course.title);
const long = courses.filter((course) => course.minutes >= 200);
const total = courses.reduce((sum, course) => sum + course.minutes, 0);
const hasAdvanced = courses.some((course) => course.level === "advanced");

console.log(titles, long, total, hasAdvanced);
```

这些方法不修改原数组。需要修改时用 `sort`、`splice` 等，并注意它们会改变原数组。

## DOM 操作

```html
<button id="load">加载课程</button>
<ul id="courseList"></ul>
<p id="status" role="status"></p>
```

```javascript
const button = document.querySelector("#load");
const list = document.querySelector("#courseList");
const status = document.querySelector("#status");

button.addEventListener("click", () => {
  status.textContent = "已点击";
  const item = document.createElement("li");
  item.textContent = "C# 入门";
  list.append(item);
});
```

不要用 `innerHTML` 拼接不可信数据，以免 XSS。需要插入 HTML 时先转义，或使用模板与可信内容。

## 事件

```javascript
document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  if (button.dataset.action === "delete") {
    button.closest(".item")?.remove();
  }
});
```

事件委托适合动态列表：把监听器挂在父容器上，通过 `closest` 找到触发元素。记得处理键盘事件与焦点。

## Promise 与 async/await

```javascript
async function loadCourses() {
  const response = await fetch("/api/courses");
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

async function main() {
  try {
    const courses = await loadCourses();
    console.log(courses);
  } catch (error) {
    console.error("加载失败", error);
  }
}

main();
```

`fetch` 只有在网络失败时 reject，HTTP 404/500 仍会 resolve。必须检查 `response.ok`。

## 并发请求

```javascript
const [profile, courses] = await Promise.all([
  fetch("/api/profile").then((r) => r.json()),
  fetch("/api/courses").then((r) => r.json()),
]);
```

`Promise.all` 在任一失败时整体失败；如果需要收集全部结果（包括失败），使用 `Promise.allSettled`。

## 本地存储

```javascript
localStorage.setItem("theme", "dark");
const theme = localStorage.getItem("theme") ?? "light";
localStorage.removeItem("theme");
```

存储值都是字符串。对象需要 `JSON.stringify` / `JSON.parse`，并处理解析失败：

```javascript
function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
```

不要在 localStorage 保存密码、Token 等敏感信息。

## 模块

```javascript
// math.js
export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// app.js
import { clamp } from "./math.js";
console.log(clamp(120, 0, 100));
```

浏览器中使用模块需要 `<script type="module" src="app.js"></script>`。模块天然严格模式，并且有独立作用域。

## 错误处理

```javascript
try {
  const data = JSON.parse('{"broken":');
} catch (error) {
  console.error("JSON 解析失败", error);
}
```

不要吞掉错误。用户界面应显示可理解的提示，控制台保留技术细节。

:::warn 安全基础
不要信任任何来自 URL、表单、localStorage 或 API 的内容。插入 DOM 前转义；不要把用户输入直接拼进 `innerHTML`、SQL 或命令。
:::

## 小练习

1. 做一个待办列表，支持添加、完成、删除，并用 localStorage 保存。
2. 请求一个公开 API，展示加载中、成功和失败三种状态。
3. 用事件委托实现列表删除，避免给每个按钮单独绑定事件。

## 下一步

- [TypeScript 类型系统](/frontend/typescript.html)
- [React 组件开发](/frontend/react.html)
