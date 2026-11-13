---
title: XML 与 Web Service 学习地图
description: XML、DTD、XML Schema、XPath、XSLT、XQuery、XLink、XPointer、XSL-FO、SOAP、WSDL、RSS 与 RDF。
category: xml
order: 1
tags: [XML, XPath, SOAP, WSDL]
updated: 2026-11-12
---

# XML 与 Web Service 学习地图

XML 看起来“老旧”，但企业接口、Office 文档、配置文件、RSS 和 SOAP 系统仍在大量使用。学习顺序应是“结构 → 校验 → 查询 → 转换 → 服务”，而不是只记住尖括号语法。

![XML / Web Service图标（Simple Icons CC0 / Lucide ISC）](/static/img/icons/si-xml.svg)

:::tip 先选一条主线
不要同时开五门课。先按下面的顺序完成一个最小项目，再把目录里的其他主题当作按需查阅的工具书。
:::

## 推荐学习顺序

1. **XML 基础与 DTD**：掌握元素、属性、命名空间、良构与有效性。
2. **XML Schema**：用 XSD 精确描述类型、顺序、基数和约束。
3. **XML DOM 与 XPath**：解析文档、定位节点，并理解命名空间对查询的影响。
4. **XSLT 与 XQuery**：把 XML 转换为 HTML、文本或其他结构，处理批量数据。
5. **Web Service、WSDL 与 SOAP**：读懂服务契约、消息信封和错误格式，能对接遗留系统。
6. **RSS 与 RDF**：理解内容聚合和三元组数据模型。

## 全部主题

下表覆盖本方向在 StarLearn 课程目录中的全部主题。标记为“本站精讲”的可以直接进入中文教程；标记为“详细文档”的会打开对应技术的官方文档，适合补充语法细节和查阅示例。

| 主题 | 学什么 | 入口 |
| --- | --- | --- |
| XML | 标签、元素、属性、命名空间与文档结构。 | [详细文档 ↗](https://www.w3.org/XML/) |
| DTD | 文档类型定义、元素声明与 XML 结构约束。 | [详细文档 ↗](https://www.w3.org/TR/xml/#dt-doctype) |
| XML DOM | 用 DOM API 解析、遍历和修改 XML 文档。 | [详细文档 ↗](https://www.w3.org/TR/DOM-Level-3-Core/) |
| XSLT | XML 转换、模板匹配与结果树生成。 | [详细文档 ↗](https://www.w3.org/TR/xslt-30/) |
| XPath | 节点路径、谓词、轴与 XML 查询表达式。 | [详细文档 ↗](https://www.w3.org/TR/xpath-31/) |
| XQuery | 面向 XML 数据的查询语言与 FLWOR 表达式。 | [详细文档 ↗](https://www.w3.org/TR/xquery-31/) |
| XLink | XML 文档中的超链接、链接类型与语义。 | [详细文档 ↗](https://www.w3.org/TR/xlink/) |
| XPointer | 定位 XML 文档内部片段与节点范围。 | [详细文档 ↗](https://www.w3.org/TR/xptr-framework/) |
| XML Schema | 用 XSD 定义 XML 类型、结构与约束。 | [详细文档 ↗](https://www.w3.org/TR/xmlschema-0/) |
| XSL-FO | XML 格式化对象与 PDF/打印排版。 | [详细文档 ↗](https://www.w3.org/TR/xsl11/) |
| Web Service | 跨系统服务、接口契约与松耦合集成。 | [详细文档 ↗](https://www.w3.org/TR/ws-arch/) |
| WSDL | 用 WSDL 描述 Web Service 接口、操作与消息。 | [详细文档 ↗](https://www.w3.org/TR/wsdl20/) |
| SOAP | 基于 XML 的消息协议、信封、头部与错误处理。 | [详细文档 ↗](https://www.w3.org/TR/soap12-part1/) |
| RSS | 订阅源格式、频道、条目与内容聚合。 | [详细文档 ↗](https://www.rssboard.org/rss-specification) |
| RDF | 资源描述框架、三元组与语义网数据模型。 | [详细文档 ↗](https://www.w3.org/RDF/) |

## 学完后的检查点

- 能写一个带命名空间的 XML 并用 XSD 校验。
- 能用 XPath 精确选出目标节点。
- 能解释 SOAP 与 REST 的差异和适用场景。

:::note 学习建议
每学完一个主题，至少留下三样东西：一段可运行的代码、一条自己的解释、一个能复现的踩坑记录。把它们放进笔记或项目仓库，比“看过”更能证明掌握。
:::

