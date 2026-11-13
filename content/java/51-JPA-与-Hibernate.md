# 第 13 章 数据库

# 51. JPA 与 Hibernate

## 学习目标

- 理解 ORM
- 学会实体映射
- 掌握 Query

## 51.1 安装

```xml
<dependency>
    <groupId>org.hibernate.orm</groupId>
    <artifactId>hibernate-core</artifactId>
    <version>6.x</version>
</dependency>
```

## 51.2 实体

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
    // ...
}
```

## 51.3 EntityManager

```java
EntityManager em = ...;
em.persist(new User("Alice"));
User u = em.find(User.class, 1L);
```

## 51.4 查询

```java
List<User> list = em.createQuery("FROM User u WHERE u.name = :n", User.class)
    .setParameter("n", "Alice")
    .getResultList();
```

JPQL 或 Criteria API。

## 51.5 关系

```java
@OneToMany(mappedBy = "user")
private List<Order> orders;
```

## 51.6 陷阱

- N+1
- 懒加载异常
- 会话生命周期

## 51.7 最佳实践

- 懒加载
- 分页
- 避免 N+1

## 小结

- JPA 标准
- Hibernate 实现
- 实体映射
- 避免 N+1
