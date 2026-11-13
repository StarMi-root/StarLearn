---
title: 命令行效率速查
description: grep、find、awk、sed、jq、xargs、tmux 与别名，把日常重复操作压缩成可靠的一行命令。
category: reference
order: 5
tags: [命令行, Shell, grep, jq, tmux]
updated: 2026-11-12
---

# 命令行效率速查

命令行的效率来自组合：每个工具只做一件事，通过管道把输出交给下一个工具。

## 导航与文件

```bash
pwd
ls -lah
cd -
pushd /var/log
popd
mkdir -p app/{src,test,dist}
cp -a src/ backup/
mv old.txt new.txt
```

`pushd/popd` 维护目录栈，适合在多个目录间来回切换。

## 查找文件

```bash
find . -name "*.md"
find . -type f -mtime -7
find . -type f -size +100M
find . -name "*.tmp" -print0 | xargs -0 rm
```

路径含空格时使用 `-print0` + `xargs -0`，不要解析 `ls` 输出。

## 搜索内容

```bash
grep -rn "TODO" src/
grep -i "error" app.log
grep -v "^#" config.conf
rg "async function" src/
```

`rg`（ripgrep）默认递归、速度快、尊重 `.gitignore`。

## 文本处理

```bash
cut -d: -f1 /etc/passwd
sort names.txt | uniq -c | sort -nr
awk '{sum += $1} END {print sum}' numbers.txt
sed 's/old/new/g' file.txt
sed -n '1,20p' file.txt
```

`awk` 按列处理，`sed` 按行替换。修改文件前先输出预览，`sed -i` 会直接覆盖。

## JSON

```bash
jq '.' data.json
jq '.items[].name' data.json
jq -r '.items[] | select(.active) | .name' data.json
curl -s https://api.example.com/data | jq '.results | length'
```

`jq -r` 输出原始字符串，适合再交给 Shell。处理不可信 JSON 时注意大小与结构。

## 管道与 xargs

```bash
ps aux | grep nginx
history | grep ssh
find . -name "*.log" -print0 | xargs -0 gzip
echo "a b c" | xargs -n1 echo
```

`xargs` 把输入转成参数。默认按空白分割，含空格路径必须用 `-0`。

## 重定向

```bash
command > out.log
command >> out.log
command 2> err.log
command > all.log 2>&1
command < input.txt
```

`2>&1` 的顺序很重要：先重定向 stdout，再把 stderr 指向同一个位置。

## 后台与复用

```bash
sleep 300 &
jobs
fg %1
nohup ./server > app.log 2>&1 &
disown
```

长期任务使用 `tmux`：

```bash
tmux new -s work
tmux ls
tmux attach -t work
# Ctrl+b d 分离
```

生产服务应使用 systemd，不是 tmux 或 nohup。

## 网络

```bash
curl -fsSL https://example.com
curl -I https://example.com
curl -X POST -H "Content-Type: application/json" -d '{"a":1}' https://api.example.com
wget -c https://example.com/file.zip
ss -tulpn
dig +short example.com
```

## 别名与函数

```bash
alias ll='ls -lah'
alias gs='git status'
alias ..='cd ..'
```

写入 `~/.bashrc` 或 `~/.zshrc`：

```bash
mkcd() {
  mkdir -p "$1" && cd "$1"
}
```

函数适合带参数的组合命令。别名只适合简单替换。

## 安全习惯

- 删除前先 `ls` 或 `--dry-run`。
- 通配符先 `echo` 展开确认。
- 变量加引号：`rm -- "${file:?}"`。
- 不把密码写在命令行历史中。
- 生产操作使用明确路径，不用相对路径猜。
- 危险命令设置别名确认或使用受控脚本。

:::warn 命令历史会记录参数
在命令行直接写 Token 会进入 `~/.bash_history`。使用环境变量、配置文件或密钥管理工具，并定期清理敏感历史。
:::

## 小练习

1. 用 `find`、`grep`、`xargs` 找出一周内修改过的日志并压缩。
2. 用 `jq` 统计 API 返回数组的长度与某个字段总和。
3. 用 `tmux` 同时运行构建与日志跟踪。

## 下一步

- [高频 Linux 命令](/linux/commands.html)
- [Shell 脚本](/linux/shell.html)
- [SSH](/ssh/basics.html)
