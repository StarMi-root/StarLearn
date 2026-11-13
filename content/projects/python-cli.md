---
title: 实战：Python 命令行笔记工具
description: 用标准库 argparse、pathlib、json 做一个可安装、可搜索、可导出的 CLI 笔记工具，并用 pytest 验证。
category: projects
order: 3
tags: [Python, CLI, argparse, pytest, 项目]
updated: 2026-11-12
---

# 实战：Python 命令行笔记工具

这个项目不依赖数据库，用标准库完成一个真正顺手的 CLI：添加笔记、搜索、查看、删除、导出 Markdown。重点练习参数解析、文件持久化、错误处理与测试。

![Python 项目示意（开源图标：Simple Icons CC0 / Lucide ISC）](/static/img/icons/si-python.svg)

## 功能

```bash
notes add "学习 asyncio" --tag python --tag async
notes list --tag python
notes search "事件循环"
notes show 3
notes delete 3
notes export --output notes.md
```

## 项目结构

```text
notes-cli/
├── pyproject.toml
├── src/notes_cli/
│   ├── __init__.py
│   ├── __main__.py
│   ├── cli.py
│   ├── storage.py
│   └── models.py
└── tests/
    └── test_cli.py
```

## 1. 数据模型

```python
from dataclasses import dataclass, asdict
from datetime import datetime, timezone


@dataclass
class Note:
    id: int
    text: str
    tags: list[str]
    created_at: str

    @classmethod
    def create(cls, note_id: int, text: str, tags: list[str]) -> "Note":
        return cls(
            id=note_id,
            text=text.strip(),
            tags=sorted(set(tags)),
            created_at=datetime.now(timezone.utc).isoformat(),
        )

    def to_dict(self) -> dict:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: dict) -> "Note":
        return cls(
            id=int(data["id"]),
            text=str(data["text"]),
            tags=[str(tag) for tag in data.get("tags", [])],
            created_at=str(data["created_at"]),
        )
```

## 2. 存储层

```python
import json
import os
from pathlib import Path

from .models import Note


class NoteStore:
    def __init__(self, path: Path | None = None):
        default_dir = Path(os.environ.get("XDG_DATA_HOME", Path.home() / ".local/share"))
        self.path = path or default_dir / "starlearn-notes" / "notes.json"
        self.path.parent.mkdir(parents=True, exist_ok=True)

    def load(self) -> list[Note]:
        if not self.path.exists():
            return []
        try:
            raw = json.loads(self.path.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError) as exc:
            raise RuntimeError(f"无法读取笔记文件：{self.path}") from exc
        if not isinstance(raw, list):
            raise RuntimeError("笔记文件格式错误：根节点必须是数组")
        return [Note.from_dict(item) for item in raw]

    def save(self, notes: list[Note]) -> None:
        tmp = self.path.with_suffix(".tmp")
        payload = [note.to_dict() for note in notes]
        tmp.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
        tmp.replace(self.path)
```

使用临时文件 + 原子替换，避免写入中断导致文件损坏。

## 3. CLI

