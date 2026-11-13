---
title: Git 常用命令速查
description: 配置、提交、分支、合并、变基、远程、撤销、储藏、标签与冲突处理，一份能直接查的 Git 手册。
category: reference
order: 1
tags: [Git, 版本控制, 分支, 速查]
updated: 2026-11-12
---

# Git 常用命令速查

Git 记录文件历史，支持分支协作与可追溯发布。先理解工作区、暂存区、本地仓库和远程仓库四个区域。

```text
工作区 → git add → 暂存区 → git commit → 本地仓库 → git push → 远程
```

## 配置

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
git config --global core.autocrlf input
git config --list --show-origin
```

Windows 可设置 `core.autocrlf true`，跨平台项目更推荐 `.gitattributes` 统一换行。

## 创建与克隆

```bash
git init
git clone git@github.com:user/repo.git
git clone --depth 1 https://github.com/user/repo.git
```

浅克隆适合 CI，但历史不完整。需要完整历史或切旧标签时不要用 `--depth 1`。

## 日常提交

```bash
git status
git diff
git diff --staged
git add file.txt
git add .
git add -p                 # 交互式选择片段
git commit -m "feat: add course search"
git commit --amend          # 修改最近一次提交
```

提交信息建议：

```text
type(scope): summary

body: why, not just what
```

常见 type：`feat`、`fix`、`docs`、`refactor`、`test`、`chore`。

## 分支

```bash
git branch
git branch -a
git switch -c feature/search
git switch main
git branch -d feature/search
git branch -D feature/search   # 强制删除未合并分支
```

`git switch` 比 `git checkout` 语义更清晰；`checkout` 仍可用于恢复文件。

## 合并与变基

```bash
git merge feature/search
git rebase main
git rebase -i HEAD~3
```

- **merge**：保留分支历史，产生合并提交。
- **rebase**：把提交重放到新基线，历史线性，但会改写提交哈希。

不要对已经推送到共享分支的提交随意 rebase。团队应约定策略。

## 远程

```bash
git remote -v
git remote add origin git@github.com:user/repo.git
git fetch origin
git pull --rebase
git push -u origin main
git push
```

`git pull` = fetch + merge/rebase。使用 `--rebase` 可减少无意义的合并提交，但冲突处理要熟悉。

## 撤销

```bash
# 放弃工作区修改
git restore file.txt

# 取消暂存
git restore --staged file.txt

# 修改最近提交
git commit --amend

# 回退提交但保留修改
git reset --soft HEAD~1

# 回退提交并取消暂存
git reset HEAD~1

# 彻底丢弃本地提交（危险）
git reset --hard HEAD~1

# 生成反向提交，适合已推送历史
git revert <commit>
```

已推送到共享分支的历史优先用 `revert`，不要 `reset --hard` 后强推。

## 储藏

```bash
git stash
git stash push -m "wip: search"
git stash list
git stash pop
git stash apply stash@{0}
git stash drop
```

储藏适合临时切换分支，不适合长期保存未完成工作。

## 冲突

```bash
git status
# 编辑冲突文件，保留正确内容并删除标记
git add resolved-file
git commit
```

冲突标记：

```text
<<<<<<< HEAD
当前分支内容
=======
合入分支内容
>>>>>>> feature/search
```

解决后必须运行测试。不要盲目选择“ours”或“theirs”。

## 标签与发布

```bash
git tag -a v1.0.0 -m "release v1.0.0"
git push origin v1.0.0
git tag
git show v1.0.0
```

语义化版本：`MAJOR.MINOR.PATCH`。发布标签应指向通过 CI 的提交。

## 查看历史

```bash
git log --oneline --graph --decorate
git log -p file.txt
git blame file.txt
git show <commit>
git diff main...feature
```

`git blame` 用于追溯行变更，不用于追责。结合提交信息与上下文理解。

## .gitignore

```gitignore
node_modules/
dist/
.env
*.log
.DS_Store
```

已跟踪文件加入 `.gitignore` 后不会自动忽略：

```bash
git rm --cached .env
```

密钥一旦提交，必须轮换，不能只删除文件。

## 常见问题

**push 被拒绝**：远程有新提交。先 `git pull --rebase`，解决冲突后再推。

**detached HEAD**：处于游离提交。需要保留时 `git switch -c new-branch`。

**误删分支**：`git reflog` 找到提交后重建分支。

**大文件导致仓库膨胀**：使用 Git LFS，或从历史中清理（需重写历史并协调团队）。

**换行符全文件变更**：检查 `.gitattributes` 与 `core.autocrlf`。

:::tip 提交前检查
`git diff --staged` 看实际暂存内容，确认没有密钥、调试代码和无关文件。小而清晰的提交比一次性大提交更容易审查与回滚。
:::

## 小练习

1. 创建分支，完成一次合并与一次 rebase。
2. 制造并解决一次冲突。
3. 用 `reflog` 找回误删分支。

## 下一步

- [Markdown 速查](/reference/markdown.html)
- [CI/CD](/server/cicd.html)
