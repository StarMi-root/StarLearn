---
title: Linux 服务器初始化
description: 从购买 VPS 到创建非 root 用户、配置 SSH、防火墙、Swap、时区与自动安全更新，搭好可上线的服务器底座。
category: server
order: 1
tags: [服务器, VPS, 安全, Ubuntu, 初始化]
updated: 2026-11-12
---

# Linux 服务器初始化

一台刚购买的云服务器通常只开放 SSH，系统也是最简状态。上线前应完成用户、网络、防火墙、更新和目录规划，避免把“能登录”误当成“可生产”。

![服务器与部署示意（开源图标：Simple Icons CC0 / Lucide ISC）](/static/img/icons/lu-globe.svg)

## 选择服务器

| 类型 | 适合 | 注意 |
|---|---|---|
| 虚拟主机 | 纯静态站、预算低 | 控制权有限 |
| VPS | 博客、API、学习环境 | 需要自己运维 |
| 云服务器 | 生产业务、弹性扩容 | 成本与配置复杂 |
| 静态托管 | 文档、官网 | 无后端与密钥能力 |

学习部署建议 1–2 核、2 GB 内存起步；运行本地大模型则需要更多内存或 GPU。选择离用户近的地域，并确认备份、快照和流量计费规则。

## 首次登录

```bash
ssh root@203.0.113.10
```

首次登录后先更新系统信息：

```bash
cat /etc/os-release
uname -a
df -h
free -h
```

## 创建普通用户

不要长期用 root 操作：

```bash
adduser deploy
usermod -aG sudo deploy
```

复制 SSH 公钥：

```bash
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy/
```

或手动：

```bash
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys
```

另开一个终端验证：

```bash
ssh deploy@203.0.113.10
sudo whoami
```

确认新用户可登录且 sudo 正常后，再考虑禁用 root 登录。

## SSH 基线

编辑 `/etc/ssh/sshd_config.d/99-hardening.conf`：

```ini
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
```

先检查配置再重载：

```bash
sudo sshd -t
sudo systemctl reload ssh
```

不要在没有验证密钥登录的情况下直接关闭密码登录，否则可能把自己锁在门外。详细见 [SSH 安全加固](/ssh/hardening.html)。

## 防火墙

Ubuntu 使用 UFW：

```bash
sudo apt update
sudo apt install -y ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status verbose
```

云厂商还有安全组，两层都要放行。数据库、Redis、内部 API 端口不要对公网开放。

Rocky / AlmaLinux 可使用 `firewalld`：

```bash
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## 时区与时间同步

```bash
sudo timedatectl set-timezone Asia/Shanghai
timedatectl
sudo systemctl enable --now systemd-timesyncd
```

时间不准会导致 TLS、日志和数据库事务异常。确认 NTP 同步状态。

## 自动安全更新

Ubuntu：

```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

只自动安装安全更新，业务组件升级仍需测试。生产环境配置维护窗口与告警。

## Swap

小内存机器可以增加 Swap 防止突发 OOM，但不要把 Swap 当内存用：

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
free -h
```

云服务器也可使用云盘或 zram。数据库和高并发服务应优先增加真实内存。

## 目录规划

```text
/opt/techlearn/
├── current -> releases/20261112120000
├── releases/
├── shared/
│   ├── ai.env
│   └── data/
└── scripts/
```

应用、配置、数据和日志分离。代码目录可重复部署，数据目录必须持久化并备份。

## 基础软件

```bash
sudo apt install -y git curl unzip nginx python3 ufw fail2ban \
  htop tree jq ripgrep
```

按需安装 Docker、数据库与运行时。不要安装一堆用不到的服务，每个服务都是攻击面。

## 基础检查

```bash
# 监听端口
sudo ss -tulpn

# 登录失败记录
sudo journalctl -u ssh --since "24 hours ago" | grep -i failed

# 磁盘与内存
df -h
free -h

# 服务状态
systemctl --failed
```

## 上线检查清单

- [ ] 普通用户可密钥登录，sudo 正常
- [ ] root 密码登录已禁用
- [ ] 防火墙只开放必要端口
- [ ] 系统与安全更新已配置
- [ ] 时区与 NTP 正确
- [ ] 有 Swap 或足够内存
- [ ] 数据目录与备份策略明确
- [ ] 监控与告警至少覆盖磁盘、内存、HTTP

:::warn 不要跳过验证
每次改 SSH、防火墙、fstab，都先保留一个已登录会话，另开终端验证。配置错误可能让服务器无法再连接。
:::

## 下一步

- [Nginx 静态托管与反向代理](/server/nginx.html)
- [HTTPS 与证书](/server/https.html)
- [Docker 部署](/server/docker.html)
