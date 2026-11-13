# 第 14 章 Spring 入门

# 53. Spring 基础

## 学习目标

- 理解 IoC
- 学会 Bean 管理
- 掌握依赖注入

## 53.1 IoC 容器

```java
@Configuration
public class AppConfig {
    @Bean
    public UserService userService() {
        return new UserService(userRepository());
    }
}
```

## 53.2 组件

```java
@Component
@Service
@Repository
public class MyService {
}
```

## 53.3 依赖注入

```java
@Service
public class UserService {
    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;  // 构造注入
    }
}
```

## 53.4 配置类

```java
@Configuration
@ComponentScan("com.example")
public class App {
}
```

## 53.5 属性

```java
@Value("${app.name}")
private String name;

@ConfigurationProperties("app")
public class AppConfig {
    private String name;
    private int port;
}
```

## 53.6 陷阱

- 循环依赖
- 字段注入
- 过度设计

## 53.7 最佳实践

- 构造注入
- 组件标注
- 配置外置

## 小结

- IoC 容器
- 组件扫描
- 构造注入
- 属性配置
