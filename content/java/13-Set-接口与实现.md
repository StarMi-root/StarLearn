# 第 3 章 数据结构

# 13. Set 接口与实现

## 学习目标

- 理解 Set 去重
- 掌握 HashSet、TreeSet、LinkedHashSet
- 学会集合运算

## 13.1 Set 基础

```java
Set<String> s = new HashSet<>();
s.add("a");
s.add("b");
s.add("a");  // 重复
s.size();    // 2
```

## 13.2 HashSet

```java
Set<Integer> s = new HashSet<>();
// 无序，O(1)
```

## 13.3 TreeSet

```java
TreeSet<Integer> s = new TreeSet<>();
// 排序，O(log n)
s.first();
s.last();
s.headSet(5);
```

## 13.4 LinkedHashSet

```java
LinkedHashSet<String> s = new LinkedHashSet<>();
// 保序 + 去重
```

## 13.5 不可变 Set

```java
Set<String> s = Set.of("a", "b", "c");
```

## 13.6 集合运算

```java
Set<Integer> a = new HashSet<>(List.of(1, 2, 3));
Set<Integer> b = new HashSet<>(List.of(2, 3, 4));

a.retainAll(b);   // 交集 {2, 3}
a.addAll(b);       // 并集
a.removeAll(b);    // 差集
```

## 13.7 去重

```java
List<String> list = ...;
Set<String> unique = new LinkedHashSet<>(list);
List<String> dedup = new ArrayList<>(unique);
```

## 13.8 陷阱

```java
// 修改作为元素的对象
User u = new User("Alice");
s.add(u);
u.setName("Bob");
// hash 变了，找不到原对象
```

## 13.9 性能

- HashSet O(1)
- TreeSet O(log n)
- 去重大数据用 Set

## 13.10 选型

| 场景 | 推荐 |
|------|------|
| 去重 | HashSet |
| 排序去重 | TreeSet |
| 保序去重 | LinkedHashSet |
| 不可变 | Set.of |

## 小结

- Set 自动去重
- 三种实现按序选
- 集合运算简化差集
- 元素不可变
