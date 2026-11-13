# 第 16 章 测试

# 59. JUnit 5

## 学习目标

- 掌握 JUnit 5
- 学会断言
- 理解测试组织

## 59.1 基本用法

```java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class MathTest {
    @Test
    void testAdd() {
        assertEquals(4, Math.add(1, 3));
    }
}
```

## 59.2 断言

```java
assertTrue(x)
assertFalse(x)
assertNull(o)
assertNotNull(o)
assertThrows(Exception.class, () -> ...)
assertAll(...)
```

## 59.3 生命周期

```java
@BeforeAll
static void setupAll() { }

@BeforeEach
void setup() { }

@Test
void test() { }

@AfterEach
void teardown() { }

@AfterAll
static void teardownAll() { }
```

## 59.4 参数化

```java
@ParameterizedTest
@ValueSource(ints = {1, 2, 3})
void test(int x) {
    // ...
}

@CsvSource({"1,2,3", "4,5,9"})
void test2(int a, int b, int expected) {
    assertEquals(a + b, expected);
}
```

## 59.5 嵌套

```java
@Nested
class Inner {
    @Test
    void test() { }
}
```

## 59.6 陷阱

- 测试依赖顺序
- 共享状态
- 慢测试

## 59.7 最佳实践

- 隔离测试
- 快速
- 命名清晰

## 小结

- @Test
- 断言
- 生命周期
- 参数化
