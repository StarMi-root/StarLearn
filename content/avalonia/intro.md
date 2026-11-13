---
title: Avalonia 简介与环境搭建
description: 认识 Avalonia 跨平台 UI 框架，安装模板，创建第一个 Windows/Linux/macOS 桌面应用。
category: avalonia
order: 1
tags: [Avalonia, .NET, 桌面应用, 跨平台]
updated: 2026-11-12
---

# Avalonia 简介与环境搭建

Avalonia 是一个成熟的 .NET 跨平台 UI 框架，使用 C# 与 XAML 开发桌面应用，可运行在 Windows、Linux、macOS，也能扩展到移动端与 WebAssembly。它常被视为 WPF 的跨平台替代方案。

## 为什么选 Avalonia

- **真正跨平台**：同一套代码发布到三大桌面系统。
- **XAML + MVVM**：有 WPF 经验的开发者上手很快。
- **现代渲染**：自绘控件，不依赖平台原生控件集，视觉一致性更好。
- **活跃生态**：Fluent 主题、数据表格、图表、对话框等社区库丰富。
- **开源**：MIT 许可，适合商业项目。

## 安装准备

需要 .NET 8 SDK 或更高版本：

```bash
dotnet --version
dotnet new install Avalonia.Templates
```

安装完成后可以查看模板：

```bash
dotnet new list avalonia
```

常用模板：

| 模板 | 用途 |
|---|---|
| `avalonia.app` | 最小桌面应用 |
| `avalonia.mvvm` | 带 MVVM 结构与依赖注入 |
| `avalonia.xplat` | 跨平台多目标解决方案 |

## 创建第一个应用

```bash
dotnet new avalonia.mvvm -o StarLearnNotes
cd StarLearnNotes
dotnet run
```

首次运行会还原 NuGet 包并启动窗口。项目结构大致如下：

```text
StarLearnNotes/
├── App.axaml
├── App.axaml.cs
├── Program.cs
├── ViewModels/
│   ├── MainWindowViewModel.cs
│   └── ViewModelBase.cs
├── Views/
│   ├── MainWindow.axaml
│   └── MainWindow.axaml.cs
└── StarLearnNotes.csproj
```

## 入口与生命周期

`Program.cs` 负责启动：

```csharp
using Avalonia;

internal static class Program
{
    [STAThread]
    public static void Main(string[] args) =>
        BuildAvaloniaApp().StartWithClassicDesktopLifetime(args);

    public static AppBuilder BuildAvaloniaApp() =>
        AppBuilder.Configure<App>()
            .UsePlatformDetect()
            .LogToTrace();
}
```

`App.axaml` 定义应用级样式和主题：

```xml
<Application xmlns="https://github.com/avaloniaui"
             xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
             x:Class="StarLearnNotes.App"
             RequestedThemeVariant="Default">
  <Application.Styles>
    <FluentTheme />
  </Application.Styles>
</Application>
```

`App.axaml.cs` 的 `OnFrameworkInitializationCompleted` 创建主窗口：

```csharp
public override void OnFrameworkInitializationCompleted()
{
    if (ApplicationLifetime is IClassicDesktopStyleApplicationLifetime desktop)
    {
        desktop.MainWindow = new MainWindow
        {
            DataContext = new MainWindowViewModel()
        };
    }

    base.OnFrameworkInitializationCompleted();
}
```

## 第一个界面

打开 `Views/MainWindow.axaml`，替换为：

```xml
<Window xmlns="https://github.com/avaloniaui"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        x:Class="StarLearnNotes.Views.MainWindow"
        Width="720" Height="480"
        Title="StarLearn Avalonia">
  <StackPanel Margin="32" Spacing="16">
    <TextBlock Text="Hello, Avalonia!"
               FontSize="30" FontWeight="Bold" />
    <TextBlock Text="用 C# 和 XAML 构建跨平台桌面应用。"
               Opacity="0.7" />
    <Button Content="开始学习" HorizontalAlignment="Left" />
  </StackPanel>
</Window>
```

`dotnet run` 后应该看到一个窗口。修改 XAML 并重新运行，就能看到变化。

## 调试与热重载

- VS Code 安装 **C# Dev Kit** 与 **Avalonia for Visual Studio Code**。
- Rider 对 Avalonia 支持较好。
- 开发时可使用 `dotnet watch run`，部分 XAML 改动会自动刷新。

## 常见问题

**找不到 Avalonia 模板**：重新执行 `dotnet new install Avalonia.Templates`，确认 SDK 版本。

**Linux 缺少依赖**：某些发行版需要安装 `libx11`、`libice`、`libsm`、`fontconfig` 等基础库。错误信息通常会列出缺失的 `.so`。

**窗口空白**：检查 `App.axaml.cs` 是否设置了 `desktop.MainWindow`，以及 View 的 `x:Class` 命名空间是否匹配。

:::tip 学习顺序
先理解 XAML 布局，再学数据绑定，最后引入 MVVM 与命令。不要一开始就把所有架构模式堆进第一个窗口。
:::

## 下一步

- [XAML 与布局](/avalonia/xaml.html)
- [数据绑定与 MVVM](/avalonia/mvvm.html)
- [常用控件](/avalonia/controls.html)
