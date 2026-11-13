# 第 13 章 数据库

# 50. JDBC 入门

## 学习目标

- 掌握 JDBC API
- 学会 CRUD
- 理解连接管理

## 50.1 驱动

```bash
# PostgreSQL
org.postgresql:postgresql
# MySQL
com.mysql:mysql-connector-j
# H2
com.h2database:h2
```

## 50.2 连接

```java
String url = "jdbc:postgresql://localhost:5432/mydb";
try (Connection conn = DriverManager.getConnection(url, "user", "pass")) {
    // ...
}
```

## 50.3 执行 SQL

```java
Statement st = conn.createStatement();
ResultSet rs = st.executeQuery("SELECT * FROM users");
while (rs.next()) {
    System.out.println(rs.getString("name"));
}
```

## 50.4 预编译

```java
String sql = "SELECT * FROM users WHERE name = ?";
try (PreparedStatement ps = conn.prepareStatement(sql)) {
    ps.setString(1, "Alice");
    ResultSet rs = ps.executeQuery();
}
```

## 50.5 更新

```java
String sql = "INSERT INTO users (name, email) VALUES (?, ?)";
try (PreparedStatement ps = conn.prepareStatement(sql)) {
    ps.setString(1, "Alice");
    ps.setString(2, "alice@example.com");
    int rows = ps.executeUpdate();
}
```

## 50.6 事务

```java
conn.setAutoCommit(false);
try {
    // ...
    conn.commit();
} catch (Exception e) {
    conn.rollback();
    throw e;
}
```

## 50.7 陷阱

- 未关闭
- SQL 注入
- 大结果集

## 50.8 最佳实践

- 预编译
- 连接池
- 事务管理

## 小结

- JDBC 底层
- 预编译安全
- 连接池
- 事务
