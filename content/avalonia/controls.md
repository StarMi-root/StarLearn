---
title: Avalonia 常用控件
description: TextBox、Button、ListBox、DataGrid、ComboBox、ProgressBar、对话框与文件选择器的实用用法。
category: avalonia
order: 4
tags: [Avalonia, 控件, DataGrid, 对话框]
updated: 2026-11-12
---

# Avalonia 常用控件

Avalonia 的核心控件覆盖文本输入、列表、表格、选择、进度和对话框。掌握少量高频控件的组合，就能完成大多数桌面工具界面。

## 文本输入

```xml
<StackPanel Spacing="12" MaxWidth="420">
  <TextBox Watermark="课程名称" Text="{Binding Title}" />
  <TextBox Watermark="备注" AcceptsReturn="True" TextWrapping="Wrap"
           Height="100" Text="{Binding Notes}" />
  <TextBox Watermark="密码" PasswordChar="●" Text="{Binding Password}" />
  <TextBlock Text="{Binding Title.Length, StringFormat='已输入 {0} 个字符'}" />
</StackPanel>
```

`Watermark` 是占位提示，`PasswordChar` 用于密码输入。需要实时校验时，在 ViewModel 中监听属性变化并维护错误信息。

## 按钮与命令

```xml
<StackPanel Orientation="Horizontal" Spacing="8">
  <Button Content="保存" Command="{Binding SaveCommand}" Classes="primary" />
  <Button Content="取消" Command="{Binding CancelCommand}" />
  <Button Content="删除" Command="{Binding DeleteCommand}" Classes="danger" />
</StackPanel>
```

用 `Command` 而不是 Click 事件，逻辑才能留在 ViewModel 中。命令的 `CanExecute` 可以自动控制按钮可用状态。

## ListBox 与选择

```xml
<ListBox ItemsSource="{Binding Courses}"
         SelectedItem="{Binding SelectedCourse}"
         SelectionMode="Single">
  <ListBox.ItemTemplate>
    <DataTemplate x:DataType="models:Course">
      <Grid ColumnDefinitions="*,Auto" Margin="0,4">
        <StackPanel>
          <TextBlock Text="{Binding Title}" FontWeight="SemiBold" />
          <TextBlock Text="{Binding Category}" FontSize="11" Opacity="0.6" />
        </StackPanel>
        <TextBlock Grid.Column="1" Text="{Binding Minutes, StringFormat='{}{0} min'}" />
      </Grid>
    </DataTemplate>
  </ListBox.ItemTemplate>
</ListBox>
```

`SelectedItem` 双向绑定到 ViewModel 属性，选中项变化时自动通知。

## ComboBox

```xml
<ComboBox ItemsSource="{Binding Levels}"
          SelectedItem="{Binding SelectedLevel}"
          PlaceholderText="选择难度" />
```

如果选项是对象，记得设置 `DisplayMemberBinding` 或 `ItemTemplate`，否则会显示类型名。

## DataGrid

DataGrid 在单独包中：

```bash
dotnet add package Avalonia.Controls.DataGrid
```

在 `App.axaml` 引入样式：

```xml
<Application.Styles>
  <FluentTheme />
  <DataGridTheme />
</Application.Styles>
```

```xml
<DataGrid ItemsSource="{Binding Orders}"
          AutoGenerateColumns="False"
          IsReadOnly="True"
          GridLinesVisibility="Horizontal">
  <DataGrid.Columns>
    <DataGridTextColumn Header="订单号" Binding="{Binding Id}" Width="120" />
    <DataGridTextColumn Header="客户" Binding="{Binding Customer}" Width="*" />
    <DataGridTextColumn Header="金额" Binding="{Binding Amount, StringFormat='¥{0:N2}'}" Width="120" />
    <DataGridTextColumn Header="日期" Binding="{Binding CreatedAt, StringFormat='{}{0:yyyy-MM-dd}'}" Width="130" />
  </DataGrid.Columns>
</DataGrid>
```

数据量大时关闭自动列生成、启用虚拟化，并避免在单元格模板里做重计算。

## 进度与状态

```xml
<ProgressBar Minimum="0" Maximum="100" Value="{Binding Progress}" />
<ProgressBar IsIndeterminate="True" IsVisible="{Binding IsLoading}" />
<TextBlock Text="{Binding Status}" Foreground="#64748B" />
```

## 对话框与文件选择

Avalonia 11 推荐通过 `TopLevel` 获取存储提供程序：

```csharp
public async Task<string?> PickFileAsync(Window owner)
{
    var files = await owner.StorageProvider.OpenFilePickerAsync(new FilePickerOpenOptions
    {
        Title = "选择 Markdown 文件",
        AllowMultiple = false,
        FileTypeFilter = new[]
        {
            new FilePickerFileType("Markdown") { Patterns = new[] { "*.md" } }
        }
    });

    return files.Count > 0 ? files[0].Path.LocalPath : null;
}
```

保存文件：

```csharp
var file = await owner.StorageProvider.SaveFilePickerAsync(new FilePickerSaveOptions
{
    Title = "导出笔记",
    SuggestedFileName = "notes.md",
    DefaultExtension = "md"
});
```

## 通知与确认

Avalonia 没有内置 MessageBox，可用社区库 `MessageBox.Avalonia`，或自己用 `Window` 做模态对话框：

```csharp
var dialog = new ConfirmWindow { DataContext = new ConfirmViewModel("确定删除？") };
var result = await dialog.ShowDialog<bool>(owner);
```

简单提示可以用页面内的 `InfoBar` 或状态文本，避免频繁弹窗打断用户。

## 键盘与焦点

```xml
<TextBox Name="SearchBox" Watermark="搜索" KeyDown="OnSearchKeyDown" />
```

```csharp
private void OnSearchKeyDown(object? sender, KeyEventArgs e)
{
    if (e.Key == Key.Enter)
    {
        // 触发搜索
        e.Handled = true;
    }
}
```

强大的桌面应用要支持键盘操作：Enter 提交、Esc 关闭、Tab 顺序合理、快捷键可发现。

:::warn 线程规则
UI 控件只能在 UI 线程更新。后台线程完成后，用 `Dispatcher.UIThread.Post` 或 `InvokeAsync` 回到 UI 线程再修改绑定属性。
:::

## 下一步

- [样式、主题与资源](/avalonia/styling.html)
- [打包发布 Avalonia 应用](/avalonia/deploy.html)
