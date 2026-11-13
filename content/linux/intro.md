---
title: Linux 入门：终端、发行版与文件系统
description: 认识 Linux 发行版、Shell、终端与目录结构，完成首次登录、软件安装和基础系统检查。
category: linux
order: 1
tags: [Linux, Shell, 发行版, 入门]
updated: 2026-11-12
---

# Linux 入门：终端、发行版与文件系统

Linux 是服务器、云平台和嵌入式设备的主力操作系统。学习 Linux 的核心不是背命令，而是理解**一切皆文件、用组合小工具解决问题**的思路。

![Linux 插画（开源图标：Simple Icons CC0 / Lucide ISC）](/static/img/icons/si-linux.svg)

## 发行版

| 发行版 | 包管理 | 特点 |
|---|---|---|
| Ubuntu / Debian | `apt` | 生态成熟，服务器与桌面都常用 |
| Rocky / AlmaLinux | `dnf` | 兼容 RHEL，企业环境常见 |
| Fedora | `dnf` | 新特性更新快 |
| Arch Linux | `pacman` | 滚动更新，适合深入学习 |
| Alpine | `apk` | 轻量，常用于容器 |

新手建议 Ubuntu LTS 或 Debian Stable。生产环境优先选择有长期安全更新的版本。

## 终端与 Shell

- **终端**：显示文本界面的程序。
- **Shell**：解释命令的程序，常见有 Bash、Zsh、Fish。
- **命令提示符**：通常显示 `user@host:~/path$`。

查看当前 Shell：

```bash
echo "$SHELL"
bash --version
```

执行命令的基本结构：

```bash
命令 [选项] [参数]
ls -lah /var/log
```

选项通常以 `-` 开头，长选项以 `--` 开头。命令区分大小写。

## 第一次登录

本地或 SSH 登录后，先确认身份与系统：

```bash
whoami
hostname
cat /etc/os-release
uname -a
uptime
```

查看磁盘与内存：

```bash
df -h
free -h
```

查看当前目录：

```bash
pwd
ls -lah
```

## 获取帮助

```bash
man ls
ls --help
apropos "copy files"
```

`man` 是系统手册。按 `/` 搜索，`q` 退出。遇到不熟悉的命令，先看帮助，再搜索。

## 软件安装

### Debian / Ubuntu

```bash
sudo apt update
sudo apt install -y nginx
sudo apt upgrade
```

### RHEL / Rocky

```bash
sudo dnf check-update
sudo dnf install -y nginx
sudo dnf update
```

不要在生产环境随意执行全量升级。先看变更说明、备份关键配置，并在测试环境验证。

## 目录结构

```text
/
├── bin -> usr/bin      基础命令
├── boot                内核与启动文件
├── dev                 设备文件
├── etc                 系统配置
├── home                用户目录
├── opt                 第三方软件
├── proc                进程与内核虚拟文件
├── root                root 用户目录
├── tmp                 临时文件
├── usr                 用户程序与库
└── var                 日志、缓存、网站数据
```

常用路径：

- 配置：`/etc`
- 日志：`/var/log`
- 网站：`/var/www`
- 用户数据：`/home/<user>`
- 临时文件：`/tmp`

## 用户与权限初探

```bash
id
sudo whoami
ls -l /etc/shadow
```

普通用户通过 `sudo` 执行管理员操作。不要长期使用 root 登录，也不要把所有文件改成 777。

## 开关机与服务

现代 Linux 使用 systemd：

```bash
systemctl status nginx
sudo systemctl start nginx
sudo systemctl enable nginx
journalctl -u nginx -n 50 --no-pager
```

关机与重启：

```bash
sudo reboot
sudo shutdown -h now
```

在生产服务器上，重启前确认业务影响与回滚方案。

## 学习建议

1. 在虚拟机、WSL 或云服务器中练习，不要直接拿生产机试命令。
2. 每学一个命令，用它解决一个真实问题。
3. 先理解管道与重定向，再学脚本。
4. 保持命令历史，定期复盘。
5. 对危险命令（`rm -rf`、`dd`、`mkfs`）保持敬畏。

:::warn 危险操作
执行 `rm -rf`、`chmod -R`、`chown -R`、`dd`、`mkfs`、`iptables -F` 前，先确认路径、备份数据，并尽量先在测试环境验证。一次误操作可能不可恢复。
:::

## 下一步

- [高频 Linux 命令](/linux/commands.html)
- [文件系统与磁盘](/linux/filesystem.html)
- [权限与用户](/linux/permissions.html)
