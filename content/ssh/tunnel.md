---
title: SSH 端口转发、跳板机与文件传输
description: 本地/远程/动态转发、ProxyJump、scp、rsync、sftp 与自动重连，把 SSH 变成安全的网络通道。
category: ssh
order: 3
tags: [SSH, 端口转发, ProxyJump, rsync, 隧道]
updated: 2026-11-12
---

# SSH 端口转发、跳板机与文件传输

SSH 不只是登录。它能把远程端口映射到本地、把本地服务暴露给远程，或通过跳板机访问内网。

## 本地转发

把远程服务映射到本地：

```bash
ssh -L 8080:127.0.0.1:80 deploy@server
```

访问 `http://127.0.0.1:8080`，流量经 SSH 到服务器的 80 端口。

语法：

```text
-L [本地地址:]本地端口:目标主机:目标端口
```

适合：

- 访问服务器上只监听 127.0.0.1 的数据库；
- 调试远程 Web 服务；
- 通过 SSH 访问内网管理界面。

```bash
ssh -N -L 5432:127.0.0.1:5432 deploy@server
```

`-N` 不执行远程命令，只建立转发。

## 远程转发

把本地服务暴露到远程：

```bash
ssh -R 9000:127.0.0.1:3000 deploy@server
```

远程服务器访问 `127.0.0.1:9000` 会转发到你的本地 3000。适合临时演示，但不要把开发机暴露给不可信服务器。

默认远程转发只绑定远程的 `127.0.0.1`。需要外部访问时（危险）：

```bash
ssh -R 0.0.0.0:9000:127.0.0.1:3000 deploy@server
```

同时服务器需允许 `GatewayPorts`。

## 动态转发

把 SSH 当作 SOCKS5 代理：

```bash
ssh -D 1080 -N deploy@server
```

浏览器或工具配置 `socks5://127.0.0.1:1080`，流量通过服务器出口。仅用于合法合规的远程访问，不要用来绕过组织安全策略。

## 跳板机

直接连接内网机器：

```bash
ssh -J jump@bastion deploy@10.0.0.15
```

等价于先连跳板机，再从跳板机连目标。`~/.ssh/config` 更清晰：

```sshconfig
Host bastion
    HostName bastion.example.com
    User jump
    IdentityFile ~/.ssh/id_ed25519

Host internal
    HostName 10.0.0.15
    User deploy
    ProxyJump bastion
    IdentityFile ~/.ssh/id_ed25519
```

```bash
ssh internal
```

跳板机应只允许必要用户与转发，不应存放业务数据。

## 保持连接

```sshconfig
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3
    TCPKeepAlive yes
```

自动重连工具 `autossh`：

```bash
autossh -M 0 -N -L 5432:127.0.0.1:5432 deploy@server
```

生产隧道建议由 systemd 管理，并监控健康状态。

## scp

```bash
scp file.tar.gz deploy@server:/tmp/
scp -r ./dist deploy@server:/var/www/site/
scp deploy@server:/var/log/app.log ./
scp -P 2222 file deploy@server:/tmp/
```

`scp` 简单但大量小文件较慢，不支持增量。

## rsync

```bash
rsync -avz --progress ./dist/ deploy@server:/var/www/site/
rsync -avz --delete ./dist/ deploy@server:/var/www/site/
rsync -avz --exclude node_modules ./project/ deploy@server:/opt/project/
```

- `-a` 归档模式，保留权限与时间。
- `-v` 详细输出，`-z` 压缩。
- `--delete` 删除目标中源不存在的文件，使用前先 `--dry-run`。

```bash
rsync -avz --delete --dry-run ./dist/ deploy@server:/var/www/site/
```

## sftp

```bash
sftp deploy@server
```

```text
pwd
ls
get remote.txt
put local.txt
mkdir uploads
cd uploads
bye
```

适合交互式小文件操作。批量同步仍用 rsync。

## 安全边界

- 只转发必要端口，用完关闭。
- 不要把数据库端口长期暴露到公网。
- 远程转发可能绕过防火墙，服务器应限制。
- 跳板机开启审计与最小权限。
- 隧道进程使用专用用户与 systemd 限制。
- 不要把 `agent forwarding` 开到不可信主机。

关于 agent forwarding：远程主机可临时使用你的私钥签名。不可信服务器上应使用 `ssh -A` 之外的方式，或改用 ProxyJump。

:::warn 隧道不是 VPN
SSH 隧道适合单端口临时访问，不提供完整网络隔离与访问控制。多服务、多用户场景应使用 WireGuard、Tailscale 或企业 VPN。
:::

## 常见问题

**Local port already in use**：本地端口被占用，换端口或找到占用进程。

**channel open failed**：远程目标地址/端口错误，或服务器禁止转发。

**Permission denied (publickey)**：跳板机或目标机密钥未配置。分别测试 `ssh bastion` 与 `ssh internal`。

**连接一会儿就断**：网络 NAT 超时，配置 `ServerAliveInterval`。

**rsync 删除了文件**：`--delete` 方向或路径写错。先用 `--dry-run`，并确保源目录正确。

## 小练习

1. 用本地转发访问服务器上的 127.0.0.1 服务。
2. 配置 ProxyJump 通过跳板机登录内网主机。
3. 用 rsync `--dry-run` 预览一次发布，再实际同步。

## 下一步

- [SSH 安全加固](/ssh/hardening.html)
- [服务器初始化](/server/setup.html)
