---
title: TypeScript 类型系统
description: 基础类型、接口、泛型、联合类型、类型收窄、工具类型与 tsconfig，让 JavaScript 项目更可靠。
category: frontend
order: 4
tags: [TypeScript, 类型, 泛型, 工程化]
updated: 2026-11-12
---

# TypeScript 类型系统

TypeScript 是 JavaScript 的超集，增加静态类型检查。类型在编译后被擦除，运行时仍是 JavaScript，但开发阶段能提前发现大量错误。

## 安装与运行

```bash
npm create vite@latest my-app -- --template vanilla-ts
cd my-app
npm install
npm run dev
```

或手动安装：

```bash
npm install -D typescript
npx tsc --init
npx tsc
```

`tsconfig.json` 关键选项：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "skipLibCheck": true
  }
}
```

新项目建议开启 `strict`，不要一开始就关闭严格检查。

## 基础类型

```typescript
let name: string = "StarLearn";
let count: number = 3;
let active: boolean = true;
let tags: string[] = ["ts", "frontend"];
let tuple: [number, string] = [1, "one"];
let anything: unknown = JSON.parse("{}");

function greet(name: string): string {
  return `你好，${name}`;
}
```

优先使用 `unknown` 而不是 `any`。`unknown` 需要先收窄类型才能使用，`any` 会关闭检查。

## 接口与类型别名

```typescript
interface Course {
  id: number;
  title: string;
  minutes: number;
  tags?: string[];
  readonly createdAt: string;
}

type CourseLevel = "beginner" | "intermediate" | "advanced";

const course: Course = {
  id: 1,
  title: "TypeScript",
  minutes: 180,
  createdAt: "2026-11-12",
};
```

接口适合描述对象结构，类型别名适合联合类型、函数类型和组合类型。两者在很多场景可以互换。

## 联合类型与收窄

```typescript
function format(value: string | number): string {
  if (typeof value === "number") {
    return value.toFixed(2);
  }
  return value.trim();
}

type Result =
  | { ok: true; data: Course }
  | { ok: false; error: string };

function handle(result: Result) {
  if (result.ok) {
    console.log(result.data.title);
  } else {
    console.error(result.error);
  }
}
```

TypeScript 会根据 `typeof`、`in`、字面量和自定义类型守卫自动收窄类型。

## 泛型

```typescript
function first<T>(items: T[]): T | undefined {
  return items[0];
}

function groupBy<T, K extends string | number>(
  items: T[],
  keyOf: (item: T) => K,
): Record<K, T[]> {
  const result = {} as Record<K, T[]>;
  for (const item of items) {
    const key = keyOf(item);
    (result[key] ??= []).push(item);
  }
  return result;
}
```

泛型让函数在保持类型信息的同时复用逻辑。不要为了泛型而泛型；能明确类型时直接写类型。

## 工具类型

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

type UserPreview = Pick<User, "id" | "name">;
type UserUpdate = Partial<Omit<User, "id">>;
type UserMap = Record<string, User>;
```

常用工具类型：`Partial`、`Required`、`Pick`、`Omit`、`Record`、`Readonly`、`ReturnType`。

## 类型守卫

```typescript
function isCourse(value: unknown): value is Course {
  return (
    typeof value === "object" &&
    value !== null &&
    "title" in value &&
    typeof (value as Course).title === "string"
  );
}

const data: unknown = JSON.parse(raw);
if (isCourse(data)) {
  console.log(data.title);
}
```

来自 API 的数据运行时不可信。类型断言不会验证数据，必要时使用 Zod 等库做运行时校验。

## 函数与异步

```typescript
async function loadCourses(signal?: AbortSignal): Promise<Course[]> {
  const response = await fetch("/api/courses", { signal });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json() as Promise<Course[]>;
}
```

`response.json()` 返回 `Promise<any>`，需要自己保证结构与类型一致。

## 与 React 配合

```tsx
interface CourseCardProps {
  course: Course;
  onSelect?: (course: Course) => void;
}

export function CourseCard({ course, onSelect }: CourseCardProps) {
  return (
    <button type="button" onClick={() => onSelect?.(course)}>
      {course.title}
    </button>
  );
}
```

组件 props、事件回调、API 响应都应定义类型。不要用 `any` 绕过报错，先修复数据边界。

## 常见配置与错误

- **类型错误但运行正常**：类型是开发期约束，不代表运行时一定安全。
- **`Object is possibly undefined`**：开启 `noUncheckedIndexedAccess` 后数组访问需要检查。
- **第三方库没有类型**：优先找 `@types` 包；没有时写最小声明文件，而不是全局 `any`。
- **构建产物报错**：`tsc` 只做类型检查，实际打包由 Vite/Webpack 完成。

:::tip 迁移策略
已有 JavaScript 项目可以逐步迁移：先开启 `allowJs` 与 `checkJs`，从工具函数和 API 边界开始加类型，再迁移组件。不要一次性重写全部代码。
:::

## 小练习

1. 为课程对象定义接口，并写一个按分类分组的泛型函数。
2. 用联合类型表示 API 的成功与失败结果。
3. 为 fetch 请求添加 AbortSignal 与运行时校验。

## 下一步

- [React 组件开发](/frontend/react.html)
- [前端练习课](/frontend/practice.html)
