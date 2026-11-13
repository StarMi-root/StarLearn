---
title: SSH 安全加固
description: 禁用密码与 root 登录、限制用户与来源、配置 fail2ban、审计日志与密钥轮换，降低服务器被入侵风险。
category: ssh
order: 4
tags: [SSH, 安全, fail2ban, 加固, 审计]
updated: 2026-11-12
---

# SSH 安全加固

公网 SSH 每天都会遭遇扫描与暴力破解。加固的目标是：只允许必要的人、用安全的方式、留下可审计的记录。

## 加固前准备

1. 确认至少一个普通用户可用密钥登录。
2. 确认该用户能 `sudo`。
3. 保留当前已登录会话。
4. 准备云控制台 VNC/救援模式作为后路。
5. 备份 SSH 配置。

```bash
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak
```

## 推荐配置

创建 `/etc/ssh/sshd_config.d/99-hardening.conf`：

```ini
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
MaxSessions 5
LoginGraceTime 30
ClientAliveInterval 300
ClientAliveCountMax 2
AllowUsers deploy
```

说明：

- `PermitRootLogin no`：禁止 root 直接登录。
- `PasswordAuthentication no`：只允许密钥。
- `AllowUsers`：白名单，按实际用户调整。
- `LoginGraceTime`：限制认证窗口。

检查并重载：

```bash
sudo sshd -t
sudo systemctl reload ssh
```

另开终端验证新登录，成功后再关闭旧会话。

## 使用 Include 目录

现代 OpenSSH 通常包含：

```ini
Include /etc/ssh/sshd_config.d/*.conf
```

把自定义配置放在 `sshd_config.d`，升级时更容易管理。注意文件名排序，后面的配置可能覆盖前面的。

## 防火墙限制来源

如果管理 IP 固定，可只允许该 IP：

```bash
sudo ufw allow from 203.0.113.50 to any port 22 proto tcp
sudo ufw delete allow 22/tcp
```

云安全组同样限制。动态 IP 场景可使用 VPN 或跳板机，而不是对全世界开放 22。

## 修改端口

```ini
Port 2222
```

修改后同步防火墙与云安全组，并更新客户端配置。改端口只能减少自动化扫描噪音，不能替代密钥认证与 fail2ban。

## fail2ban

安装：

```bash
sudo apt install -y fail2ban
```

`/etc/fail2ban/jail.local`：

```ini
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5
backend = systemd

[sshd]
enabled = true
port = ssh
logpath = %(sshd_log)s
```

如果改了 SSH 端口，`port` 要对应修改。启动：

```bash
sudo systemctl enable --now fail2ban
sudo fail2ban-client status sshd
```

查看封禁：

```bash
sudo fail2ban-client status sshd
sudo fail2ban-client set sshd unbanip 203.0.113.99
```

不要把自己办公 IP 封了。必要时配置 `ignoreip`。

## 审计登录

```bash
last -a | head
lastb | head
sudo journalctl -u ssh --since "7 days ago" | grep -i failed
sudo grep "Accepted publickey" /var/log/auth.log | tail
```

关注：

- 异常来源 IP；
- 非工作时间登录；
- 失败后成功的爆破痕迹；
- 新增的 `authorized_keys`；
- sudo 提权记录。

```bash
sudo find / -name authorized_keys -type f 2>/dev/null
sudo grep -R "ssh-" /root /home 2>/dev/null
```

## 双因素认证

高风险环境可增加 TOTP：

```bash
sudo apt install -y libpam-google-authenticator
google-authenticator
```

在 PAM 与 sshd 中启用 `AuthenticationMethods publickey,keyboard-interactive`。配置复杂，务必先在测试环境验证，避免锁死。

## 密钥与用户生命周期

- 每人独立密钥，不共享。
- 部署密钥限制仓库与命令。
- 离职立即删除公钥与账号。
- 定期检查 `authorized_keys` 与 sudoers。
- 私钥设置 passphrase，并存放在受保护设备。
- CI 密钥定期轮换。

```bash
sudo userdel -r olduser
sudo find /home -name authorized_keys -exec ls -l {} \;
```

## 其他服务

SSH 加固不是全部。还需要：

- 及时安装安全更新；
- 数据库/Redis 不暴露公网；
- Web 应用最小权限运行；
- 配置日志与告警；
- 定期备份并验证恢复；
- 使用 HTTPS。

## 应急响应

怀疑入侵时：

1. 保留现场，不要急着重装。
2. 从控制台或带外方式隔离网络。
3. 检查登录记录、进程、网络连接、定时任务与公钥。
4. 轮换所有凭证与密钥。
5. 从可信备份恢复，修补入口。
6. 复盘并加强监控。

```bash
sudo ss -tulpn
sudo ps auxf
crontab -l
sudo crontab -l
sudo systemctl list-units --type=service
```

:::danger 不要锁死自己
禁用密码登录前，必须确认密钥登录成功；修改防火墙前，必须保留云控制台访问。生产服务器的一次误配置可能造成长时间中断。
:::

## 加固检查清单

- [ ] root 禁止直接登录
- [ ] 密码认证关闭
- [ ] 普通用户密钥登录验证成功
- [ ] 防火墙限制 SSH 来源
- [ ] fail2ban 正常运行
- [ ] 登录日志有监控
- [ ] 密钥与账号生命周期明确
- [ ] 有带外救援方案

## 小练习

1. 在测试机上完成密钥登录并禁用密码认证。
2. 配置 fail2ban，模拟失败登录观察封禁。
3. 审计一次 `authorized_keys` 与 SSH 登录日志。

## 下一步

- [SSH 练习课](/ssh/practice.html)
- [服务器初始化](/server/setup.html)
- [监控与日志](/server/monitoring.html)
