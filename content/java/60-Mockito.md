# 第 16 章 测试

# 60. Mockito

## 学习目标

- 掌握 Mock
- 学会 verify
- 理解 stubbing

## 60.1 基本用法

```java
import static org.mockito.Mockito.*;

UserService service = mock(UserService.class);
when(service.find("Alice")).thenReturn(user);
service.find("Alice");
verify(service).find("Alice");
```

## 60.2 注入 Mock

```java
@InjectMocks
private OrderService orderService;

@Mock
private OrderRepo repo;
```

## 60.3 参数匹配

```java
when(service.find(anyString())).thenReturn(user);
when(service.find(startsWith("Ali"))).thenReturn(user);
```

## 60.4 验证

```java
verify(repo, times(1)).save(any());
verify(repo, never()).delete(any());
verify(repo, atLeastOnce()).find(any());
```

## 60.5 陷阱

- 过度 Mock
- 验证过严
- 状态泄漏

## 60.6 最佳实践

- Mock 外部依赖
- 简洁验证
- 隔离测试

## 小结

- Mock 创建
- when 返回
- verify 验证
- 匹配器
