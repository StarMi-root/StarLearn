---
title: 打包发布 Avalonia 应用
description: 用 dotnet publish 发布 Windows、Linux、macOS 版本，理解自包含、单文件、裁剪与安装包。
category: avalonia
order: 6
tags: [Avalonia, 发布, Linux, Windows]
updated: 2026-11-12
---

# 打包发布 Avalonia 应用

开发完成后，需要把 Avalonia 应用打包成用户可以直接运行的产物。发布方式取决于目标平台、是否要求安装 .NET 运行时，以及体积要求。

## 基础发布

```bash
dotnet publish -c Release -r linux-x64 --self-contained true -p:PublishSingleFile=true
```

- `-c Release`：开启优化。
- `-r linux-x64`：指定运行时标识（RID）。
- `--self-contained true`：自带 .NET 运行时，用户无需安装 SDK。
- `PublishSingleFile`：合并为单文件。

发布结果在 `bin/Release/net8.0/linux-x64/publish/`。

常见 RID：

| 平台 | RID |
|---|---|
| Windows x64 | `win-x64` |
| Windows ARM64 | `win-arm64` |
| Linux x64 | `linux-x64` |
| Linux ARM64 | `linux-arm64` |
| macOS Intel | `osx-x64` |
| macOS Apple Silicon | `osx-arm64` |

## 框架依赖发布

如果确认目标机器已安装 .NET 运行时，可以不打包运行时，体积小很多：

```bash
dotnet publish -c Release -r linux-x64 --self-contained false
```

这种方式要求用户安装匹配的 .NET 版本，适合企业内部统一环境。

## 单文件与裁剪

```xml
<PropertyGroup>
  <PublishSingleFile>true</PublishSingleFile>
  <SelfContained>true</SelfContained>
  <PublishTrimmed>true</PublishTrimmed>
  <TrimMode>partial</TrimMode>
</PropertyGroup>
```

裁剪能显著减小体积，但 Avalonia 与反射可能依赖被裁掉的类型。务必在真机上完整测试，必要时保留程序集或使用 `partial` 模式。

## Linux 桌面集成

发布后得到一个可执行文件，例如 `StarLearnNotes`。让它可执行：

```bash
chmod +x StarLearnNotes
./StarLearnNotes
```

创建 `.desktop` 文件放到 `~/.local/share/applications/starlearn-notes.desktop`：

```ini
[Desktop Entry]
Name=StarLearn Notes
Comment=Cross-platform notes app
Exec=/opt/starlearn-notes/StarLearnNotes
Icon=/opt/starlearn-notes/icon.png
Terminal=false
Type=Application
Categories=Utility;Education;
```

图标建议提供 256×256 PNG。若应用需要访问文件，确保用户目录权限正确。

## Windows 分发

- 自包含单文件最简单，用户双击即可运行。
- 需要安装体验时，可使用 MSIX、Inno Setup 或 WiX。
- 未签名程序可能触发 SmartScreen 警告，正式发布建议代码签名。
- 依赖 VC++ 运行库的情况应说明。

## macOS 分发

macOS 应用通常打包成 `.app`，再进行签名与公证。未签名应用会被 Gatekeeper 拦截。如果只是内部使用，可以在“系统设置 → 隐私与安全性”中允许打开。

## 版本与 CI

在 `.csproj` 中设置版本：

```xml
<Version>1.2.0</Version>
<AssemblyVersion>1.2.0.0</AssemblyVersion>
<FileVersion>1.2.0.0</FileVersion>
```

GitHub Actions 可以按平台矩阵构建：

```yaml
strategy:
  matrix:
    include:
      - os: ubuntu-latest
        rid: linux-x64
      - os: windows-latest
        rid: win-x64
      - os: macos-latest
        rid: osx-arm64
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-dotnet@v4
    with:
      dotnet-version: 8.0.x
  - run: dotnet publish -c Release -r ${{ matrix.rid }} --self-contained true -p:PublishSingleFile=true
```

## 发布前检查清单

- 在干净机器上测试，不依赖开发环境。
- 检查窗口图标、应用图标、版本号。
- 测试高 DPI、深色主题、中文输入法。
- 检查文件读写、配置目录、日志路径。
- 崩溃时能给出可定位的信息，不把堆栈直接弹给用户。

:::warn 跨平台注意
不要假设路径分隔符、换行符或大小写规则。使用 `Path.Combine`、`Environment.SpecialFolder` 和跨平台 API。Linux 下文件名区分大小写，Windows 下通常不区分。
:::

## 下一步

- [Avalonia 练习课](/avalonia/practice.html)
- [部署到 Linux 服务器](/server/setup.html)
