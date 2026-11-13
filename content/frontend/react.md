---
title: React 组件开发
description: 用 Vite + React 构建组件、状态、Hooks、表单与数据请求，理解单向数据流和组件拆分。
category: frontend
order: 5
tags: [React, Hooks, 组件, Vite]
updated: 2026-11-12
---

# React 组件开发

React 用组件描述界面，用状态驱动更新。它的核心思想是：**UI = f(state)**。状态变化后，React 重新计算组件树并更新必要的 DOM。

![React 插画（开源图标：Simple Icons CC0 / Lucide ISC）](/static/img/icons/si-react.svg)

## 创建项目

```bash
npm create vite@latest starlearn-react -- --template react-ts
cd starlearn-react
npm install
npm run dev
```

项目结构：

```text
src/
├── App.tsx
├── main.tsx
├── components/
│   └── CourseCard.tsx
├── hooks/
│   └── useCourses.ts
└── types.ts
```

## 第一个组件

```tsx
interface CourseCardProps {
  title: string;
  minutes: number;
  onSelect: () => void;
}

export function CourseCard({ title, minutes, onSelect }: CourseCardProps) {
  return (
    <article className="course-card">
      <h3>{title}</h3>
      <p>{minutes} 分钟</p>
      <button type="button" onClick={onSelect}>开始学习</button>
    </article>
  );
}
```

组件名用 PascalCase，props 只读。不要直接修改 props。

## 状态

```tsx
import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>计数：{count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount((value) => value - 1)}>-1</button>
    </div>
  );
}
```

基于旧值更新时使用函数式写法，避免闭包拿到过期状态。

## 列表与 key

```tsx
function CourseList({ courses }: { courses: Course[] }) {
  return (
    <ul>
      {courses.map((course) => (
        <li key={course.id}>
          <CourseCard {...course} onSelect={() => console.log(course.id)} />
        </li>
      ))}
    </ul>
  );
}
```

`key` 必须在兄弟节点中稳定唯一。不要用数组索引作为会增删排序列表的 key。

## 副作用与数据请求

```tsx
import { useEffect, useState } from "react";

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        const response = await fetch("/api/courses", {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        setCourses(await response.json());
        setError(null);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "加载失败");
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  return { courses, loading, error };
}
```

`useEffect` 的清理函数用于取消请求、移除监听器、清除定时器。开发模式下 StrictMode 会执行两次 effect，这是为了暴露清理问题。

## 表单

```tsx
function SearchBox({ onSearch }: { onSearch: (value: string) => void }) {
  const [value, setValue] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSearch(value.trim());
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="search">搜索课程</label>
      <input
        id="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="例如 llama.cpp"
      />
      <button type="submit">搜索</button>
    </form>
  );
}
```

受控组件让状态可预测。表单提交要阻止默认刷新。

## 组件拆分

- 页面组件负责数据加载与布局。
- 展示组件只接收 props，便于复用和测试。
- 自定义 Hook 负责复用状态逻辑。
- 不要把所有状态都塞进一个顶层组件。

```tsx
function App() {
  const { courses, loading, error } = useCourses();

  if (loading) return <p>加载中…</p>;
  if (error) return <p role="alert">加载失败：{error}</p>;

  return (
    <main>
      <h1>课程列表</h1>
      <CourseList courses={courses} />
    </main>
  );
}
```

## 常见错误

- **直接修改状态**：`courses.push(item)` 不会触发更新，应创建新数组。
- **缺少 key**：列表更新错位、输入框状态串行。
- **effect 依赖不完整**：导致读取旧值或重复请求。
- **在渲染中发请求**：渲染函数必须纯粹，副作用放在 effect 或事件中。
- **过度使用 Context**：全局状态不是默认选择，先看是否只需提升到共同父级。

## 构建与部署

```bash
npm run build
npm run preview
```

`dist/` 是静态产物，可部署到 GitHub Pages、Nginx 或任意静态托管。SPA 路由需要服务器回退到 `index.html`。

:::tip 性能原则
先保证正确，再测量。React 大多数性能问题来自不必要的重渲染和过大的 bundle。用 React DevTools Profiler 找热点，不要盲目 `memo`。
:::

## 小练习

1. 做一个课程搜索与分类筛选页面。
2. 用自定义 Hook 封装 fetch 的加载、错误与取消逻辑。
3. 增加“收藏课程”功能，并用 localStorage 持久化。

## 下一步

- [响应式设计](/frontend/responsive.html)
- [前端练习课](/frontend/practice.html)
