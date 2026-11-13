---
title: Markdown 写作速查
description: 标题、强调、列表、链接、图片、代码块、表格、引用、任务列表、脚注与转义，写出干净的技术文档。
category: reference
order: 4
tags: [Markdown, 文档, 写作, 速查]
updated: 2026-11-12
---

# Markdown 写作速查

Markdown 用纯文本表达结构，适合 README、技术文档、博客与笔记。本站所有文章也以 Markdown 源文件维护。

![Markdown 插画（开源图标：Simple Icons CC0 / Lucide ISC）](/static/img/icons/si-markdown.svg)

## 标题

```markdown
# 一级标题
## 二级标题
### 三级标题
```

一篇文章通常只有一个一级标题，标题层级不要跳级。标题上下留空行，兼容性更好。

## 段落与换行

```markdown
这是第一段。

这是第二段。
行尾两个空格可以强制换行。  
这是新的一行。
```

多数解析器把单个换行视为空格。段落之间用空行分隔。

## 强调

```markdown
**粗体**
*斜体*
***粗斜体***
~~删除线~~
`行内代码`
```

下划线 `_` 与星号 `*` 都可用，但中文混排时星号更稳妥。

## 列表

无序列表：

```markdown
- 第一项
- 第二项
  - 嵌套项
  - 另一个嵌套项
```

有序列表：

```markdown
1. 安装依赖
2. 运行构建
3. 部署上线
```

任务列表：

```markdown
- [x] 完成正文
- [x] 添加练习
- [ ] 校对链接
```

列表项包含多段时，后续段落缩进两个或四个空格。

## 链接与图片

```markdown
[StarLearn](https://example.com)
[站内文章](/java/intro.html)
![图片说明](/static/img/icons/si-openjdk.svg)
```

带标题：

```markdown
[链接](https://example.com "标题")
```

图片建议写清 alt，方便可访问性与图片加载失败时理解内容。

## 引用

```markdown
> 这是一段引用。
>
> 可以包含多个段落。
```

GitHub 风格提示：

```markdown
> [!TIP]
> 这是一个提示。
```

本站构建器支持 `> [!TIP]`、`> [!WARNING]` 等 GitHub Alerts，也支持自定义 `:::` 提示块。

## 代码

行内代码：

```markdown
使用 `npm run build` 构建。
```

围栏代码块：

````markdown
```javascript
const name = "StarLearn";
console.log(`你好，${name}`);
```
````

指定语言可启用语法高亮。代码块内若需要显示三重反引号，外层用四重反引号。

## 表格

```markdown
| 命令 | 作用 |
|---|---|
| `ls` | 列出文件 |
| `cd` | 切换目录 |
| `pwd` | 当前路径 |
```

表格对齐：

```markdown
| 左对齐 | 居中 | 右对齐 |
|:---|:---:|---:|
| A | B | C |
```

表格列多时，移动端可能横向滚动。复杂内容优先用列表。

## 分隔线

```markdown
---
```

分隔线上下留空行，避免与 YAML front matter 混淆。

## 脚注

```markdown
这是一个带脚注的句子[^1]。

[^1]: 脚注内容写在这里。
```

不同平台对脚注支持不同，发布前确认渲染效果。

## HTML

Markdown 通常允许内嵌 HTML：

```html
<details>
  <summary>展开查看答案</summary>
  <p>答案内容。</p>
</details>
```

但过度使用 HTML 会降低可移植性。优先用原生 Markdown。

## 转义特殊字符

```markdown
\*不是斜体\*
\# 不是标题
\[不是链接\]
```

代码中的反引号、竖线和反斜杠要特别注意。

## Front Matter

本站文章使用 YAML front matter：

```yaml
---
title: Java 基础语法
description: 类型、变量、条件、循环与数组。
category: java
order: 2
tags: [Java, 语法]
updated: 2026-11-12
---
```

字段用于生成页面标题、SEO、排序、标签与下载文件。修改后需要重新构建。

## 写作建议

- 一段只讲一个意思，避免超长段落。
- 代码示例要能运行，并说明环境。
- 命令与文件名用行内代码。
- 截图配文字说明，不依赖图片传达关键信息。
- 链接使用描述性文字，不要写“点击这里”。
- 标题层级清晰，方便生成目录。
- 中文与英文、数字之间可适当加空格，提升可读性。

:::tip 检查渲染
Markdown 在不同解析器下行为有差异。发布前在目标平台预览，重点检查表格、代码块、脚注、HTML 与链接。
:::

## 小练习

1. 写一篇包含表格、代码块、任务列表与脚注的文档。
2. 把一段 HTML 内容改写成语义化 Markdown。
3. 检查站内链接与图片路径是否在子路径部署下仍可用。

## 下一步

- [HTML 语义化](/frontend/html.html)
- [Git 速查](/reference/git.html)
