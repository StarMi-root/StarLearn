---
title: SQL 查询与事务速查
description: SELECT、JOIN、聚合、子查询、窗口函数、索引、事务与注入防护，覆盖日常开发最常用的 SQL。
category: reference
order: 2
tags: [SQL, 数据库, JOIN, 事务, 索引]
updated: 2026-11-12
---

# SQL 查询与事务速查

SQL 是关系型数据库的查询语言。语法在 MySQL、PostgreSQL、SQLite 间大体相通，但函数、类型和优化器行为有差异。

![SQL 插画（开源图标：Simple Icons CC0 / Lucide ISC）](/static/img/icons/lu-database.svg)

## 基础查询

```sql
SELECT id, title, minutes
FROM courses
WHERE minutes >= 120
ORDER BY minutes DESC
LIMIT 10 OFFSET 20;
```

执行顺序直觉：

```text
FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
```

所以 `WHERE` 不能使用聚合别名，`HAVING` 用于聚合后过滤。

## 条件

```sql
WHERE level = 'beginner'
  AND minutes BETWEEN 60 AND 180
  AND category IN ('java', 'python')
  AND title LIKE 'C#%'
  AND deleted_at IS NULL
```

`NULL` 不是值，不能用 `= NULL`，要用 `IS NULL` / `IS NOT NULL`。`NOT IN` 遇到 NULL 可能返回空结果，需特别注意。

## 聚合

```sql
SELECT category,
       COUNT(*) AS course_count,
       AVG(minutes) AS avg_minutes,
       SUM(minutes) AS total_minutes
FROM courses
WHERE deleted_at IS NULL
GROUP BY category
HAVING COUNT(*) >= 3
ORDER BY course_count DESC;
```

## JOIN

```sql
SELECT c.title, u.name AS author
FROM courses c
JOIN users u ON u.id = c.author_id;

SELECT u.name, COUNT(c.id) AS course_count
FROM users u
LEFT JOIN courses c ON c.author_id = u.id
GROUP BY u.id, u.name;
```

- `INNER JOIN`：两边都匹配。
- `LEFT JOIN`：保留左表全部行。
- `RIGHT JOIN`：保留右表全部行，较少用。
- `FULL JOIN`：保留两边，MySQL 需模拟。
- `CROSS JOIN`：笛卡尔积，慎用。

连接条件放 `ON`，过滤条件放 `WHERE`。对 LEFT JOIN，右表过滤条件放错位置会变成 INNER JOIN 效果。

## 子查询与 CTE

```sql
SELECT title
FROM courses
WHERE minutes > (SELECT AVG(minutes) FROM courses);

WITH ranked AS (
  SELECT category, title, minutes,
         ROW_NUMBER() OVER (PARTITION BY category ORDER BY minutes DESC) AS rn
  FROM courses
)
SELECT category, title, minutes
FROM ranked
WHERE rn <= 3;
```

CTE 提升可读性。窗口函数适合排名、累计、同比与去重。

## 窗口函数

```sql
SELECT title,
       category,
       minutes,
       SUM(minutes) OVER (PARTITION BY category) AS category_total,
       RANK() OVER (PARTITION BY category ORDER BY minutes DESC) AS rnk
FROM courses;
```

常见函数：`ROW_NUMBER`、`RANK`、`DENSE_RANK`、`LAG`、`LEAD`、`SUM OVER`。

## 增删改

```sql
INSERT INTO courses (title, category, minutes)
VALUES ('Rust 入门', 'rust', 180);

UPDATE courses
SET minutes = 200
WHERE id = 42;

DELETE FROM courses
WHERE id = 42;
```

生产环境执行 `UPDATE`/`DELETE` 前先用相同 `WHERE` 做 `SELECT` 确认范围，并开启事务。

## 事务

```sql
BEGIN;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

COMMIT;
-- 出错时 ROLLBACK;
```

ACID：

- **原子性**：要么全成功，要么全失败。
- **一致性**：满足约束。
- **隔离性**：并发事务互不干扰到约定程度。
- **持久性**：提交后不丢失。

隔离级别：Read Uncommitted、Read Committed、Repeatable Read、Serializable。越高越安全，但并发性能越低。

## 索引

```sql
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_category_minutes ON courses(category, minutes);
```

- 索引加速读，增加写与存储成本。
- 联合索引遵循最左前缀。
- 低区分度字段（如性别）单独索引效果有限。
- 函数包装列可能导致索引失效。
- 用 `EXPLAIN` / `EXPLAIN ANALYZE` 查看执行计划。

```sql
EXPLAIN ANALYZE
SELECT * FROM courses WHERE category = 'java' ORDER BY minutes DESC LIMIT 10;
```

## 防注入

错误做法：

```sql
-- 不要拼接用户输入
SELECT * FROM users WHERE name = '" + input + "';
```

使用参数化查询：

```python
cursor.execute("SELECT * FROM users WHERE name = %s", (name,))
```

```csharp
var user = await db.Users.FirstOrDefaultAsync(u => u.Name == name);
```

ORM 也不能完全免疫注入，原生 SQL、排序字段、表名拼接要特别小心。

## 数据库差异

| 特性 | MySQL | PostgreSQL | SQLite |
|---|---|---|---|
| 自增 | AUTO_INCREMENT | GENERATED/IDENTITY | AUTOINCREMENT |
| 字符串拼接 | CONCAT | `||` | `||` |
| 布尔 | TINYINT(1) | boolean | 整数 |
| JSON | JSON | JSONB | JSON1 |
| 大小写 | 依配置 | 标识符折叠 | 字符串敏感 |

写跨库 SQL 时保持简单，复杂逻辑放到应用层或使用迁移工具。

:::warn 生产操作
执行 `DROP`、`TRUNCATE`、无 `WHERE` 的 `UPDATE`/`DELETE` 前必须备份并确认环境。生产数据库应使用只读账号排查，写操作走审批与事务。
:::

## 小练习

1. 统计每个分类的课程数与平均时长。
2. 用窗口函数找出每个分类时长最长的课程。
3. 用 `EXPLAIN` 分析一条慢查询并设计索引。

## 下一步

- [HTTP 状态码](/reference/http.html)
- [Java Spring Boot](/java/springboot.html)
