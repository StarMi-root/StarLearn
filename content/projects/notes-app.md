---
title: 实战：Avalonia 跨平台笔记应用
description: 用 Avalonia、MVVM 与 SQLite 构建 Windows/Linux/macOS 笔记应用，实现搜索、自动保存与打包发布。
category: projects
order: 2
tags: [Avalonia, C#, MVVM, 桌面应用]
updated: 2026-11-12
---

# 实战：Avalonia 跨平台笔记应用

目标是用 C#/XAML 做一个真正能日常使用的桌面笔记应用：列表、编辑、搜索、自动保存、深色主题与跨平台发布。

![桌面应用示意（开源图标：Simple Icons CC0 / Lucide ISC）](/static/img/icons/lu-image.svg)

## 功能范围

- 左侧笔记列表，右侧编辑区。
- 新建、重命名、删除笔记。
- 标题、正文、标签。
- 搜索标题与正文。
- 自动保存与保存状态提示。
- 深色/浅色主题。
- 本地 SQLite 持久化。
- Windows/Linux/macOS 打包。

先不做云同步、协作和富文本，避免范围失控。

## 技术栈

- .NET 8/9
- Avalonia 11+
- CommunityToolkit.Mvvm
- Microsoft.Data.Sqlite 或 EF Core SQLite
- xUnit

## 项目结构

```text
NotesApp/
├── App.axaml
├── ViewModels/
│   ├── MainWindowViewModel.cs
│   ├── NoteListItemViewModel.cs
│   └── NoteEditorViewModel.cs
├── Views/
│   └── MainWindow.axaml
├── Models/Note.cs
├── Services/
│   ├── INoteRepository.cs
│   └── SqliteNoteRepository.cs
└── NotesApp.csproj
```

## 1. 创建项目

```bash
dotnet new install Avalonia.Templates
dotnet new avalonia.mvvm -n NotesApp
cd NotesApp
dotnet add package CommunityToolkit.Mvvm
dotnet add package Microsoft.Data.Sqlite
dotnet run
```

## 2. 模型

```csharp
public sealed class Note
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public string Title { get; set; } = "未命名笔记";
    public string Content { get; set; } = "";
    public string Tags { get; set; } = "";
    public DateTimeOffset CreatedAt { get; init; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
}
```

## 3. 仓储

```csharp
public interface INoteRepository
{
    Task<IReadOnlyList<Note>> GetAllAsync(CancellationToken ct = default);
    Task<Note?> GetAsync(Guid id, CancellationToken ct = default);
    Task SaveAsync(Note note, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}
```

SQLite 建表：

```sql
CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
```

数据库放在用户数据目录：

```csharp
var dir = Path.Combine(
    Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
    "StarLearnNotes");
Directory.CreateDirectory(dir);
var dbPath = Path.Combine(dir, "notes.db");
```

不要把数据库写在安装目录，否则升级或权限变化会丢数据。

## 4. ViewModel

```csharp
public partial class MainWindowViewModel : ObservableObject
{
    private readonly INoteRepository _repository;

    [ObservableProperty]
    private ObservableCollection<Note> notes = [];

    [ObservableProperty]
    private Note? selectedNote;

    [ObservableProperty]
    private string searchText = "";

    [ObservableProperty]
    private string saveState = "已保存";

    public MainWindowViewModel(INoteRepository repository)
    {
        _repository = repository;
    }

    [RelayCommand]
    private async Task LoadAsync()
    {
        var items = await _repository.GetAllAsync();
        Notes = new ObservableCollection<Note>(items);
        SelectedNote = Notes.FirstOrDefault();
    }

    [RelayCommand]
    private async Task NewNoteAsync()
    {
        var note = new Note { Title = "未命名笔记" };
        await _repository.SaveAsync(note);
        Notes.Insert(0, note);
        SelectedNote = note;
    }

    [RelayCommand]
    private async Task DeleteAsync()
    {
        if (SelectedNote is null) return;
        await _repository.DeleteAsync(SelectedNote.Id);
        Notes.Remove(SelectedNote);
        SelectedNote = Notes.FirstOrDefault();
    }
}
```

搜索用 `CollectionView` 或过滤后的集合，不要直接修改原始 `Notes`。

## 5. XAML 布局

```xml
<Grid ColumnDefinitions="280,1,*">
  <DockPanel Grid.Column="0" Margin="12">
    <StackPanel DockPanel.Dock="Top" Spacing="8">
      <TextBox Text="{Binding SearchText}" Watermark="搜索笔记…"/>
      <Button Content="+ 新建笔记" Command="{Binding NewNoteCommand}"/>
    </StackPanel>
    <ListBox ItemsSource="{Binding Notes}"
             SelectedItem="{Binding SelectedNote}">
      <ListBox.ItemTemplate>
        <DataTemplate>
          <StackPanel>
            <TextBlock Text="{Binding Title}" FontWeight="SemiBold"/>
            <TextBlock Text="{Binding UpdatedAt}" Opacity="0.6" FontSize="12"/>
          </StackPanel>
        </DataTemplate>
      </ListBox.ItemTemplate>
    </ListBox>
  </DockPanel>

  <GridSplitter Grid.Column="1" Width="1"/>

  <DockPanel Grid.Column="2" Margin="24">
    <StackPanel DockPanel.Dock="Bottom" Orientation="Horizontal" Spacing="8">
      <TextBlock Text="{Binding SaveState}" VerticalAlignment="Center"/>
      <Button Content="删除" Command="{Binding DeleteCommand}"/>
    </StackPanel>
    <TextBox Text="{Binding SelectedNote.Title}" FontSize="24"
             Watermark="标题" Margin="0,0,0,8"/>
    <TextBox Text="{Binding SelectedNote.Content}"
             AcceptsReturn="True" TextWrapping="Wrap"
             VerticalScrollBarVisibility="Auto"/>
  </DockPanel>
</Grid>
```

实际双向绑定需要处理 null 与保存触发。可用 `TextBoxLostFocus` 或防抖定时器自动保存。

## 6. 自动保存

```csharp
private CancellationTokenSource? _saveCts;

private async Task ScheduleSaveAsync()
{
    _saveCts?.Cancel();
    _saveCts = new CancellationTokenSource();
    var token = _saveCts.Token;

    try
    {
        await Task.Delay(800, token);
        if (SelectedNote is null) return;
        SelectedNote.UpdatedAt = DateTimeOffset.UtcNow;
        await _repository.SaveAsync(SelectedNote, token);
        SaveState = $"已保存 {DateTime.Now:HH:mm:ss}";
    }
    catch (OperationCanceledException)
    {
        // 输入仍在继续，等待下一次保存
    }
}
```

不要在每次按键时同步写数据库。防抖 + 异步保存，并在应用退出时执行最后一次保存。

## 7. 搜索与空状态

- 搜索时保留当前选中项，避免编辑区突然清空。
- 无结果时显示明确空状态。
- 删除前确认。
- 数据库异常时显示可恢复提示，不要崩溃。

## 8. 主题

```xml
<Application RequestedThemeVariant="Default">
  <Application.Styles>
    <FluentTheme />
  </Application.Styles>
</Application>
```

提供浅色/深色切换，保存用户选择。检查自定义颜色的对比度。

## 9. 测试

测试 ViewModel 与仓储：

```csharp
[Fact]
public async Task NewNote_adds_to_collection()
{
    var repo = new InMemoryNoteRepository();
    var vm = new MainWindowViewModel(repo);

    await vm.NewNoteCommand.ExecuteAsync(null);

    Assert.Single(vm.Notes);
    Assert.NotNull(vm.SelectedNote);
}
```

UI 逻辑尽量放进 ViewModel，避免直接测试窗口控件。

## 10. 发布

```bash
dotnet publish -c Release -r linux-x64 --self-contained true -p:PublishSingleFile=true
dotnet publish -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true
dotnet publish -c Release -r osx-arm64 --self-contained true -p:PublishSingleFile=true
```

按目标平台分别构建。macOS 分发需要签名与公证；Windows 可做安装包；Linux 可用 AppImage 或压缩包。

## 验收标准

- [ ] 笔记可创建、编辑、删除
- [ ] 重启应用后数据仍在
- [ ] 搜索能匹配标题与正文
- [ ] 自动保存有状态提示
- [ ] 深浅主题可切换
- [ ] 三个平台至少验证两个
- [ ] 数据库路径符合系统规范
- [ ] 退出时最后一次编辑不丢失

## 扩展方向

- Markdown 预览与导出。
- 标签树与全文搜索。
- 图片附件。
- 加密笔记。
- 云同步与冲突解决。
- 全局快捷键与托盘。

:::tip 桌面应用的核心
不是控件多，而是数据不丢、操作可撤销、窗口不卡。先把保存与错误处理做扎实，再考虑富文本和同步。
:::

## 相关教程

- [Avalonia 入门](/avalonia/intro.html)
- [Avalonia MVVM](/avalonia/mvvm.html)
- [Avalonia 发布](/avalonia/deploy.html)
