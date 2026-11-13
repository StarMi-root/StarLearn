---
title: Avalonia 样式、主题与资源
description: 使用选择器、样式类、资源字典、FluentTheme 与深浅色主题，打造一致的桌面应用视觉。
category: avalonia
order: 5
tags: [Avalonia, 样式, 主题, 资源]
updated: 2026-11-12
---

# Avalonia 样式、主题与资源

Avalonia 的样式系统类似 CSS：通过选择器匹配控件，再设置属性。主题、颜色、圆角和间距应集中管理，避免散落在每个窗口里。

## 样式基础

```xml
<Window.Styles>
  <Style Selector="TextBlock.h1">
    <Setter Property="FontSize" Value="28" />
    <Setter Property="FontWeight" Value="Bold" />
  </Style>

  <Style Selector="Button.primary">
    <Setter Property="Background" Value="#15803D" />
    <Setter Property="Foreground" Value="White" />
    <Setter Property="Padding" Value="16,9" />
    <Setter Property="CornerRadius" Value="8" />
  </Style>

  <Style Selector="Button.primary:pointerover /template/ ContentPresenter">
    <Setter Property="Background" Value="#166534" />
  </Style>
</Window.Styles>
```

选择器支持类型、类名、伪类、子元素和模板内部元素。`Button.primary` 表示带 `primary` 类的按钮；`:pointerover` 是鼠标悬停。

## 资源字典

把设计令牌放进 `Styles/Theme.axaml`：

```xml
<ResourceDictionary xmlns="https://github.com/avaloniaui"
                    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">
  <Color x:Key="BrandColor">#15803D</Color>
  <SolidColorBrush x:Key="BrandBrush" Color="{StaticResource BrandColor}" />
  <SolidColorBrush x:Key="PageBackground" Color="#F6F8FA" />
  <SolidColorBrush x:Key="CardBackground" Color="#FFFFFF" />
  <SolidColorBrush x:Key="TextPrimary" Color="#0F172A" />
  <SolidColorBrush x:Key="TextMuted" Color="#64748B" />
  <x:Double x:Key="PagePadding">24</x:Double>
</ResourceDictionary>
```

在 `App.axaml` 合并：

```xml
<Application.Resources>
  <ResourceDictionary>
    <ResourceDictionary.MergedDictionaries>
      <ResourceInclude Source="avares://StarLearnNotes/Styles/Theme.axaml" />
    </ResourceDictionary.MergedDictionaries>
  </ResourceDictionary>
</Application.Resources>
```

使用 `{DynamicResource CardBackground}`，主题切换时能自动更新。

## 深色主题

Avalonia 使用 `ThemeVariant`。可以定义两套资源：

```xml
<ResourceDictionary.ThemeDictionaries>
  <ResourceDictionary x:Key="Light">
    <SolidColorBrush x:Key="PageBackground" Color="#F6F8FA" />
    <SolidColorBrush x:Key="TextPrimary" Color="#0F172A" />
  </ResourceDictionary>
  <ResourceDictionary x:Key="Dark">
    <SolidColorBrush x:Key="PageBackground" Color="#08111C" />
    <SolidColorBrush x:Key="TextPrimary" Color="#E8EEF6" />
  </ResourceDictionary>
</ResourceDictionary.ThemeDictionaries>
```

在代码中切换：

```csharp
if (Application.Current is { } app)
{
    app.RequestedThemeVariant = app.ActualThemeVariant == ThemeVariant.Dark
        ? ThemeVariant.Light
        : ThemeVariant.Dark;
}
```

也可以绑定到设置项，保存用户偏好。

## 控件模板

修改控件内部结构需要 `ControlTheme` 或模板：

```xml
<ControlTheme x:Key="PillButton" TargetType="Button">
  <Setter Property="Template">
    <ControlTemplate>
      <Border Name="PART_Border"
              Background="{TemplateBinding Background}"
              CornerRadius="999"
              Padding="{TemplateBinding Padding}">
        <ContentPresenter Content="{TemplateBinding Content}"
                          HorizontalContentAlignment="Center" />
      </Border>
    </ControlTemplate>
  </Setter>
  <Style Selector="^:pointerover /template/ Border#PART_Border">
    <Setter Property="Opacity" Value="0.88" />
  </Style>
</ControlTheme>
```

```xml
<Button Theme="{StaticResource PillButton}" Content="圆角按钮" Background="#0EA5E9" />
```

模板适合封装品牌组件。不要为每个按钮复制模板。

## 字体与排版

```xml
<Window.FontFamily>
  <FontFamily>Inter, PingFang SC, Microsoft YaHei</FontFamily>
</Window.FontFamily>
```

- 正文字号 13–15，标题 20–30。
- 行高对中文阅读很重要，列表项之间留 4–8px。
- 颜色对比度至少满足 WCAG AA；深色主题下不要用纯黑背景配纯白文字。

## 图标

可以用 PathIcon、Geometry 或图标字体：

```xml
<PathIcon Data="M12 2 L22 20 H2 Z" Width="16" Height="16" />
```

复杂图标建议使用 SVG 转 Path，或引入图标库。确保图标有 `ToolTip` 和可访问名称。

## 动效

```xml
<Style Selector="Button">
  <Style.Animations>
    <Animation Duration="0:0:0.15">
      <KeyFrame Cue="0%"><Setter Property="Opacity" Value="1" /></KeyFrame>
      <KeyFrame Cue="100%"><Setter Property="Opacity" Value="1" /></KeyFrame>
    </Animation>
  </Style.Animations>
</Style>
```

动效应短、克制、可关闭。桌面应用的核心是效率，不是炫技。

:::tip 设计系统最小集
先定义 6 个颜色（背景、卡片、正文、弱化、边框、品牌）、3 个间距（8/16/24）、2 个圆角（8/12），足够支撑大多数界面。
:::

## 下一步

- [打包发布 Avalonia 应用](/avalonia/deploy.html)
- [Avalonia 练习课](/avalonia/practice.html)
