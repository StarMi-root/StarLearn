---
title: C# 简介与环境搭建
description: 认识 .NET 平台，安装 SDK，运行第一个 C# 程序，并理解项目、编译与运行的基本流程。
category: csharp
order: 1
tags: [C#, .NET, 环境搭建, 入门]
updated: 2026-11-12
---

# C# 简介与环境搭建

C# 是微软推出的现代、面向对象、类型安全的编程语言，运行在 **.NET** 平台上。它可以用来写控制台工具、Web API、桌面应用（Avalonia/WPF）、游戏（Unity）以及云服务。语法吸收了 C++、Java 的优点，同时提供 LINQ、异步编程、模式匹配等现代特性。

## .NET 是什么

学习 C# 时经常听到几个名词，先把它们分开：

- **C#**：语言本身，定义语法和类型系统。
- **.NET Runtime**：运行已编译程序的运行时，包含垃圾回收器与基础库。
- **.NET SDK**：开发工具包，包含编译器、CLI、模板和运行时。
- **NuGet**：.NET 的包管理器，类似 Python 的 pip。

实际开发只需要安装 **.NET SDK**。截至 2026 年，建议使用 .NET 8 LTS 或更新的稳定版本。

## 安装 SDK

### Windows

从 dotnet.microsoft.com 下载安装包，安装后在 PowerShell 中验证：

```powershell
dotnet --version
dotnet --list-sdks
```

### Linux（Ubuntu/Debian）

```bash
sudo apt update
sudo apt install -y dotnet-sdk-8.0
dotnet --info
```

不同发行版的软件源配置略有差异，生产服务器建议参考微软官方文档固定版本，避免无意升级。

### macOS

```bash
brew install --cask dotnet-sdk
dotnet --version
```

## 第一个程序

创建项目并运行：

```bash
mkdir HelloStarLearn
cd HelloStarLearn
dotnet new console
dotnet run
```

`dotnet new console` 会生成一个最小项目：

```text
HelloStarLearn/
├── HelloStarLearn.csproj
├── Program.cs
└── obj/
```

打开 `Program.cs`，写下：

```csharp
Console.WriteLine("Hello, StarLearn!");
Console.Write("请输入你的名字：");
var name = Console.ReadLine();
Console.WriteLine($"你好，{name}！");
```

再次执行 `dotnet run`，终端会等待输入并输出问候语。

### 传统 Main 方法

现代 C# 支持“顶级语句”，所以上面的代码不需要 `Main`。如果需要更明确的结构，也可以写成：

```csharp
namespace HelloStarLearn;

public static class Program
{
    public static void Main(string[] args)
    {
        Console.WriteLine("Hello, StarLearn!");
    }
}
```

两种写法等价。初学阶段建议先用顶级语句减少干扰，理解类与命名空间后再使用传统结构。

## 项目文件与依赖

`.csproj` 描述项目目标框架和依赖。例如：

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>
</Project>
```

添加第三方包：

```bash
dotnet add package Humanizer
```

`dotnet build` 只编译，`dotnet run` 编译并运行，`dotnet publish -c Release` 生成可分发的发布产物。

:::tip 学习建议
每学一个语法点，都在自己的 `Program.cs` 里改一行并运行一次。C# 的反馈很快，不要只看不写。
:::

## 常见问题

**`dotnet` 命令找不到**：确认安装后重新打开终端，Linux 下检查 `which dotnet` 与 PATH。

**运行时版本不匹配**：用 `dotnet --list-runtimes` 查看已安装运行时，必要时安装对应版本。

**中文乱码**：Windows 终端可执行 `chcp 65001`，或使用 Windows Terminal / VS Code 集成终端。

## 下一步

- [C# 基础语法与类型](/csharp/syntax.html)
- [面向对象与接口](/csharp/oop.html)
- [用 ASP.NET Core 写一个 Web API](/csharp/aspnet.html)
