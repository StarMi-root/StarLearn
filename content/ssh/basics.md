---
title: SSH 远程登录基础
description: 理解 SSH 加密登录流程、主机指纹、端口与用户，完成首次连接、常见排错和基础文件传输。
category: ssh
order: 1
tags: [SSH, 远程登录, 主机指纹, 排错]
updated: 2026-11-12
---

# SSH 远程登录基础

SSH（Secure Shell）通过加密通道登录远程服务器、执行命令和传输文件。它是 Linux 运维最基础也最重要的入口。

## 连接语法

```bash
ssh [选项] [用户@]主机
```

```bash
ssh deploy@203.0.113.10
ssh deploy@learn.example.com -p 2222
ssh -i ~/.ssh/id_ed25519 deploy@server
```

默认端口 22。首次连接会提示确认主机指纹：

```text
The authenticity of host 'server (203.0.113.10)' can't be established.
ED25519 key fingerprint is SHA256:...
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

核对指纹来源（云控制台、管理员提供的值）后输入 `yes`。不要无脑接受未知指纹，中间人攻击正是利用这一步。

## SSH 登录过程

1. 客户端与服务器协商加密算法。
2. 服务器出示主机密钥，客户端验证 `known_hosts`。
3. 用户通过密码或公钥认证。
4. 建立加密会话，执行 Shell 或命令。

密码认证可被暴力破解；公钥认证更适合服务器。生产环境应关闭密码登录。

## 安装

客户端：

```bash
# Ubuntu / Debian
sudo apt install -y openssh-client

# macOS 自带 ssh
ssh -V
```

服务器：

```bash
sudo apt install -y openssh-server
sudo systemctl status ssh
sudo systemctl enable ssh
```

Rocky / AlmaLinux 服务名通常是 `sshd`：

```bash
sudo systemctl status sshd
```

## 基础命令

```bash
ssh user@host                 # 登录
ssh user@host "uptime"        # 执行单条命令
ssh user@host -- ls -lah      # 参数含空格时使用 --
ssh -v user@host              # 调试连接
ssh -p 2222 user@host         # 指定端口
ssh -t user@host sudo apt update  # 分配 TTY
```

退出远程会话：`exit` 或 `Ctrl+D`。

## 文件传输

```bash
scp local.txt user@host:/tmp/
scp user@host:/var/log/app.log ./
scp -r ./dist user@host:/var/www/site/
```

大量文件优先使用 rsync：

```bash
rsync -avz --progress ./dist/ user@host:/var/www/site/
```

注意源路径结尾斜杠：`dist/` 同步内容，`dist` 同步目录本身。

## SSH 配置目录

```text
~/.ssh/
├── config             客户端配置
├── known_hosts        已信任主机密钥
├── id_ed25519         私钥（600）
└── id_ed25519.pub     公钥（644）
```

权限：

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
chmod 600 ~/.ssh/config
```

权限过宽时，SSH 会拒绝使用密钥。

## 客户端配置

`~/.ssh/config`：

```sshconfig
Host learn
    HostName learn.example.com
    User deploy
    Port 22
    IdentityFile ~/.ssh/id_ed25519
    ServerAliveInterval 60
    ServerAliveCountMax 3

Host *
    AddKeysToAgent yes
    IdentitiesOnly yes
```

之后只需：

```bash
ssh learn
scp file learn:/tmp/
```

使用 `ssh -G learn` 查看最终生效配置。

## 主机密钥变化

如果收到：

```text
WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!
```

说明服务器主机密钥变化。可能是重装系统、换 IP，也可能是中间人攻击。先确认原因，再删除旧记录：

```bash
ssh-keygen -R learn.example.com
```

不要直接关闭 `StrictHostKeyChecking`。

## 常见问题

**Connection refused**：SSH 服务未启动、端口错误、防火墙拦截。检查 `systemctl status ssh`、`ss -tulpn | grep :22`、云安全组。

**Connection timed out**：网络不通、IP 错误、安全组未放行。先 `ping` 与 `nc -vz host 22`。

**Permission denied (publickey)**：公钥未加入 `authorized_keys`、权限错误、用户名错误。用 `ssh -vvv` 查看认证过程。

**Too many authentication failures**：agent 中密钥太多。配置 `IdentitiesOnly yes` 并指定 `IdentityFile`。

**登录后立刻断开**：家目录权限、Shell 配置或磁盘满。查看服务器 `/var/log/auth.log` 与 `journalctl -u ssh`。

:::warn 保留后路
修改 SSH 配置时保持一个已登录会话，另开终端测试。确认新配置可用后再退出，避免把自己锁在服务器外。
:::

## 小练习

1. 用密钥登录一台测试服务器，并配置 `~/.ssh/config` 别名。
2. 用 `ssh -v` 观察一次完整认证过程。
3. 用 scp 与 rsync 各传输一次目录，比较差异。

## 下一步

- [SSH 密钥与 config](/ssh/keys.html)
- [端口转发与文件传输](/ssh/tunnel.html)
- [SSH 安全加固](/ssh/hardening.html)