```python
import argparse
import sys

from .storage import NoteStore


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="notes", description="命令行笔记工具")
    sub = parser.add_subparsers(dest="command", required=True)

    add = sub.add_parser("add", help="添加笔记")
    add.add_argument("text")
    add.add_argument("--tag", action="append", default=[])

    ls = sub.add_parser("list", help="列出笔记")
    ls.add_argument("--tag")

    search = sub.add_parser("search", help="搜索笔记")
    search.add_argument("keyword")

    show = sub.add_parser("show", help="查看笔记")
    show.add_argument("id", type=int)

    delete = sub.add_parser("delete", help="删除笔记")
    delete.add_argument("id", type=int)

    export = sub.add_parser("export", help="导出 Markdown")
    export.add_argument("--output", default="notes.md")

    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    store = NoteStore()

    try:
        notes = store.load()

        if args.command == "add":
            note_id = max((note.id for note in notes), default=0) + 1
            note = Note.create(note_id, args.text, args.tag)
            notes.append(note)
            store.save(notes)
            print(f"已添加 #{note.id}: {note.text}")

        elif args.command == "list":
            selected = [n for n in notes if not args.tag or args.tag in n.tags]
            for note in selected:
                tags = " ".join(f"#{tag}" for tag in note.tags)
                print(f"#{note.id:>3}  {note.text}  {tags}")

        elif args.command == "search":
            keyword = args.keyword.lower()
            for note in notes:
                if keyword in note.text.lower() or any(keyword in tag.lower() for tag in note.tags):
                    print(f"#{note.id:>3}  {note.text}")

        elif args.command == "show":
            note = next((n for n in notes if n.id == args.id), None)
            if note is None:
                print(f"找不到笔记 #{args.id}", file=sys.stderr)
                return 1
            print(f"#{note.id} {note.text}")
            print(f"标签：{', '.join(note.tags) or '无'}")
            print(f"创建：{note.created_at}")

        elif args.command == "delete":
            before = len(notes)
            notes = [n for n in notes if n.id != args.id]
            if len(notes) == before:
                print(f"找不到笔记 #{args.id}", file=sys.stderr)
                return 1
            store.save(notes)
            print(f"已删除 #{args.id}")

        elif args.command == "export":
            lines = ["# 我的笔记", ""]
            for note in notes:
                lines.extend([f"## #{note.id} {note.text}", ""])
                if note.tags:
                    lines.append("标签：" + " ".join(f"`{tag}`" for tag in note.tags))
                    lines.append("")
            with open(args.output, "w", encoding="utf-8") as handle:
                handle.write("\n".join(lines))
            print(f"已导出到 {args.output}")

        return 0

    except RuntimeError as exc:
        print(f"错误：{exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
```

## 4. 打包

`pyproject.toml`：

```toml
[build-system]
requires = ["setuptools>=68"]
build-backend = "setuptools.build_meta"

[project]
name = "starlearn-notes"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = []

[project.scripts]
notes = "notes_cli.cli:main"
```

安装：

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
notes add "第一条笔记" --tag demo
```

Windows 激活：

```powershell
.venv\Scripts\Activate.ps1
```

## 5. 测试

```python
from pathlib import Path

from notes_cli.cli import main
from notes_cli.storage import NoteStore


def test_add_and_list(tmp_path: Path, monkeypatch, capsys):
    monkeypatch.setenv("XDG_DATA_HOME", str(tmp_path))
    assert main(["add", "hello", "--tag", "demo"]) == 0

    assert main(["list"]) == 0
    output = capsys.readouterr().out
    assert "hello" in output
    assert "#demo" in output


def test_missing_note_returns_error(tmp_path: Path, monkeypatch, capsys):
    monkeypatch.setenv("XDG_DATA_HOME", str(tmp_path))
    assert main(["show", "99"]) == 1
    assert "找不到" in capsys.readouterr().err


def test_store_roundtrip(tmp_path: Path):
    store = NoteStore(tmp_path / "notes.json")
    from notes_cli.models import Note
    store.save([Note.create(1, "test", ["a"])])
    assert store.load()[0].text == "test"
```

运行：

```bash
pytest -q
```

测试不要写用户真实数据目录，使用 `tmp_path` 与临时环境变量。

## 6. 错误与体验

- 参数错误由 argparse 返回 2。
- 数据缺失返回 1，并写 stderr。
- 成功输出到 stdout，方便管道处理。
- 不打印堆栈给普通用户，调试时用日志。
- 大量笔记可改为 SQLite + FTS，但先保持简单。

## 验收标准

- [ ] add/list/search/show/delete/export 全部可用
- [ ] 数据文件损坏时有清晰错误
- [ ] 写入是原子操作
- [ ] 测试覆盖成功路径与失败路径
- [ ] `pip install -e .` 后可直接运行 `notes`
- [ ] 不依赖用户当前目录

## 扩展方向

- SQLite + 全文搜索。
- Markdown 渲染。
- 加密笔记。
- 与 Obsidian 目录同步。
- Shell 自动补全。
- 发布到 PyPI 或打包为单文件可执行程序。

:::tip 从小工具学工程
CLI 项目麻雀虽小，但包含参数设计、持久化、错误码、测试与打包。把这些做好，比堆功能更能提升工程能力。
:::

## 相关教程

- [Python 文件处理](/python/files.html)
- [Python 函数](/python/functions.html)
- [Shell 脚本](/linux/shell.html)
