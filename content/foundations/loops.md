---
title: 循环：重复执行与批量处理
description: for、while、do-while、foreach、range、嵌套循环、break/continue 与常见循环模式，覆盖四种语言的写法与陷阱。
category: foundations
order: 4
tags: [循环, for, while, foreach, 迭代]
updated: 2026-11-13
---

# 循环：重复执行与批量处理

循环让程序重复执行一段代码，直到条件不再满足，或遍历完一个集合。写循环要同时关注三件事：**起始条件、终止条件、每次如何推进**。任何一件写错，都可能导致少一次、多一次或死循环。

## for 循环

`for` 最适合“已知次数”或“需要下标”的场景。

```csharp
for (int i = 0; i < 5; i++)
{
    Console.WriteLine(i); // 0 1 2 3 4
}
```

```python
for i in range(5):
    print(i)
```

```java
for (int i = 0; i < 5; i++) {
    System.out.println(i);
}
```

```javascript
for (let i = 0; i < 5; i++) {
  console.log(i);
}
```

C#/Java/JS 的 `for` 由初始化、条件、迭代三部分组成；Python 的 `for` 是“遍历可迭代对象”，用 `range(5)` 生成 0 到 4。

### range 的边界

```python
range(5)        # 0,1,2,3,4
range(2, 6)     # 2,3,4,5
range(0, 10, 2) # 0,2,4,6,8
range(5, 0, -1) # 5,4,3,2,1
```

`range` 不包含终点，这是 Python 和切片一致的规则。

## while 循环

`while` 适合“不知道要循环多少次，只知道何时停止”的场景。

```csharp
int attempts = 0;
while (attempts < 3)
{
    attempts++;
    if (TryLogin()) break;
}
```

```python
attempts = 0
while attempts < 3:
    attempts += 1
    if try_login():
        break
```

写 `while` 时先检查三件事：

1. 进入循环前，条件变量是否已初始化？
2. 循环体里有没有推进条件变量？
3. 是否有可能永远不满足终止条件？

## do-while

`do-while` 至少执行一次，适合“先做一次，再判断是否继续”的交互。

```csharp
string input;
do
{
    input = Console.ReadLine() ?? "";
} while (string.IsNullOrWhiteSpace(input));
```

```java
String input;
do {
    input = scanner.nextLine();
} while (input.isBlank());
```

Python 没有 `do-while`，通常写成 `while True` 加 `break`：

```python
while True:
    value = input("请输入非空内容：")
    if value.strip():
        break
```

## foreach / for-in / for-of

遍历集合时优先使用“只读遍历”，避免下标和越界问题。

```csharp
foreach (var name in names)
{
    Console.WriteLine(name);
}
```

```python
for name in names:
    print(name)
```

```java
for (String name : names) {
    System.out.println(name);
}
```

```javascript
for (const name of names) {
  console.log(name);
}
```

需要下标时：

```python
for index, name in enumerate(names):
    print(index, name)
```

```javascript
names.forEach((name, index) => console.log(index, name));
```

不要在 `foreach` 中修改正在遍历的集合。需要删除时，先收集再统一处理：

```csharp
var toRemove = users.Where(u => !u.IsActive).ToList();
foreach (var user in toRemove) users.Remove(user);
```

## break 与 continue

- `break`：立即结束整个循环。
- `continue`：跳过本次剩余代码，进入下一次迭代。

```csharp
foreach (var n in numbers)
{
    if (n < 0) continue; // 跳过负数
    if (n > 100) break;  // 遇到大于 100 就停止
    Console.WriteLine(n);
}
```

嵌套循环中的 `break` 只跳出最近一层。需要跳出多层时，C# 可用 `goto`（谨慎），Java 可用标签，Python 可用函数返回或标志变量。更推荐把嵌套逻辑提取成函数，用 `return` 结束。

## 常见循环模式

### 求和与计数

```python
total = 0
count = 0
for score in scores:
    total += score
    count += 1
average = total / count if count else 0
```

### 查找

```csharp
int? found = null;
foreach (var item in items)
{
    if (item.Id == targetId)
    {
        found = item.Id;
        break;
    }
}
```

### 求最大值

```python
maximum = float("-inf")
for value in values:
    if value > maximum:
        maximum = value
```

空集合求最大值会出错，先判断 `len(values) > 0` 或使用 `max(values, default=0)`。

### 过滤与转换

```javascript
const activeNames = users
  .filter(user => user.active)
  .map(user => user.name);
```

## 嵌套循环与复杂度

两层循环通常意味着 O(n²)。例如打印九九乘法表：

```python
for i in range(1, 10):
    for j in range(1, i + 1):
        print(f"{j}×{i}={i*j}", end="\t")
    print()
```

如果数据量是 10 万，O(n²) 就是 100 亿次操作，通常不可接受。看到嵌套循环时，先问能否用哈希表、排序或双指针把复杂度降下来。

## 死循环与边界

```csharp
int i = 0;
while (i < 10)
{
    Console.WriteLine(i);
    // 忘记 i++，永远循环
}
```

防护措施：

- 在循环体开头或结尾明确推进变量。
- 对未知循环设置最大次数或超时。
- 用 `for` 替代结构简单的 `while`，把推进写在固定位置。
- 对集合遍历，确认长度在循环期间不会变化。

## 常见错误

1. **off-by-one**：`<= length` 导致越界。
2. **死循环**：条件变量没有推进。
3. **在遍历中删除**：跳过元素或抛异常。
4. **嵌套 break 只跳一层**：误以为结束了全部循环。
5. **循环内重复计算不变的值**：把 `items.Count`、复杂查询提到循环外。
6. **循环内拼接大字符串**：使用 `StringBuilder`、`join` 或列表收集。

## 练习：循环

:::quiz
question: Python 中 `range(2, 6)` 生成的数字是？
options:
  - "2,3,4,5,6"
  - "2,3,4,5"
  - "1,2,3,4,5"
  - "2,4,6"
answer: B
explain: range 包含起点，不包含终点。
:::

:::quiz
question: 哪个语句会立即结束整个循环？
options:
  - "continue"
  - "break"
  - "return 以外的 pass"
  - "skip"
answer: B
explain: break 结束当前循环；continue 只跳过本次迭代。
:::

:::quiz
question: 长度为 5 的数组，安全遍历的循环条件是？
options:
  - "i <= 5"
  - "i < 5"
  - "i > 5"
  - "i != 5"
answer: B
explain: 合法下标是 0-4，所以 i < length。
:::

:::quiz
question: while 循环最常见的死循环原因是？
options:
  - "循环体没有推进条件变量"
  - "使用了 break"
  - "循环次数太少"
  - "使用了布尔变量"
answer: A
explain: 条件一直为真且没有推进，就会无限执行。
:::

:::quiz
question: do-while 与 while 的关键区别是？
options:
  - "do-while 至少执行一次"
  - "do-while 不能使用 break"
  - "while 至少执行一次"
  - "两者完全相同"
answer: A
explain: do-while 先执行循环体，再判断条件。
:::

:::quiz
question: 在嵌套循环中，内层 break 会？
options:
  - "跳出所有循环"
  - "只跳出最近一层循环"
  - "结束程序"
  - "跳过当前函数"
answer: B
explain: break 只作用于所在的那一层循环。
:::

## 下一步

- 用《函数》把循环逻辑封装成可复用单元。
- 练习把 O(n²) 的查找改成哈希表 O(n)。
- 给每个循环写边界测试：空集合、1 个元素、最大下标。
