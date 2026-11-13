---
title: 实战：C# 任务管理 API
description: 用 ASP.NET Core Minimal API、EF Core SQLite 和原生前端做一个可部署的任务管理器，覆盖校验、测试与发布。
category: projects
order: 1
tags: [C#, ASP.NET Core, EF Core, 项目]
updated: 2026-11-12
---

# 实战：C# 任务管理 API

这是一个从零到可部署的练手项目：任务管理 API + 简单前端。重点不是功能多，而是把**建模、校验、持久化、测试、部署**串起来。

![C# 项目示意（开源图标：Simple Icons CC0 / Lucide ISC）](/static/img/icons/si-dotnet.svg)

## 目标

- 创建、查询、更新、删除任务。
- 支持状态：`todo`、`doing`、`done`。
- 支持优先级与截止日期。
- 参数校验与统一错误响应。
- 数据持久化到 SQLite。
- 有单元/集成测试。
- 可打包为 Docker 或部署到 Linux。

## 技术栈

- .NET 8/9
- ASP.NET Core Minimal API
- EF Core + SQLite
- xUnit
- 原生 HTML/CSS/JS 前端

## 项目结构

```text
TaskManager/
├── src/
│   ├── TaskManager.Api/
│   │   ├── Program.cs
│   │   ├── Data/AppDbContext.cs
│   │   ├── Models/TaskItem.cs
│   │   └── Contracts/
│   └── TaskManager.Web/
│       ├── index.html
│       ├── app.js
│       └── style.css
└── tests/
    └── TaskManager.Tests/
```

## 1. 创建项目

```bash
dotnet new web -n TaskManager.Api -o src/TaskManager.Api
dotnet new xunit -n TaskManager.Tests -o tests/TaskManager.Tests
dotnet add src/TaskManager.Api package Microsoft.EntityFrameworkCore.Sqlite
dotnet add tests/TaskManager.Tests reference src/TaskManager.Api
```

## 2. 领域模型

```csharp
public enum TaskStatus
{
    Todo,
    Doing,
    Done
}

public class TaskItem
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string? Notes { get; set; }
    public TaskStatus Status { get; set; } = TaskStatus.Todo;
    public int Priority { get; set; } = 2;
    public DateOnly? DueDate { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
}
```

不要把 EF 实体直接暴露给前端。创建请求与响应 DTO：

```csharp
public record CreateTaskRequest(
    string Title,
    string? Notes,
    int Priority,
    DateOnly? DueDate);

public record UpdateTaskRequest(
    string Title,
    string? Notes,
    TaskStatus Status,
    int Priority,
    DateOnly? DueDate);
```

## 3. DbContext

```csharp
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<TaskItem> Tasks => Set<TaskItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TaskItem>(entity =>
        {
            entity.Property(t => t.Title).HasMaxLength(200).IsRequired();
            entity.Property(t => t.Notes).HasMaxLength(2000);
            entity.HasIndex(t => t.Status);
            entity.HasIndex(t => t.DueDate);
        });
    }
}
```

## 4. API 端点

```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("Default")));
builder.Services.AddProblemDetails();

var app = builder.Build();

app.UseExceptionHandler();
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/api/tasks", async (AppDbContext db, TaskStatus? status) =>
{
    var query = db.Tasks.AsNoTracking();
    if (status is not null)
        query = query.Where(t => t.Status == status);
    return await query.OrderBy(t => t.DueDate).ToListAsync();
});

app.MapPost("/api/tasks", async (CreateTaskRequest request, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(request.Title))
        return Results.ValidationProblem(new Dictionary<string, string[]>
        {
            ["title"] = ["标题不能为空"]
        });

    var task = new TaskItem
    {
        Title = request.Title.Trim(),
        Notes = request.Notes,
        Priority = Math.Clamp(request.Priority, 1, 3),
        DueDate = request.DueDate
    };

    db.Tasks.Add(task);
    await db.SaveChangesAsync();
    return Results.Created($"/api/tasks/{task.Id}", task);
});

app.MapPatch("/api/tasks/{id:int}/status", async (int id, TaskStatus status, AppDbContext db) =>
{
    var task = await db.Tasks.FindAsync(id);
    if (task is null) return Results.NotFound();

    task.Status = status;
    task.UpdatedAt = DateTimeOffset.UtcNow;
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapDelete("/api/tasks/{id:int}", async (int id, AppDbContext db) =>
{
    var task = await db.Tasks.FindAsync(id);
    if (task is null) return Results.NotFound();

    db.Tasks.Remove(task);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();
```

生产项目应拆分 endpoint、service 与 repository，避免 `Program.cs` 膨胀。

## 5. 数据库

`appsettings.json`：

```json
{
  "ConnectionStrings": {
    "Default": "Data Source=taskmanager.db"
  }
}
```

开发环境使用迁移：

```bash
dotnet tool install --global dotnet-ef
dotnet ef migrations add InitialCreate --project src/TaskManager.Api
dotnet ef database update --project src/TaskManager.Api
```

生产环境不要每次启动 `EnsureCreated`。使用迁移脚本并备份数据库。

## 6. 前端

最小页面：

```html
<form id="taskForm">
  <input id="title" required maxlength="200" placeholder="要做什么？">
  <input id="due" type="date">
  <select id="priority">
    <option value="1">高</option>
    <option value="2" selected>中</option>
    <option value="3">低</option>
  </select>
  <button type="submit">添加</button>
</form>
<ul id="tasks"></ul>
```

```javascript
async function loadTasks() {
  const response = await fetch("/api/tasks");
  if (!response.ok) throw new Error("加载失败");
  const tasks = await response.json();
  document.querySelector("#tasks").innerHTML = tasks.map((task) => `
    <li data-id="${task.id}">
      <span>${escapeHtml(task.title)}</span>
      <button data-action="done">完成</button>
      <button data-action="delete">删除</button>
    </li>
  `).join("");
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}
```

不要把用户输入直接插入 `innerHTML`。示例中的 `escapeHtml` 是底线。

## 7. 测试

```csharp
public class TaskApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public TaskApiTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.WithWebHostBuilder(builder =>
        {
            builder.UseSetting("ConnectionStrings:Default", "Data Source=:memory:");
        }).CreateClient();
    }

    [Fact]
    public async Task Create_rejects_empty_title()
    {
        var response = await _client.PostAsJsonAsync("/api/tasks",
            new CreateTaskRequest("", null, 2, null));

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
```

SQLite 内存库需要保持连接打开，测试配置按实际调整。至少覆盖：

- 创建成功与校验失败；
- 按状态过滤；
- 更新不存在任务；
- 删除后查询；
- 并发更新。

## 8. 部署

```bash
dotnet publish src/TaskManager.Api -c Release -o publish
```

用 systemd 托管：

```ini
[Service]
WorkingDirectory=/opt/taskmanager
ExecStart=/usr/bin/dotnet /opt/taskmanager/TaskManager.Api.dll
Restart=on-failure
User=taskapp
Environment=ASPNETCORE_URLS=http://127.0.0.1:5080
```

Nginx 反向代理 `/api/` 和静态文件。数据库文件放在持久目录并定期备份。

## 验收标准

- [ ] 能创建、编辑、完成、删除任务
- [ ] 刷新页面数据仍在
- [ ] 空标题返回 400 且有错误信息
- [ ] 状态过滤正确
- [ ] 测试全部通过
- [ ] 生产环境不显示堆栈
- [ ] 有数据库备份
- [ ] 手机宽度可操作

## 扩展方向

- 用户登录与多租户。
- 标签、子任务、重复任务。
- 提醒与邮件通知。
- 全文搜索。
- 审计日志与软删除。
- 用 React/Avalonia 做客户端。

:::tip 先完成再扩展
第一版只做核心 CRUD 与测试。能部署、能恢复、能解释每个设计选择，比堆十个未完成功能更有价值。
:::

## 相关教程

- [C# 面向对象](/csharp/oop.html)
- [C# ASP.NET Core](/csharp/aspnet.html)
- [Nginx](/server/nginx.html)
