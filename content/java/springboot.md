---
title: Spring Boot Web API 入门
description: 创建 Spring Boot 项目，编写 REST Controller、依赖注入、JPA 数据访问与配置，完成可运行的后端服务。
category: java
order: 5
tags: [Java, Spring Boot, REST, JPA]
updated: 2026-11-12
---

# Spring Boot Web API 入门

Spring Boot 通过自动配置和内嵌服务器，让 Java Web 应用可以快速启动。它是企业后端最常见的框架之一。

## 创建项目

使用 start.spring.io 或命令行：

```bash
curl https://start.spring.io/starter.zip \
  -d dependencies=web,data-jpa,h2,validation \
  -d type=maven-project \
  -d javaVersion=21 \
  -d groupId=com.starlearn \
  -d artifactId=course-api \
  -o course-api.zip
unzip course-api.zip -d course-api
cd course-api
./mvnw spring-boot:run
```

启动后默认监听 `http://localhost:8080`。

## 第一个 REST Controller

```java
package com.starlearn.courseapi.course;

import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/courses")
public class CourseController {
    private final CourseService service;

    public CourseController(CourseService service) {
        this.service = service;
    }

    @GetMapping
    public List<Course> list() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Course get(@PathVariable long id) {
        return service.findById(id);
    }

    @PostMapping
    public Course create(@RequestBody Course course) {
        return service.create(course);
    }
}
```

```java
public record Course(long id, String title, String category, int minutes) {}
```

`@RestController` 表示返回值直接写入响应体，默认序列化为 JSON。

## 服务层与依赖注入

```java
@Service
public class CourseService {
    private final CourseRepository repository;

    public CourseService(CourseRepository repository) {
        this.repository = repository;
    }

    public List<Course> findAll() {
        return repository.findAll();
    }

    public Course findById(long id) {
        return repository.findById(id)
            .orElseThrow(() -> new CourseNotFoundException(id));
    }

    public Course create(Course course) {
        return repository.save(course);
    }
}
```

Spring 通过构造器注入依赖。组件扫描会找到 `@Service`、`@Repository`、`@Controller` 等注解。

## JPA 数据访问

```java
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<CourseEntity, Long> {
    List<CourseEntity> findByCategory(String category);
}
```

实体：

```java
@Entity
public class CourseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String category;
    private int minutes;

    // getters / setters
}
```

`JpaRepository` 自带 `findAll`、`findById`、`save`、`delete` 等方法。方法名 `findByCategory` 会被解析为查询。

## 配置

`src/main/resources/application.yml`：

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:h2:file:./data/course
    username: sa
    password:
  jpa:
    hibernate:
      ddl-auto: update
    open-in-view: false
```

生产环境不要把 `ddl-auto` 设为 `update` 作为数据库迁移方案。使用 Flyway 或 Liquibase 管理结构变更。

## 参数校验

```java
public record CreateCourseRequest(
    @NotBlank String title,
    @NotBlank String category,
    @Min(1) int minutes
) {}
```

```java
@PostMapping
public Course create(@Valid @RequestBody CreateCourseRequest request) {
    return service.create(request);
}
```

配合 `spring-boot-starter-validation`，非法请求会返回 400。

## 统一错误处理

```java
@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(CourseNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> notFound(CourseNotFoundException ex) {
        return Map.of("error", ex.getMessage());
    }
}
```

生产 API 应返回稳定的错误结构和合适的 HTTP 状态码，不要在响应里暴露堆栈。

## 测试

```java
@SpringBootTest
@AutoConfigureMockMvc
class CourseControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    void listCourses() throws Exception {
        mockMvc.perform(get("/api/courses"))
               .andExpect(status().isOk());
    }
}
```

测试至少覆盖：成功路径、参数校验失败、资源不存在、权限不足。

## 打包部署

```bash
./mvnw clean package
java -jar target/course-api-0.0.1-SNAPSHOT.jar
```

在服务器上可用 systemd 托管，Nginx 反向代理。参考 [服务器部署](/server/setup.html) 和 [Nginx](/server/nginx.html)。

:::warn 生产清单
关闭调试端点、限制 Actuator 暴露范围、配置数据库连接池、启用 HTTPS、设置日志轮转，并为 API 增加认证与限流。
:::

## 小练习

1. 增加按分类查询与分页接口。
2. 为创建课程接口增加参数校验和统一错误响应。
3. 用 Docker 打包并运行 Spring Boot 服务。

## 下一步

- [Java 练习课](/java/practice.html)
- [C# ASP.NET Core](/csharp/aspnet.html)
- [服务器部署](/server/setup.html)
