# 第 3 章 数据结构

# 11. List 接口与实现

## 学习目标

- 掌握 List 接口
- 学会 ArrayList 与 LinkedList
- 理解迭代器

## 11.1 List 接口

```java
List<String> list = new ArrayList<>();
list.add("a");
list.add(0, "x");
list.set(0, "y");
list.remove(0);
list.get(0);
list.size();
list.contains("x");
list.indexOf("x");
```

## 11.2 ArrayList

```java
List<Integer> a = new ArrayList<>();
a.add(1);
a.add(2);
a.add(3);
a.get(0);  // 1
```

- 基于数组
- 随机访问 O(1)
- 插入/删除 O(n)

## 11.3 LinkedList

```java
List<Integer> l = new LinkedList<>();
l.addFirst(0);
l.addLast(9);
l.pollFirst();
```

- 双向链表
- 头尾操作 O(1)
- 随机访问 O(n)

## 11.4 迭代器

```java
Iterator<Integer> it = list.iterator();
while (it.hasNext()) {
    int x = it.next();
    if (shouldRemove) it.remove();
}
```

## 11.5 List 陷阱

```java
// 增强 for 中修改
for (int x : list) {
    if (x < 0) list.remove(x);  // ConcurrentModificationException
}

// 好
list.removeIf(x -> x < 0);
```

## 11.6 子列表

```java
List<Integer> sub = list.subList(1, 3);  // 视图
sub.set(0, 100);  // 修改原列表
```

## 11.7 排序

```java
list.sort(Comparator.naturalOrder());
list.sort((a, b) -> b - a);
Collections.sort(list);
```

## 11.8 不可变 List

```java
List<String> fixed = List.of("a", "b", "c");
fixed.add("d");  // UnsupportedOperationException
```

## 11.9 复制

```java
List<String> copy = new ArrayList<>(original);
```

## 11.10 选型

| 场景 | 推荐 |
|------|------|
| 随机访问多 | ArrayList |
| 头尾插入多 | LinkedList / ArrayDeque |
| 不可变 | List.of / List.copyOf |
| 保序唯一 | LinkedHashSet |

## 小结

- ArrayList 最常用
- 迭代器安全删除
- List.of 不可变
- 用 removeIf 简化
