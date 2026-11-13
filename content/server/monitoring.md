---
title: 监控、日志与备份
description: 健康检查、日志轮转、磁盘告警、备份恢复、Uptime 监控与事故响应，让站点上线后可持续运行。
category: server
order: 7
tags: [监控, 日志, 备份, 告警, 运维]
updated: 2026-11-12
---

# 监控、日志与备份

上线不是终点。没有监控的站点就像没有仪表盘的汽车：出问题时只能等用户告诉你。

## 监控分层

| 层次 | 关注 | 工具 |
|---|---|---|
| 可用性 | 站点是否能访问 | Uptime Kuma、外部探针 |
| 资源 | CPU、内存、磁盘、网络 | node_exporter、Netdata |
| 应用 | 请求量、延迟、错误率 | 日志、APM、Prometheus |
| 业务 | 注册、支付、AI 调用成本 | 指标埋点 |
| 安全 | 登录失败、异常流量 | fail2ban、审计日志 |

先做最关键的：外部可用性、磁盘、内存、HTTP 5xx、证书到期。

## 健康检查

```bash
curl -fsS https://learn.example.com/api/health
```

返回 200 且 JSON 中 `ok: true` 才算健康。健康检查不应依赖缓慢的外部服务，否则会把整个站点判死。

systemd 与 Docker 都可以配置健康检查，Nginx 可做被动检查。外部监控应放在另一台机器或第三方服务，避免“服务器挂了监控也挂了”。

## 日志

```bash
journalctl -u techlearn --since "1 hour ago"
journalctl -p err -b
sudo tail -f /var/log/nginx/error.log
```

应用日志建议结构化输出到 stdout/stderr：

```json
{"time":"2026-11-12T10:00:00Z","level":"error","msg":"upstream timeout","path":"/api/chat","status":504}
```

不要在日志中记录密码、Token、完整请求体或用户隐私。

## 日志轮转

`/etc/logrotate.d/techlearn`：

```text
/var/log/techlearn/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        systemctl reload nginx >/dev/null 2>&1 || true
    endscript
}
```

验证：

```bash
sudo logrotate -d /etc/logrotate.d/techlearn
```

## 磁盘告警

磁盘满是常见故障。至少监控：

- 根分区使用率 > 80% 预警，> 90% 严重。
- inode 使用率。
- 日志目录增长速度。
- 备份是否成功。

```bash
df -h
df -i
du -xhd1 /var | sort -h
```

## 备份

3-2-1 原则：至少 3 份副本、2 种介质、1 份异地。

静态站备份：

```bash
#!/usr/bin/env bash
set -euo pipefail

BASE="/opt/techlearn"
BACKUP="/var/backups/techlearn"
STAMP="$(date +%Y%m%d%H%M%S)"
mkdir -p "$BACKUP"

tar -czf "$BACKUP/site-$STAMP.tar.gz" \
  -C "$BASE" current shared

find "$BACKUP" -name 'site-*.tar.gz' -mtime +14 -delete
```

数据库备份：

```bash
pg_dump -Fc "$DATABASE_URL" > "/var/backups/db-$STAMP.dump"
```

MySQL：

```bash
mysqldump --single-transaction --routines --triggers "$DB" > "/var/backups/db-$STAMP.sql"
```

备份文件也要加密并限制权限。上传到对象存储时使用独立凭证。

## 恢复演练

备份的价值在于能恢复。每季度至少演练一次：

```bash
mkdir -p /tmp/restore
tar -xzf /var/backups/techlearn/site-20261112.tar.gz -C /tmp/restore
ls -la /tmp/restore
# 用测试站点验证首页、文章、API 与下载
```

没有恢复演练的备份只能算“可能有用”。

## 告警

告警要可执行：

- 告警名称：`Disk usage > 90% on web-1`
- 影响：日志无法写入，Nginx 可能失败
- 处理：清理日志、扩容磁盘、检查异常写入
- 负责人：ops

避免所有指标都告警。设置抑制与分组，防止告警风暴。至少配置：

- 站点连续 3 次探测失败；
- 磁盘 > 90%；
- 证书 14 天内到期；
- 5xx 比例异常；
- 备份任务失败。

## systemd 定时任务

```bash
systemctl list-timers
journalctl -u backup.service -n 100
```

失败任务应有告警，而不是只写日志。可接入 Uptime Kuma 的 push 心跳：备份成功后上报，超时未上报则告警。

## 事故响应

1. **确认影响**：哪些页面/接口不可用，影响多少用户。
2. **止血**：回滚、切流量、扩容、关闭异常功能。
3. **保留现场**：日志、指标、进程状态。
4. **定位根因**：不要停留在“重启好了”。
5. **修复与验证**：补测试、监控与文档。
6. **复盘**：时间线、原因、改进项与负责人。

## 安全监控

```bash
sudo journalctl -u ssh --since "24 hours ago" | grep -i failed
sudo fail2ban-client status
sudo last -a | head
```

定期检查异常登录、异常进程、开放端口与 sudo 记录。

:::tip 从最小监控开始
先接一个外部 Uptime 探针 + 磁盘告警 + 每日备份，比一次性搭建复杂可观测平台更有效。稳定后再逐步增加指标。
:::

## 小练习

1. 为站点配置外部 HTTP 监控与证书到期提醒。
2. 配置日志轮转并验证旧日志被压缩。
3. 完成一次完整备份与恢复演练，记录耗时。

## 下一步

- [CI/CD](/server/cicd.html)
- [Linux 进程排查](/linux/processes.html)
- [SSH 安全加固](/ssh/hardening.html)
