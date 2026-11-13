# 第 5 章 面向对象

# 23. 记录 record

## 学习目标

- 掌握 record 定义
- 学会自定义构造器
- 理解不可变性

## 23.1 基本用法

```java
public record Point(int x, int y) {}

Point p = new Point(1, 2);
int x = p.x();
int y = p.y();
```

## 23.2 自动生成

- 构造器
- getter（`x()`、`y()`）
- `equals` / `hashCode`
- `toString`

## 23.3 紧凑构造器

```java
public record Range(int start, int end) {
    public Range {
        if (start > end) {
            throw new IllegalArgumentException();
        }
    }
}
```

## 23.4 静态方法

```java
public record Color(int r, int g, int b) {
    public static Color ofHsl(double h, double s, double l) {
        // ...
        return new Color(r, g, b);
    }
}
```

## 23.5 实现接口

```java
public record User(String name, String email) implements Identifiable {
    public String id() {
        return email;
    }
}
```

## 23.6 嵌套

```java
public record Outer(String name) {
    public record Inner(String detail) {}
}
```

## 23.7 不可变

```java
record Point(int x, int y) {
    public Point {
        // 紧凑构造器
    }
}
// 字段隐式 private final
```

## 23.8 与 dataclass 对比

- record 不可变
- 组件即字段
- 自动生成方法

## 23.9 陷阱

- 不能 extends
- 不能声明非 static 字段
- 构造器参数即组件

## 23.10 最佳实践

- 数据载体用 record
- 配置对象用 record
- 避免可变状态

## 小结

- record 不可变
- 紧凑构造器校验
- 自动生成方法
- 数据载体首选
