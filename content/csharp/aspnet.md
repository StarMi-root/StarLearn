---
title: ASP.NET Core Web API 入门
description: 用 .NET 8 创建一个可运行的 Web API，理解路由、依赖注入、中间件、数据模型与部署。
category: csharp
order: 6
tags: [C#, ASP.NET Core, Web API, 后端]
updated: 2026-11-12
---

# ASP.NET Core Web API 入门

ASP.NET Core 是 .NET 的跨平台 Web 框架。它自带依赖注入、配置、日志和中间件管线，适合从最小 API 一路扩展到完整后端服务。

![HTTP 请求与响应示意（开源图标：Simple Icons CC0 / Lucide ISC）](/static/img/icons/lu-globe.svg)

## 创建项目

```bash
dotnet new webapi -n StarLearn.Api
cd StarLearn.Api
dotnet run
```

默认会生成一个天气预报接口。打开 `Program.cs`，把内容替换成最小 API：

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

var courses = new List<Course>
{
    new(1, "C# 入门", "csharp"),
    new(2, "Avalonia", "avalonia"),
    new(3, "llama.cpp", "ai")
};

app.MapGet("/api/courses", () => courses);

app.MapGet("/api/courses/{id:int}", (int id) =>
    courses.FirstOrDefault(c => c.Id == id) is { } course
        ? Results.Ok(course)
        : Results.NotFound());

app.MapPost("/api/courses", (Course course) =>
{
    var nextId = courses.Count == 0 ? 1 : courses.Max(c => c.Id) + 1;
    var created = course with { Id = nextId };
    courses.Add(created);
    return Results.Created($"/api/courses/{created.Id}", created);
});

app.Run();

public record Course(int Id, string Title, string Category);
```

运行后访问 `https://localhost:7xxx/swagger` 查看接口文档，或使用 curl 测试：

```bash
curl -s http://localhost:5000/api/courses
curl -s -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -d '{"id":0,"title":"Linux 部署","category":"linux"}'
```

## 控制器方式

项目变大后，可以用 Controller 组织接口：

```csharp
[ApiController]
[Route("api/[controller]")]
public class CoursesController : ControllerBase
{
    private readonly ICourseService _service;

    public CoursesController(ICourseService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Course>>> GetAll(CancellationToken ct)
        => Ok(await _service.GetAllAsync(ct));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Course>> Get(int id, CancellationToken ct)
    {
        var course = await _service.FindAsync(id, ct);
        return course is null ? NotFound() : Ok(course);
    }
}
```

## 依赖注入

在 `Program.cs` 注册服务：

```csharp
builder.Services.AddSingleton<ICourseService, InMemoryCourseService>();
```

生命周期：

| 生命周期 | 说明 | 适用 |
|---|---|---|
| Singleton | 应用内只有一个实例 | 无状态配置、缓存 |
| Scoped | 每个请求一个实例 | DbContext、请求级服务 |
| Transient | 每次解析都创建 | 轻量、短生命周期对象 |

不要在 Singleton 中依赖 Scoped 服务，这会导致对象被错误地长期持有。

## 中间件与错误处理

```csharp
app.Use(async (context, next) =>
{
    var sw = Stopwatch.StartNew();
    await next();
    sw.Stop();
    app.Logger.LogInformation("{Method} {Path} {Status} {Elapsed}ms",
        context.Request.Method, context.Request.Path,
        context.Response.StatusCode, sw.ElapsedMilliseconds);
});
```

生产环境应统一异常处理，并返回稳定的错误结构，不要把堆栈直接暴露给客户端。

## 连接数据库

实际项目通常使用 EF Core：

```bash
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
```

```csharp
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("Default")));
```

`appsettings.json`：

```json
{
  "ConnectionStrings": {
    "Default": "Data Source=starlearn.db"
  }
}
```

然后用迁移创建表：

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

## 发布与部署

```bash
dotnet publish -c Release -o ./publish
```

在 Linux 上可以用 `systemd` 托管，前面放 Nginx 反向代理。参考 [服务器部署](/server/setup.html) 与 [Nginx](/server/nginx.html)。

:::warn 安全提醒
不要把数据库密码、API Key 写进仓库。使用环境变量、用户机密（`dotnet user-secrets`）或服务器密钥管理。公开 API 要加认证、限流与输入校验。
:::

## 下一步

- [C# 练习课](/csharp/practice.html)
- [Java Spring Boot](/java/springboot.html)
- [服务器部署](/server/setup.html)
