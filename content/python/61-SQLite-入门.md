# 第 13 章 数据库

# 61. SQLite 入门

## 学习目标

- 连接 SQLite
- 掌握 CRUD
- 理解事务

## 61.1 连接

```python
import sqlite3

conn = sqlite3.connect("data.db")
cursor = conn.cursor()
```

## 61.2 建表

```python
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")
conn.commit()
```

## 61.3 插入

```python
cursor.execute(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    ("Alice", "alice@example.com")
)
conn.commit()

# 批量
users = [("Bob", "bob@example.com"), ("Carol", "carol@example.com")]
cursor.executemany(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    users
)
conn.commit()
```

## 61.4 查询

```python
cursor.execute("SELECT * FROM users WHERE name = ?", ("Alice",))
row = cursor.fetchone()
print(row)  # (1, 'Alice', 'alice@example.com', ...)

# 所有行
cursor.execute("SELECT * FROM users")
for row in cursor.fetchall():
    print(row)
```

## 61.5 更新与删除

```python
cursor.execute(
    "UPDATE users SET email = ? WHERE name = ?",
    ("new@example.com", "Alice")
)
conn.commit()

cursor.execute("DELETE FROM users WHERE name = ?", ("Bob",))
conn.commit()
```

## 61.6 事务

```python
try:
    cursor.execute("UPDATE accounts SET balance = balance - 100 WHERE id = 1")
    cursor.execute("UPDATE accounts SET balance = balance + 100 WHERE id = 2")
    conn.commit()
except:
    conn.rollback()
    raise
```

## 61.7 上下文管理

```python
with sqlite3.connect("data.db") as conn:
    cursor = conn.cursor()
    cursor.execute("INSERT INTO users (name) VALUES (?)", ("Alice",))
# 自动 commit/rollback
```

## 61.8 Row 工厂

```python
conn.row_factory = sqlite3.Row
cursor.execute("SELECT * FROM users")
row = cursor.fetchone()
print(row["name"])  # 按列名访问
```

## 61.9 参数化查询（必须）

```python
# 差（SQL 注入）
cursor.execute(f"SELECT * FROM users WHERE name = '{name}'")

# 好（参数化）
cursor.execute("SELECT * FROM users WHERE name = ?", (name,))
```

## 61.10 性能

- 索引：`CREATE INDEX idx ON users(name)`
- EXPLAIN 分析
- 批量操作

## 61.11 限制

- 单文件数据库
- 并发写受限
- 适合轻量应用

## 61.12 替代

- **PostgreSQL**：生产
- **MySQL**：通用
- **MongoDB**：NoSQL

## 小结

- 参数化查询防注入
- with 管理事务
- 索引提升性能
- 轻量应用够用
