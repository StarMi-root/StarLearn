# 第 18 章 JSON 与序列化

# 65. JSON 处理

## 学习目标

- 掌握 Jackson
- 学会 Gson
- 理解序列化

## 65.1 Jackson

```java
ObjectMapper mapper = new ObjectMapper();
String json = mapper.writeValueAsString(obj);
MyClass obj = mapper.readValue(json, MyClass.class);
```

## 65.2 注解

```java
public class User {
    @JsonProperty("user_name")
    private String name;

    @JsonIgnore
    private String password;
}
```

## 65.3 Gson

```java
Gson gson = new Gson();
String json = gson.toJson(obj);
User u = gson.fromJson(json, User.class);
```

## 65.4 陷阱

- 字段名不匹配
- 日期格式
- 泛型

## 65.5 最佳实践

- 注解映射
- 配置日期
- 泛型 TypeReference

## 小结

- Jackson 强大
- Gson 简洁
- 注解映射
- 泛型
