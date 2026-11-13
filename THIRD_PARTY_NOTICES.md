# 第三方素材与开源依赖说明

StarLearn 的原创文字与站点代码采用仓库根目录的 `LICENSE` / `LICENSE-CONTENT`。
本文件列出构建和运行过程中使用的第三方素材、图标与依赖。所有图标均存放在仓库
`static/img/icons/`，站点运行时不请求第三方 CDN。

## 图标

### Simple Icons

- 文件：`static/img/icons/si-*.svg`（83 个）
- 项目：https://simpleicons.org/
- 许可：**CC0 1.0 Universal**（公共领域贡献）
- 说明：图标用于识别对应技术、语言、框架或产品。Simple Icons 中的名称和标识可能是
  各自权利人的商标；CC0 仅适用于图标文件本身，不授予商标使用权，也不表示任何背书或关联。

### Lucide

- 文件：`static/img/icons/lu-*.svg`（51 个）
- 项目：https://lucide.dev/
- 许可：**ISC License**
- 版权：Copyright (c) Lucide Contributors
- 说明：用于搜索、终端、服务器、图表等通用界面语义。部分文件在下载时保留了
  `@license lucide-static` 注释。

### 站点图标

- 源文件：`1790907212681.jpg`（由项目开发者提供）
- 构建衍生文件：`static/img/brand/starlearn-192.png`、`starlearn-512.png`、
  `starlearn-180.png`、`favicon-32.png`、`favicon.ico`
- 用途：站点标志、favicon、PWA manifest 和社交分享图标
- 权利：开发者提供的项目标志；不在 CC0/ISC 素材范围内

## 构建与运行时依赖

| 依赖 | 版本 | 许可 | 用途 |
| --- | --- | --- | --- |
| [marked](https://github.com/markedjs/marked) | 15.x | MIT | Markdown 渲染 |
| [marked-highlight](https://github.com/markedjs/marked-highlight) | 2.x | MIT | Markdown 代码高亮扩展 |
| [highlight.js](https://highlightjs.org/) | 11.x | BSD-3-Clause | 代码语法高亮 |
| [js-yaml](https://github.com/nodeca/js-yaml) | 4.x | MIT | 读取 YAML 配置与课程目录 |

这些依赖只在构建阶段使用；`dist/` 中不包含它们的完整源码包。若重新分发依赖代码，
请保留其各自的版权与许可声明。

## 字体与运行时请求

- 字体使用操作系统本地字体栈（`system-ui`、`-apple-system`、`Segoe UI`、
  `Noto Sans SC` 等），不加载第三方 Web Font。
- 页面不包含第三方统计、广告、追踪像素或远程图标请求。
- 外部链接仅在你主动点击“详细文档”时访问对应网站。

## 外部链接

课程目录中的官方文档链接指向各技术项目的官方网站。链接内容、商标和隐私实践由对应
站点负责，StarLearn 不控制也不代表这些站点。若发现链接失效或内容不适宜，请通过
wB251046886@163.com 反馈。

## 使用建议

如果你再次分发本站：

1. 保留 `LICENSE`、`LICENSE-CONTENT` 和本文件。
2. 保留图标文件中的许可注释，或在本文件中保留对应署名。
3. 不要移除原创教程的署名与许可链接。
4. 不要使用本站名称、标志或作者信息暗示第三方项目对本站的认可。
