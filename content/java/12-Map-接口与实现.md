# 第 3 章 数据结构

# 12. Map 接口与实现

## 学习目标

- 掌握 Map 接口
- 学会 HashMap、TreeMap、LinkedHashMap
- 理解遍历与合并

## 12.1 Map 基础

```java
Map<String, Integer> m = new HashMap<>();
m.put("a", 1);
m.put("b", 2);
int v = m.get("a");       // 1
Integer v2 = m.getOrDefault("x", 0);
boolean has = m.containsKey("a");
m.remove("a");
m.size();
```

## 12.2 HashMap

```java
Map<String, List<String>> m = new HashMap<>();
m.computeIfAbsent("group", k -> new ArrayList<>()).add("item");
```

- 无序
- O(1) 平均

## 12.3 TreeMap

```java
TreeMap<String, Integer> m = new TreeMap<>();
// 按 key 排序
m.firstKey();
m.lastKey();
m.subMap("a", "z");
```

## 12.4 LinkedHashMap

```java
LinkedHashMap<String, Integer> m = new LinkedHashMap<>();
// 保序（插入序）
```

## 12.5 遍历

```java
// 键
for (String k : m.keySet()) { ... }

// 值
for (int v : m.values()) { ... }

// 键值
for (Map.Entry<String, Integer> e : m.entrySet()) {
    System.out.println(e.getKey() + "=" + e.getValue());
}
```

## 12.6 合并操作

```java
m.merge("key", 1, Integer::sum);  // 存在则 sum，否则 put
m.compute("key", (k, v) -> v == null ? 1 : v + 1);
m.computeIfPresent("key", (k, v) -> v + 1);
```

## 12.7 不可变 Map

```java
Map<String, Integer> fixed = Map.of("a", 1, "b", 2);
fixed.put("c", 3);  // UnsupportedOperationException
```

## 12.8 陷阱

```java
// 修改作为 key 的对象
User u = new User("Alice");
m.put(u, 1);
u.setName("Bob");
m.get(u);  // null（hash 变了）
```

## 12.9 性能

- HashMap O(1) 平均
- TreeMap O(log n)
- 高负载因子影响

## 12.10 选型

| 场景 | 推荐 |
|------|------|
| 快速查找 | HashMap |
| 排序遍历 | TreeMap |
| 保序 | LinkedHashMap |
| 不可变 | Map.of |
| 计数 | 配合 compute |

## 小结

- HashMap 最常用
- compute 系列简化
- key 不可变
- 用 entrySet 遍历
