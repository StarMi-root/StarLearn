---
title: Linux 权限、用户与 sudo
description: 读写执行权限、chmod、chown、umask、特殊权限、用户组与 sudo 配置，守住服务器安全边界。
category: linux
order: 4
tags: [Linux, 权限, chmod, sudo, 用户]
updated: 2026-11-12
---

# Linux 权限、用户与 sudo

权限控制决定谁能读、写、执行文件。服务器被入侵的常见原因之一，就是权限过宽、密钥泄露或服务以 root 运行。

## 查看权限

```bash
ls -l
```

```text
-rw-r--r-- 1 alice devs 1234 Nov 12 10:00 notes.md
drwxr-xr-x 2 alice devs 4096 Nov 12 10:00 docs
lrwxrwxrwx 1 alice devs    8 Nov 12 10:00 link -> notes.md
```

十位字符：

```text
- rw- r-- r--
│  │   │   └── 其他人权限
│  │   └────── 所属组权限
│  └────────── 所有者权限
└───────────── 文件类型：- 文件，d 目录，l 链接
```

## rwx 的含义

| 权限 | 文件 | 目录 |
|---|---|---|
| `r` | 读取内容 | 列出目录项 |
| `w` | 修改内容 | 增删改名文件 |
| `x` | 执行 | 进入目录、访问其中文件 |

目录的 `x` 非常关键：没有执行权限，即使知道文件名也无法访问。

## chmod

数字表示：

```bash
chmod 644 file.txt   # rw-r--r--
chmod 755 script.sh  # rwxr-xr-x
chmod 600 id_rsa     # rw-------
chmod 700 ~/.ssh     # rwx------
```

符号表示：

```bash
chmod u+x script.sh
chmod g-w file.txt
chmod o=r file.txt
chmod -R u+rwX,go-w dir/
```

大写 `X` 只给目录和已有执行位的文件加执行权限，适合递归处理目录。

## chown 与 chgrp

```bash
sudo chown alice file.txt
sudo chown alice:devs file.txt
sudo chgrp devs file.txt
sudo chown -R www-data:www-data /var/www/site
```

递归修改前确认目录范围。`/var/www` 下可能有上传目录需要写权限，但不应该让整个站点可写。

## umask

新建文件的默认权限由 `umask` 决定：

```bash
umask
umask 027
```

常见 umask：

- `022`：文件 644，目录 755。
- `027`：文件 640，目录 750。
- `077`：仅本人访问。

个人 SSH 与密钥文件建议 `700` 目录、`600` 私钥。

## 特殊权限

- **SUID**：执行时以文件所有者身份运行，如 `passwd`。
- **SGID**：目录中新文件继承组。
- **Sticky Bit**：只有文件所有者或 root 能删除，如 `/tmp`。

```bash
chmod 4755 program
chmod 2775 shared-dir
chmod 1777 /tmp
```

不要随意给脚本设置 SUID。SUID root 程序一旦有漏洞，可能直接导致提权。

## 用户与组

```bash
sudo useradd -m -s /bin/bash alice
sudo passwd alice
sudo usermod -aG sudo alice
groups alice
id alice
```

删除用户前先备份其数据：

```bash
sudo userdel -r alice
```

`-r` 会删除家目录与邮件，确认后再执行。

## sudo

```bash
sudo -l
sudo -u www-data whoami
sudo visudo
```

`/etc/sudoers` 必须用 `visudo` 编辑，避免语法错误锁死 sudo。最小授权示例：

```sudoers
deploy ALL=(ALL) NOPASSWD: /bin/systemctl restart techlearn, /bin/systemctl status techlearn
```

只允许特定命令，比 `ALL=(ALL) ALL` 安全得多。

## SSH 权限

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
```

SSH 对权限非常敏感。`authorized_keys` 或家目录权限过宽时，公钥登录会被拒绝。

## 服务账户

Web 服务不应以 root 运行：

```bash
sudo useradd --system --no-create-home --shell /usr/sbin/nologin techlearn
sudo chown -R techlearn:techlearn /opt/techlearn
```

systemd 中可以进一步限制文件系统与能力：

```ini
User=techlearn
Group=techlearn
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/techlearn/data
```

## 安全基线

- 禁用 root 密码 SSH 登录。
- 使用密钥认证，私钥不落地服务器。
- 最小权限运行服务。
- 定期审计 sudo 与 SUID 文件。
- 不给网站目录 777。
- 敏感配置仅 root 可读。

```bash
sudo find / -perm -4000 -type f 2>/dev/null
```

:::danger 777 不是解决方案
遇到权限错误就 `chmod -R 777`，等于把门锁拆掉。先确认运行用户、目录归属和最小权限，再精准修复。
:::

## 小练习

1. 创建用户 `deploy`，只允许其重启指定 systemd 服务。
2. 解释 `chmod 750` 对文件与目录的不同效果。
3. 找出系统中所有 SUID 文件，并判断哪些是合理的。

## 下一步

- [进程与资源](/linux/processes.html)
- [systemd 服务管理](/linux/systemd.html)
- [SSH 安全加固](/ssh/hardening.html)
