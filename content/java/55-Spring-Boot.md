# 第 14 章 Spring 入门

# 55. Spring Boot

## 学习目标

- 掌握 Spring Boot
- 学会自动配置
- 理解 Starter

## 55.1 启动

```java
@SpringBootApplication
public class App {
    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }
}
```

## 55.2 自动配置

- 扫描类路径
- 自动配置 Bean
- 简化配置

## 55.3 Starter

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

## 55.4 配置

```yaml
# application.yml
server:
  port: 8080
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/mydb
    username: user
    password: pass
```

## 55.5 端点

```java
@ActuatorEndpoint
public class HealthEndpoint {
    @ReadOperation
    public Map<String, String> health() {
        return Map.of("status", "UP");
    }
}
```

## 55.6 陷阱

- 过度自动配置
- 配置混乱
- 性能

## 55.7 最佳实践

- Starter 简化
- 配置外置
- 端点监控

## 小结

- 自动配置
- Starter
- 配置 yaml
- 端点
