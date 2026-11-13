---
title: Shell 脚本与自动化
description: 变量、条件、循环、函数、参数、管道、错误处理、trap 与 cron，写出可靠的自动化脚本。
category: linux
order: 7
tags: [Linux, Shell, Bash, 自动化]
updated: 2026-11-12
---

# Shell 脚本与自动化

Shell 脚本适合把重复的命令组合起来：部署、备份、日志清理、健康检查。脚本不难写，难的是写得**可重复、可读、出错能停**。

## 第一个脚本

```bash
#!/usr/bin/env bash
set -euo pipefail

echo "开始备份"
date
```

保存为 `backup.sh`，添加执行权限：

```bash
chmod +x backup.sh
./backup.sh
```

`set -euo pipefail`：

- `-e`：命令失败立即退出。
- `-u`：使用未定义变量时报错。
- `-o pipefail`：管道中任一命令失败即失败。

## 变量

```bash
name="StarLearn"
count=3
readonly MAX_RETRY=3

echo "你好，${name}"
echo "重试次数：${MAX_RETRY}"
```

赋值等号两边不能有空格。变量引用建议加花括号，尤其在拼接时。

## 参数

```bash
#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "用法：$0 <源目录> <目标目录>" >&2
  exit 1
fi

src="$1"
dest="$2"
echo "从 ${src} 同步到 ${dest}"
```

`$0` 脚本名，`$1` 第一个参数，`$#` 参数个数，`$@` 所有参数。

## 条件

```bash
if [ -f "$file" ]; then
  echo "文件存在"
elif [ -d "$file" ]; then
  echo "目录存在"
else
  echo "不存在" >&2
  exit 1
fi

if command -v nginx >/dev/null 2>&1; then
  echo "Nginx 已安装"
fi
```

常用判断：

| 表达式 | 含义 |
|---|---|
| `-f` | 普通文件 |
| `-d` | 目录 |
| `-x` | 可执行 |
| `-z` | 字符串为空 |
| `-n` | 字符串非空 |
| `=` / `!=` | 字符串比较 |
| `-eq` / `-lt` | 数字比较 |

## 循环

```bash
for file in ./*.md; do
  [ -e "$file" ] || continue
  echo "处理 ${file}"
done

while IFS= read -r line; do
  echo "${line}"
done < list.txt
```

遍历文件名要加引号并处理无匹配的情况。逐行读取文件时用 `while IFS= read -r`，不要用 `for line in $(cat file)`。

## 函数

```bash
log() {
  printf '[%s] %s\n' "$(date '+%F %T')" "$*"
}

retry() {
  local attempts="$1"
  shift

  local i
  for ((i = 1; i <= attempts; i++)); do
    if "$@"; then
      return 0
    fi
    log "第 ${i} 次失败：$*"
    sleep $((i * 2))
  done
  return 1
}

retry 3 curl -fsS https://example.com/health
```

函数内变量用 `local`，避免污染全局。

## 管道与错误处理

```bash
set -o pipefail

if ! curl -fsS "$url" | grep -q "ok"; then
  echo "健康检查失败" >&2
  exit 1
fi
```

`-f` 让 curl 在 HTTP 错误时失败，`-sS` 静默但显示错误。不要用 `curl` 后只检查退出码而不看 HTTP 状态。

## trap 清理

```bash
tmp_dir="$(mktemp -d)"
cleanup() {
  rm -rf "$tmp_dir"
}
trap cleanup EXIT

cp important.tar.gz "$tmp_dir/"
```

`trap ... EXIT` 无论成功、失败还是中断都会执行清理。处理 SIGINT 时可以给用户友好提示。

## 安全引用

```bash
# 危险：路径含空格或通配符会出错
rm -rf $dir/*

# 更安全
rm -rf -- "${dir:?}"/*
```

`${var:?}` 在变量为空时退出。删除前先检查目录是否在预期范围内。

## cron

```bash
crontab -e
```

```cron
# 每天 3:30 备份
30 3 * * * /opt/techlearn/scripts/backup.sh >> /var/log/techlearn-backup.log 2>&1
```

格式：分 时 日 月 周。注意 cron 的环境变量与 PATH 与交互式 Shell 不同，脚本中使用绝对路径。

systemd timer 更适合需要日志、依赖和补跑的任务，参考 [systemd](/linux/systemd.html)。

## 日志与幂等

脚本应可重复执行：

- 创建目录用 `mkdir -p`。
- 覆盖文件前先备份。
- 部署使用临时目录 + 原子切换。
- 每一步输出明确日志。
- 失败时返回非零退出码。

```bash
deploy_dir="/opt/techlearn/releases/$(date +%Y%m%d%H%M%S)"
mkdir -p "$deploy_dir"
cp -a ./dist/. "$deploy_dir/"
ln -sfn "$deploy_dir" /opt/techlearn/current
```

## 常见错误

- 变量不加引号导致空格拆分。
- 使用 `set -e` 但忽略在 `if` 或管道中的行为。
- 在脚本里 `cd` 后不检查失败。
- 解析 `ls` 输出，应该用 glob 或 `find -print0`。
- 把密码写在脚本里。
- 删除前没有 `:?` 或路径校验。

:::warn 先 dry-run
任何涉及删除、覆盖、数据库变更的脚本，先加 `--dry-run` 或打印将要执行的操作。生产环境先在测试目录跑一遍。
:::

## 小练习

1. 写一个日志清理脚本，只删除 14 天前的 `.log` 文件，并输出删除列表。
2. 写一个部署脚本：构建、备份、原子切换、健康检查、失败回滚。
3. 用 systemd timer 每天运行备份脚本，并验证日志。

## 下一步

- [Linux 练习课](/linux/practice.html)
- [服务器初始化](/server/setup.html)
- [CI/CD](/server/cicd.html)
