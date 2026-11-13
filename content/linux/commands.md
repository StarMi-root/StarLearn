---
title: 高频 Linux 命令
description: 导航、文件操作、查找、管道、重定向、压缩、网络与系统信息，掌握日常运维最常用的命令组合。
category: linux
order: 2
tags: [Linux, 命令, grep, find, 管道]
updated: 2026-11-12
---

# 高频 Linux 命令

这页按任务组织命令，而不是按字母表。建议在测试目录中逐个练习。

## 导航与查看

```bash
pwd                 # 当前目录
ls -lah             # 详细列表，含隐藏文件
cd /var/log         # 切换目录
cd ..               # 上一级
cd ~                # 家目录
cd -                # 上一次目录
tree -L 2           # 树形结构（可能需安装）
```

## 文件与目录

```bash
mkdir -p app/logs
touch notes.md
cp notes.md notes.bak
cp -r src/ src-backup/
mv notes.md docs/
rm notes.bak
rm -r old-dir
```

`rm` 默认不进入回收站。执行前用 `ls` 确认目标，必要时先 `mv` 到临时目录。

## 查看文件

```bash
cat file.txt
less file.txt          # 分页查看，q 退出
head -n 20 file.txt
tail -n 50 file.txt
tail -f app.log        # 实时跟踪
wc -l file.txt
```

`less` 中常用：`/关键词` 搜索、`n` 下一个、`G` 末尾、`g` 开头。

## 查找文件

```bash
find . -name "*.md"
find /var/log -type f -name "*.log" -mtime -7
find . -type f -size +100M
find . -name "*.tmp" -delete
```

`find` 很强大，也很危险。先不加 `-delete` 或 `-exec`，确认结果后再执行动作。

## 搜索内容

```bash
grep "ERROR" app.log
grep -rn "TODO" src/
grep -i "timeout" config.conf
grep -v "^#" nginx.conf
```

- `-r` 递归，`-n` 显示行号，`-i` 忽略大小写，`-v` 反向匹配。
- `rg`（ripgrep）速度更快，适合代码库。

## 管道与重定向

```bash
ps aux | grep nginx
cat access.log | awk '{print $1}' | sort | uniq -c | sort -nr | head
echo "hello" > file.txt      # 覆盖
echo "world" >> file.txt     # 追加
command 2> error.log         # 标准错误
command > out.log 2>&1       # 标准输出与错误合并
```

管道把上一个命令的输出交给下一个命令。理解 `stdin`、`stdout`、`stderr` 是 Linux 组合能力的核心。

## 文本处理

```bash
cut -d: -f1 /etc/passwd
sort names.txt | uniq
awk '{sum += $1} END {print sum}' numbers.txt
sed -n '1,10p' file.txt
sed -i 's/old/new/g' file.txt
```

`sed -i` 会直接修改文件，先备份或先不加 `-i` 预览。

## 权限速查

```bash
ls -l
chmod 644 file
chmod +x script.sh
chown user:group file
```

详细规则见 [权限与用户](/linux/permissions.html)。

## 压缩与解压

```bash
tar -czf backup.tar.gz dir/
tar -xzf backup.tar.gz
tar -tzf backup.tar.gz | head
zip -r site.zip site/
unzip site.zip -d target/
```

`tar` 参数记忆：`c` 创建、`x` 解压、`t` 列表、`z` gzip、`f` 文件名。

## 网络

```bash
ip addr
ip route
ping -c 4 example.com
curl -I https://example.com
curl -s https://example.com | head
ss -tulpn
dig example.com
```

`ss` 替代了旧的 `netstat`，用于查看监听端口与连接。查看端口占用：

```bash
sudo ss -tulpn | grep :80
```

## 下载与上传

```bash
curl -L -o file.zip https://example.com/file.zip
wget https://example.com/file.zip
scp file.tar.gz user@server:/tmp/
rsync -avz ./dist/ user@server:/var/www/site/
```

`rsync` 适合增量同步，注意结尾斜杠的语义。详细用法见 [SSH 文件传输](/ssh/tunnel.html)。

## 系统信息

```bash
uname -a
cat /etc/os-release
uptime
free -h
df -h
du -sh /var/log/*
lscpu
lsblk
```

## 进程与服务

```bash
ps aux
top
htop
kill -TERM <pid>
systemctl status nginx
journalctl -u nginx -f
```

优先使用 `TERM` 信号让进程优雅退出，`KILL -9` 是最后手段。

## 历史与别名

```bash
history
history | grep ssh
!!          # 上一条命令
!$          # 上一条命令的最后一个参数
alias ll='ls -lah'
```

把常用别名写入 `~/.bashrc` 或 `~/.zshrc`。

:::tip 组合思维
Linux 的强大来自“小工具 + 管道”。先想清楚每一步的输入输出，再把命令串起来。不要写一个巨大的脚本解决本可以用三行管道完成的事。
:::

## 小练习

1. 统计 Nginx 访问日志中出现次数最多的 10 个 IP。
2. 找出 `/var/log` 下 7 天内修改过的 `.log` 文件。
3. 用 `tar` 备份一个目录，并校验解压后的文件数量。

## 下一步

- [文件系统与磁盘](/linux/filesystem.html)
- [进程与资源](/linux/processes.html)
- [Shell 脚本](/linux/shell.html)
