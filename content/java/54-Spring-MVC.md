# 第 14 章 Spring 入门

# 54. Spring MVC

## 学习目标

- 掌握控制器
- 学会路由
- 理解请求响应

## 54.1 控制器

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping
    public List<User> list() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public User get(@PathVariable Long id) {
        return repo.findById(id);
    }

    @PostMapping
    public User create(@RequestBody User u) {
        return repo.save(u);
    }
}
```

## 54.2 参数

```java
@RequestParam String name
@RequestBody User u
@PathVariable Long id
@RequestHeader String token
```

## 54.3 响应

```java
public ResponseEntity<User> get(@PathVariable Long id) {
    User u = repo.findById(id);
    if (u == null) {
        return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(u);
}
```

## 54.4 异常处理

```java
@ControllerAdvice
public class ErrorHandling {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> notFound(ResourceNotFoundException e) {
        return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
    }
}
```

## 54.5 陷阱

- 直接操作 HTTP
- 缺少异常
- 性能

## 54.6 最佳实践

- RESTful
- 异常处理
- 分页

## 小结

- 控制器注解
- 参数绑定
- 响应
- 异常处理
