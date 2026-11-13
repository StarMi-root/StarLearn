---
title: 实战：Java 课程报名 API
description: 用 Spring Boot、JPA 与事务处理课程报名，解决容量并发、参数校验、测试和 Docker 部署。
category: projects
order: 4
tags: [Java, Spring Boot, JPA, 事务, 项目]
updated: 2026-11-12
---

# 实战：Java 课程报名 API

做一个课程报名系统：课程有容量，用户报名不能超卖。这个项目练习 Spring Boot 分层、JPA、事务、并发控制和部署。

![Java 项目示意（开源图标：Simple Icons CC0 / Lucide ISC）](/static/img/icons/si-openjdk.svg)

## 需求

- 创建课程：标题、容量、开课时间。
- 查询课程余量。
- 用户报名与取消报名。
- 不允许重复报名。
- 容量满时返回明确错误。
- 参数校验与统一错误响应。
- 集成测试与 Docker 部署。

## 数据模型

```java
@Entity
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private int capacity;

    @Version
    private long version;

    // getters
}

@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"course_id", "user_id"}))
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Course course;

    @Column(name = "user_id", nullable = false)
    private String userId;

    private Instant createdAt = Instant.now();

    // getters
}
```

`@Version` 启用乐观锁，防止并发更新互相覆盖。报名仍需唯一约束兜底。

## Repository

```java
public interface CourseRepository extends JpaRepository<Course, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select c from Course c where c.id = :id")
    Optional<Course> findByIdForUpdate(@Param("id") Long id);
}

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    boolean existsByCourseIdAndUserId(Long courseId, String userId);
    long countByCourseId(Long courseId);
    Optional<Enrollment> findByCourseIdAndUserId(Long courseId, String userId);
}
```

悲观锁适合强一致报名。高并发下要注意锁范围与数据库连接占用，不要锁住整个事务的 HTTP 调用。

## 服务层

```java
@Service
public class EnrollmentService {
    private final CourseRepository courses;
    private final EnrollmentRepository enrollments;

    public EnrollmentService(CourseRepository courses, EnrollmentRepository enrollments) {
        this.courses = courses;
        this.enrollments = enrollments;
    }

    @Transactional
    public Enrollment enroll(Long courseId, String userId) {
        var course = courses.findByIdForUpdate(courseId)
            .orElseThrow(() -> new NotFoundException("课程不存在"));

        if (enrollments.existsByCourseIdAndUserId(courseId, userId)) {
            throw new ConflictException("已经报名");
        }

        long count = enrollments.countByCourseId(courseId);
        if (count >= course.getCapacity()) {
            throw new ConflictException("课程已满");
        }

        return enrollments.save(new Enrollment(course, userId));
    }

    @Transactional
    public void cancel(Long courseId, String userId) {
        var enrollment = enrollments.findByCourseIdAndUserId(courseId, userId)
            .orElseThrow(() -> new NotFoundException("未报名"));
        enrollments.delete(enrollment);
    }
}
```

注意：`countByCourseId` 与插入必须在同一事务、同一锁保护下完成，否则仍可能超卖。

## Controller

```java
@RestController
@RequestMapping("/api/courses")
public class CourseController {
    private final CourseService courseService;
    private final EnrollmentService enrollmentService;

    @GetMapping("/{id}")
    public CourseResponse get(@PathVariable Long id) {
        return courseService.get(id);
    }

    @PostMapping("/{id}/enrollments")
    @ResponseStatus(HttpStatus.CREATED)
    public EnrollmentResponse enroll(
        @PathVariable Long id,
        @Valid @RequestBody EnrollRequest request
    ) {
        var enrollment = enrollmentService.enroll(id, request.userId());
        return new EnrollmentResponse(enrollment.getId(), id, request.userId());
    }

    @DeleteMapping("/{id}/enrollments/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancel(@PathVariable Long id, @PathVariable String userId) {
        enrollmentService.cancel(id, userId);
    }
}
```

```java
public record EnrollRequest(@NotBlank String userId) {}
```

示例省略了认证。真实系统必须从登录态获取用户 ID，不能信任请求体。

## 统一错误

```java
@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiError notFound(NotFoundException ex) {
        return new ApiError("not_found", ex.getMessage());
    }

    @ExceptionHandler(ConflictException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ApiError conflict(ConflictException ex) {
        return new ApiError("conflict", ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiError validation(MethodArgumentNotValidException ex) {
        return new ApiError("validation_error", "参数校验失败");
    }
}
```

不要把异常堆栈返回给客户端。

## 并发测试

```java
@SpringBootTest
class EnrollmentConcurrencyTest {
    @Autowired EnrollmentService service;
    @Autowired CourseRepository courses;

    @Test
    void never_oversells() throws Exception {
        var course = courses.save(new Course("并发测试", 10));
        var pool = Executors.newFixedThreadPool(32);
        var tasks = IntStream.range(0, 50)
            .mapToObj(i -> (Callable<Void>) () -> {
                try {
                    service.enroll(course.getId(), "user-" + i);
                } catch (ConflictException ignored) {
                }
                return null;
            })
            .toList();

        pool.invokeAll(tasks);
        pool.shutdown();

        assertThat(enrollments.countByCourseId(course.getId())).isLessThanOrEqualTo(10);
    }
}
```

测试要使用真实数据库（如 Testcontainers PostgreSQL），H2 的锁行为与生产不同。

## 数据库配置

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/starlearn
    username: starlearn
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate
    open-in-view: false
```

生产使用 Flyway/Liquibase 管理 schema，`ddl-auto` 不要设为 `update`。

## Docker

```dockerfile
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY target/course-api.jar app.jar
RUN useradd --system --no-create-home appuser
USER appuser
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

```bash
./mvnw clean package
docker build -t course-api .
docker run --rm -p 127.0.0.1:8080:8080 --env-file .env course-api
```

## 验收标准

- [ ] 课程容量正确，50 并发不超卖
- [ ] 重复报名返回 409
- [ ] 课程不存在返回 404
- [ ] 参数错误返回 400
- [ ] 事务失败能回滚
- [ ] 集成测试使用真实数据库
- [ ] 生产 schema 可迁移
- [ ] 容器以非 root 运行

## 扩展方向

- 候补队列与自动补位。
- 报名截止时间。
- 认证与权限。
- 事件通知。
- Redis 缓存余量（注意一致性）。
- 管理端与统计报表。

:::warn 不要用缓存替代事务
用 Redis 扣减库存时必须设计一致性、补偿与幂等。先保证数据库事务正确，再考虑缓存优化。
:::

## 相关教程

- [Java 集合](/java/collections.html)
- [Spring Boot](/java/springboot.html)
- [Docker](/server/docker.html)
