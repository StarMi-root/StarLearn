---
title: 数据库学习地图：SQL、关系型与缓存
description: 从 SQL 基础到 MySQL、PostgreSQL、SQLite、MongoDB、Redis 与 Memcached 的选型与实战。
category: database
order: 1
tags: [SQL, MySQL, Redis, 数据库选型]
updated: 2026-11-12
---

# 数据库学习地图：SQL、关系型与缓存

数据库学习的关键不是背命令，而是理解数据模型、查询计划和一致性。先把 SQL 写对，再理解索引与事务，最后根据读写比例、数据结构和一致性要求选择关系型、文档型或缓存。

![数据库图标（Simple Icons CC0 / Lucide ISC）](/static/img/icons/si-mysql.svg)

:::tip 先选一条主线
不要同时开五门课。先按下面的顺序完成一个最小项目，再把目录里的其他主题当作按需查阅的工具书。
:::

## 推荐学习顺序

1. **SQL 基础**：能写过滤、聚合、连接、子查询和窗口函数，理解 NULL 与执行顺序。
2. **MySQL 或 PostgreSQL**：掌握表设计、索引、事务隔离、慢查询和备份恢复。
3. **SQLite**：理解嵌入式数据库的适用边界，用于本地工具和桌面应用。
4. **MongoDB**：学习文档建模、聚合管道和索引，避免把关系模型生搬硬套。
5. **Redis 与 Memcached**：用缓存解决热点读，理解过期、穿透、雪崩和一致性策略。

## 全部主题

下表覆盖本方向在 StarLearn 课程目录中的全部主题。标记为“本站精讲”的可以直接进入中文教程；标记为“详细文档”的会打开对应技术的官方文档，适合补充语法细节和查阅示例。

| 主题 | 学什么 | 入口 |
| --- | --- | --- |
| SQL 基础 | 查询、过滤、排序、聚合、连接与子查询。 | [本站精讲](../reference/sql.html) |
| MySQL | 关系型数据库、表设计、索引、事务与备份。 | [详细文档 ↗](https://dev.mysql.com/doc/refman/8.4/en/tutorial.html) |
| PostgreSQL | 功能强大的开源关系数据库，JSON、扩展与高级查询。 | [详细文档 ↗](https://www.postgresql.org/docs/current/tutorial.html) |
| SQLite | 零配置嵌入式数据库，适合本地应用与小型服务。 | [详细文档 ↗](https://www.sqlite.org/lang.html) |
| MongoDB | 文档型 NoSQL 数据库、集合、索引与聚合管道。 | [详细文档 ↗](https://www.mongodb.com/docs/manual/tutorial/) |
| Redis | 内存键值数据库、缓存、分布式锁与消息队列。 | [详细文档 ↗](https://redis.io/docs/latest/develop/) |
| Memcached | 高性能分布式内存缓存，加速热点数据读取。 | [详细文档 ↗](https://github.com/memcached/memcached/wiki) |

## 学完后的检查点

- 能根据执行计划优化一条慢查询。
- 能解释事务隔离级别与幻读、不可重复读的关系。
- 能为一个业务场景写出存储选型理由。

:::note 学习建议
每学完一个主题，至少留下三样东西：一段可运行的代码、一条自己的解释、一个能复现的踩坑记录。把它们放进笔记或项目仓库，比“看过”更能证明掌握。
:::

