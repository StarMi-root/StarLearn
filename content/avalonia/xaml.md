---
title: Avalonia XAML 与布局
description: 掌握 XAML 命名空间、Grid、StackPanel、DockPanel、尺寸单位、资源与样式，搭出稳定的桌面界面。
category: avalonia
order: 2
tags: [Avalonia, XAML, 布局, Grid]
updated: 2026-11-12
---

# Avalonia XAML 与布局

XAML 是 Avalonia 的声明式 UI 语言。它擅长描述“界面长什么样”，而不是“如何一步步绘制”。布局系统会测量、排列控件，并在窗口尺寸变化时重新计算。

## XAML 基础结构

```xml
<Window xmlns="https://github.com/avaloniaui"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        xmlns:vm="using:StarLearnNotes.ViewModels"
        x:Class="StarLearnNotes.Views.MainWindow"
        x:DataType="vm:MainWindowViewModel"
        Title="课程列表" Width="900" Height="600">
  <Grid RowDefinitions="Auto,*,Auto" Margin="24">
    <TextBlock Grid.Row="0" Text="我的课程" FontSize="26" FontWeight="Bold" />
    <ListBox Grid.Row="1" ItemsSource="{Binding Courses}" Margin="0,16" />
    <Button Grid.Row="2" Content="添加课程" HorizontalAlignment="Right" />
  </Grid>
</Window>
```

`x:DataType` 让编译绑定知道 ViewModel 类型，能在编译期发现属性名错误，建议始终开启。

## 常用布局容器

### Grid

最常用、最灵活的布局。支持行列、比例、自动和星号尺寸。

```xml
<Grid ColumnDefinitions="220,*" RowDefinitions="Auto,*">
  <Border Grid.RowSpan="2" Background="#F1F5F9" Padding="16">
    <TextBlock Text="侧边栏" />
  </Border>
  <TextBlock Grid.Column="1" Text="顶部" />
  <ScrollViewer Grid.Row="1" Grid.Column="1">
    <TextBlock Text="内容区域" />
  </ScrollViewer>
</Grid>
```

| 写法 | 含义 |
|---|---|
| `Auto` | 由内容决定 |
| `*` | 占据剩余空间 |
| `2*` | 按比例分配剩余空间 |
| `160` | 固定像素 |

### StackPanel

按水平或垂直方向依次排列。适合工具栏、表单字段和短列表。

```xml
<StackPanel Orientation="Vertical" Spacing="12">
  <TextBlock Text="登录" FontSize="24" />
  <TextBox Watermark="邮箱" />
  <TextBox Watermark="密码" PasswordChar="●" />
  <Button Content="登录" />
</StackPanel>
```

### DockPanel

把子元素停靠到上下左右，最后一个元素填充剩余区域。

```xml
<DockPanel LastChildFill="True">
  <Border DockPanel.Dock="Top" Height="56" Background="#0F172A">
    <TextBlock Text="StarLearn" Foreground="White" VerticalAlignment="Center" Margin="18,0" />
  </Border>
  <Border DockPanel.Dock="Left" Width="200" Background="#F8FAFC">
    <TextBlock Text="导航" Margin="16" />
  </Border>
  <ContentControl Content="主内容" Margin="24" />
</DockPanel>
```

### ScrollViewer 与响应式

桌面窗口可能被缩小，长内容应放进 `ScrollViewer`。配合 `MinWidth`、`MaxWidth` 和比例布局，避免内容被挤压。

```xml
<ScrollViewer HorizontalScrollBarVisibility="Disabled"
              VerticalScrollBarVisibility="Auto">
  <StackPanel MaxWidth="760" Margin="24" Spacing="16">
    <TextBlock TextWrapping="Wrap" Text="一段可能很长的说明文字……" />
  </StackPanel>
</ScrollViewer>
```

## 尺寸与对齐

- `HorizontalAlignment`：`Left`、`Center`、`Right`、`Stretch`。
- `VerticalAlignment`：`Top`、`Center`、`Bottom`、`Stretch`。
- `Margin` 控制外部间距；`Padding` 控制内部留白。
- 优先使用 `Spacing`、`Grid` 和 `Padding`，少用魔法像素。

## 资源与样式

```xml
<Window.Resources>
  <SolidColorBrush x:Key="BrandBrush" Color="#15803D" />
  <x:Double x:Key="CornerRadiusValue">10</x:Double>
</Window.Resources>

<Window.Styles>
  <Style Selector="Button.primary">
    <Setter Property="Background" Value="{DynamicResource BrandBrush}" />
    <Setter Property="Foreground" Value="White" />
    <Setter Property="Padding" Value="18,10" />
    <Setter Property="CornerRadius" Value="8" />
  </Style>
</Window.Styles>

<Button Classes="primary" Content="保存" />
```

`DynamicResource` 支持主题切换时更新，`StaticResource` 性能略好但不会动态变化。品牌色、间距等应集中管理。

## 用 Grid 做卡片布局

```xml
<ItemsControl ItemsSource="{Binding Courses}">
  <ItemsControl.ItemsPanel>
    <ItemsPanelTemplate>
      <WrapPanel Orientation="Horizontal" ItemWidth="240" ItemHeight="140" />
    </ItemsPanelTemplate>
  </ItemsControl.ItemsPanel>
  <ItemsControl.ItemTemplate>
    <DataTemplate>
      <Border Margin="8" Padding="16" CornerRadius="12"
              Background="{DynamicResource CardBackground}"
              BorderBrush="{DynamicResource CardBorder}" BorderThickness="1">
        <StackPanel Spacing="6">
          <TextBlock Text="{Binding Title}" FontWeight="Bold" FontSize="16" />
          <TextBlock Text="{Binding Description}" TextWrapping="Wrap" Opacity="0.7" />
        </StackPanel>
      </Border>
    </DataTemplate>
  </ItemsControl.ItemTemplate>
</ItemsControl>
```

## 调试布局

- 用不同窗口尺寸运行，检查文本换行与按钮是否被裁切。
- 给临时容器加 `Background="Red"` 观察实际占位。
- 避免在 `Grid` 中使用过多固定宽高，尤其是表单和列表项。
- 对长文本设置 `TextWrapping="Wrap"` 和 `TextTrimming`。

:::tip 经验法则
布局先分层：页面 → 主区域 → 卡片 → 控件。每层只解决自己的排列问题。出现“到处调 Margin”时，通常说明容器结构需要调整。
:::

## 下一步

- [数据绑定与 MVVM](/avalonia/mvvm.html)
- [常用控件](/avalonia/controls.html)
