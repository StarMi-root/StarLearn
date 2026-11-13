# 第 14 章 工程化与最佳实践

# 65. 代码风格与 Lint

## 学习目标

- 掌握 PEP 8
- 学会使用 ruff/black
- 理解 lint 作用

## 65.1 PEP 8 核心

- 4 空格缩进
- 行宽 79/88
- 命名约定
- 导入顺序

## 65.2 ruff（推荐）

```bash
pip install ruff
ruff check .        # 检查
ruff check --fix .  # 自动修复
ruff format .       # 格式化
```

配置 `pyproject.toml`：

```toml
[tool.ruff]
line-length = 88
select = ["E", "F", "W", "I"]
```

## 65.3 black（格式化）

```bash
pip install black
black .
```

强制统一风格。

## 65.4 isort（导入排序）

```bash
pip install isort
isort .
```

ruff 已内置 isort。

## 65.5 pylint（更严格）

```bash
pip install pylint
pylint mymodule.py
```

评分 0-10。

## 65.6 mypy（类型检查）

```bash
pip install mypy
mypy mymodule.py
```

## 65.7 pre-commit（钩子）

```bash
pip install pre-commit
pre-commit init
```

`.pre-commit-config.yaml`：

```yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.4.0
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format
  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.8.0
    hooks:
      - id: mypy
```

## 65.8 IDE 集成

- VS Code + Python 扩展
- Pylance
- 保存时格式化

## 65.9 常见 lint 规则

| 规则 | 说明 |
|------|------|
| E501 | 行过长 |
| F401 | 未使用导入 |
| E302 | 函数前空行 |
| B006 | 可变默认参数 |

## 65.10 团队规范

- 统一工具链
- 配置共享
- CI 检查

## 65.11 自动修复

- ruff --fix
- black
- isort

## 65.12 最佳实践

- 保存时格式化
- 提交前 lint
- CI 强制
- 忽略第三方代码

## 65.13 检查清单

- [ ] 无未使用导入
- [ ] 命名一致
- [ ] 行宽合规
- [ ] 类型注解
- [ ] 文档字符串

## 小结

- ruff + black
- pre-commit 钩子
- 团队统一
- 自动修复
