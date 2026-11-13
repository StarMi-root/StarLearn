---
title: Avalonia 数据绑定与 MVVM
description: 用 CommunityToolkit.Mvvm 实现 ViewModel、命令、属性通知与依赖注入，写出可测试的 Avalonia 应用。
category: avalonia
order: 3
tags: [Avalonia, MVVM, 数据绑定, 命令]
updated: 2026-11-12
---

# Avalonia 数据绑定与 MVVM

MVVM 把界面（View）、状态（ViewModel）和业务逻辑（Model/Service）分开。View 尽量只做布局与绑定，ViewModel 负责可观察状态和命令，服务负责 I/O 与业务规则。

## 安装 MVVM 工具包

```bash
dotnet add package CommunityToolkit.Mvvm
```

它提供 `ObservableObject`、`[ObservableProperty]`、`[RelayCommand]` 等源生成器，减少样板代码。

## ViewModel 基础

```csharp
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

public partial class CounterViewModel : ObservableObject
{
    [ObservableProperty]
    private int _count;

    [ObservableProperty]
    private string _message = "点击按钮开始计数";

    [RelayCommand]
    private void Increment()
    {
        Count++;
        Message = Count >= 10 ? "已经很熟练了！" : $"当前计数：{Count}";
    }

    [RelayCommand]
    private void Reset() => Count = 0;
}
```

源生成器会把 `_count` 生成公共属性 `Count`，并在赋值时触发 `PropertyChanged`。类必须标记 `partial`。

## 在 XAML 中绑定

```xml
<Window xmlns="https://github.com/avaloniaui"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        xmlns:vm="using:StarLearnNotes.ViewModels"
        x:Class="StarLearnNotes.Views.MainWindow"
        x:DataType="vm:CounterViewModel"
        Width="520" Height="360" Title="计数器">
  <StackPanel Margin="32" Spacing="14" VerticalAlignment="Center">
    <TextBlock Text="{Binding Count}" FontSize="54" FontWeight="Bold" />
    <TextBlock Text="{Binding Message}" Opacity="0.7" />
    <StackPanel Orientation="Horizontal" Spacing="8">
      <Button Content="+1" Command="{Binding IncrementCommand}" />
      <Button Content="重置" Command="{Binding ResetCommand}" />
    </StackPanel>
  </StackPanel>
</Window>
```

约定：`Increment` 方法生成 `IncrementCommand`。命令自动实现 `ICommand`，按钮会自动禁用不可执行命令。

## 设置 DataContext

在 `App.axaml.cs`：

```csharp
desktop.MainWindow = new MainWindow
{
    DataContext = new CounterViewModel()
};
```

`x:DataType` 与 DataContext 类型一致，编译绑定才能生效。若绑定路径写错，编译时会报错。

## 带参数的异步命令

```csharp
public partial class CourseListViewModel : ObservableObject
{
    private readonly ICourseService _service;

    [ObservableProperty]
    private ObservableCollection<Course> _courses = new();

    [ObservableProperty]
    private bool _isLoading;

    public CourseListViewModel(ICourseService service) => _service = service;

    [RelayCommand]
    private async Task LoadAsync(CancellationToken ct)
    {
        IsLoading = true;
        try
        {
            var items = await _service.GetCoursesAsync(ct);
            Courses = new ObservableCollection<Course>(items);
        }
        finally
        {
            IsLoading = false;
        }
    }
}
```

XAML：

```xml
<Button Content="刷新" Command="{Binding LoadCommand}" />
<ProgressBar IsIndeterminate="True" IsVisible="{Binding IsLoading}" />
<ListBox ItemsSource="{Binding Courses}">
  <ListBox.ItemTemplate>
    <DataTemplate x:DataType="models:Course">
      <StackPanel Spacing="2">
        <TextBlock Text="{Binding Title}" FontWeight="Bold" />
        <TextBlock Text="{Binding Category}" Opacity="0.65" />
      </StackPanel>
    </DataTemplate>
  </ListBox.ItemTemplate>
</ListBox>
```

`ObservableCollection<T>` 在增删元素时会通知 UI；整个集合替换时，属性本身也要通知。

## 依赖注入

```csharp
public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddAppServices(this IServiceCollection services)
    {
        services.AddSingleton<ICourseService, JsonCourseService>();
        services.AddTransient<MainWindowViewModel>();
        return services;
    }
}
```

在 `Program.cs` 或 `App.axaml.cs` 中构建 `ServiceProvider`，再解析 ViewModel。Avalonia 官方 MVVM 模板已经内置了这种结构。

## 值转换与格式化

```xml
<TextBlock Text="{Binding Minutes, StringFormat='{}{0} 分钟'}" />
<TextBlock Text="{Binding IsPublished, Converter={StaticResource BoolToTextConverter}}" />
```

简单格式化可用 `StringFormat`；复杂转换写 `IValueConverter`。优先在 ViewModel 中准备好展示字段，减少 View 逻辑。

## 常见错误

- **绑定不更新**：忘记实现 `INotifyPropertyChanged`，或集合内容变化但用了普通 `List<T>`。
- **命令不执行**：`CanExecute` 返回 false，或方法名与生成的命令名不一致。
- **编译绑定报错**：`x:DataType` 类型不正确，或属性不是 public。
- **内存泄漏**：事件订阅未取消；长生命周期服务持有 ViewModel。

:::tip 测试建议
ViewModel 是纯 C# 类，可以直接单元测试。先测“加载后 Courses 是否有数据”“失败时 IsLoading 是否恢复为 false”，再测界面。
:::

## 下一步

- [常用控件](/avalonia/controls.html)
- [样式、主题与资源](/avalonia/styling.html)
