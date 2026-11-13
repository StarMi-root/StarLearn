---
title: systemd 服务管理
description: 编写 unit 文件、管理服务、查看 journal 日志、配置环境变量、定时器与安全加固。
category: linux
order: 6
tags: [Linux, systemd, 服务, journalctl]
updated: 2026-11-12
---

# systemd 服务管理

systemd 是现代 Linux 的初始化系统和服务管理器。它负责开机启动、服务守护、日志收集、定时任务和资源控制。

## 基本命令

```bash
systemctl status nginx
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl reload nginx
sudo systemctl enable nginx
sudo systemctl disable nginx
systemctl list-units --type=service
```

- `enable` 设置开机自启，不会立即启动。
- `start` 立即启动，不会设置开机自启。
- `reload` 重新加载配置，是否支持取决于服务。
- `restart` 会中断连接，生产环境注意滚动与健康检查。

## 编写 service

创建 `/etc/systemd/system/techlearn.service`：

```ini
[Unit]
Description=StarLearn TechLearn AI Proxy
After=network.target

[Service]
Type=simple
User=techlearn
Group=techlearn
WorkingDirectory=/opt/techlearn
Environment="SITE_DIR=/opt/techlearn/dist"
Environment="HOST=127.0.0.1"
Environment="PORT=8080"
EnvironmentFile=-/etc/techlearn/ai.env
ExecStart=/usr/bin/python3 /opt/techlearn/server/ai_proxy.py
Restart=on-failure
RestartSec=3
TimeoutStopSec=15

NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/techlearn

[Install]
WantedBy=multi-user.target
```

重载并启动：

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now techlearn
sudo systemctl status techlearn
```

`EnvironmentFile` 使用 `-` 前缀表示文件不存在也不报错。敏感变量放在 `/etc/techlearn/ai.env`，权限设为 600。

## 日志

```bash
journalctl -u techlearn -n 100 --no-pager
journalctl -u techlearn -f
journalctl -u techlearn --since "1 hour ago"
journalctl -p err -b
journalctl --disk-usage
sudo journalctl --vacuum-time=14d
```

应用应输出结构化日志到 stdout/stderr，由 journald 收集。不要在 unit 里把日志重定向到随意文件，除非有明确的日志轮转方案。

## 环境变量

```bash
sudo mkdir -p /etc/techlearn
sudo tee /etc/techlearn/ai.env >/dev/null <<'ENV'
AI_API_BASE=https://api.deepseek.com/v1
AI_API_KEY=sk-xxxx
AI_MODEL=deepseek-chat
ENV
sudo chmod 600 /etc/techlearn/ai.env
sudo chown root:root /etc/techlearn/ai.env
```

修改后：

```bash
sudo systemctl restart techlearn
```

不要把密钥写进 unit 文件或 Git 仓库。

## 定时器

比 cron 更现代的方式是 systemd timer。

`/etc/systemd/system/backup.service`：

```ini
[Unit]
Description=Backup TechLearn data

[Service]
Type=oneshot
User=deploy
ExecStart=/opt/techlearn/scripts/backup.sh
```

`/etc/systemd/system/backup.timer`：

```ini
[Unit]
Description=Run backup daily

[Timer]
OnCalendar=*-*-* 03:30:00
Persistent=true

[Install]
WantedBy=timers.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now backup.timer
systemctl list-timers
journalctl -u backup.service -n 50
```

`Persistent=true` 会在停机期间错过任务后补跑一次。

## 资源限制

```ini
[Service]
MemoryMax=512M
CPUQuota=50%
TasksMax=200
LimitNOFILE=65535
```

限制能防止单个服务拖垮整机，但要先测量正常峰值。限制过紧会导致服务被 OOM 或拒绝连接。

## 安全加固

常用选项：

- `NoNewPrivileges=true`：禁止提权。
- `PrivateTmp=true`：独立 `/tmp`。
- `ProtectSystem=strict`：系统目录只读。
- `ProtectHome=true`：隐藏家目录。
- `ReadWritePaths=`：只开放必要写入路径。
- `PrivateDevices=true`：限制设备访问。
- `RestrictAddressFamilies=AF_INET AF_INET6`：限制网络协议。

修改后用 `systemd-analyze security techlearn` 查看评分，但不要为了分数牺牲可用性。

## 常见问题

**服务启动失败**：看 `systemctl status` 与 `journalctl -u` 的完整错误，检查路径、权限、环境变量和端口。

**改了 unit 不生效**：执行 `systemctl daemon-reload`。

**端口被占用**：`ss -tulpn | grep :8080`，确认旧进程或另一个服务。

**服务反复重启**：设置 `RestartSec`，先看日志定位根因，不要无限快速重启。

**开机没启动**：确认 `enable`，检查依赖顺序与网络就绪。

:::tip 生产建议
应用只监听 127.0.0.1，由 Nginx 对外提供 HTTPS；服务使用非 root 用户；日志进入 journald；配置用 EnvironmentFile；部署脚本可重复执行。
:::

## 小练习

1. 把一个 Python HTTP 服务写成 systemd unit。
2. 配置每日备份 timer，并手动触发一次。
3. 用 `systemd-analyze security` 检查并收紧服务权限。

## 下一步

- [Shell 脚本](/linux/shell.html)
- [服务器初始化](/server/setup.html)
- [Nginx 反向代理](/server/nginx.html)
