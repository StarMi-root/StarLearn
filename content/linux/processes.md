---
title: Linux 进程、信号与资源排查
description: ps、top、kill、信号、后台任务、端口占用、负载与内存排查，定位服务器变慢的原因。
category: linux
order: 5
tags: [Linux, 进程, 信号, 性能, 排查]
updated: 2026-11-12
---

# Linux 进程、信号与资源排查

进程是运行中的程序。服务器变慢时，需要快速回答：谁在占 CPU？谁在占内存？哪个端口被监听？进程为什么卡住？

## 查看进程

```bash
ps aux
ps -ef
ps aux | grep nginx
pgrep -af nginx
```

`ps aux` 字段：

- `USER`：运行用户。
- `PID`：进程 ID。
- `%CPU` / `%MEM`：CPU 与内存占用。
- `STAT`：状态，`R` 运行、`S` 睡眠、`D` 不可中断、`Z` 僵尸。
- `COMMAND`：启动命令。

## 实时监控

```bash
top
htop
```

`top` 常用按键：`P` 按 CPU 排序、`M` 按内存排序、`1` 显示每核、`q` 退出。

关注：

- **load average**：1/5/15 分钟平均负载。相对 CPU 核数判断，不只看绝对值。
- **wa**：I/O 等待比例。
- **si/so**：交换分区换入换出，持续非零通常意味着内存不足。
- **zombie**：僵尸进程数量。

## 信号与 kill

```bash
kill -TERM <pid>
kill -INT <pid>
kill -HUP <pid>
kill -KILL <pid>
```

| 信号 | 含义 |
|---|---|
| `TERM` | 请求优雅退出，默认 |
| `INT` | 相当于 Ctrl+C |
| `HUP` | 重载配置（部分服务） |
| `KILL` | 强制终止，无法被捕获 |

先 `TERM`，等待进程清理资源；无效再 `KILL`。`KILL` 可能导致数据损坏或临时文件残留。

## 后台任务

```bash
sleep 300 &
jobs
fg %1
bg %1
nohup ./server > app.log 2>&1 &
disown
```

`&` 放入后台，`jobs` 查看当前 Shell 的任务。退出终端后仍要运行，使用 `nohup`、`tmux`、`screen` 或 systemd。生产服务应交给 systemd，而不是 `nohup`。

## 端口与连接

```bash
ss -tulpn
sudo ss -tulpn | grep :80
lsof -i :8080
```

- `-t` TCP，`-u` UDP，`-l` 监听，`-p` 进程，`-n` 数字显示。
- 端口被占用时，先确认进程身份，不要直接 kill 未知服务。

## 文件与进程

```bash
lsof /var/log/app.log
lsof +L1
```

`lsof +L1` 查找已删除但仍被进程占用的文件。删除大日志后磁盘未释放，通常就是这个原因。

## 跟踪系统调用

```bash
strace -p <pid>
strace -f -e trace=network ./app
```

`strace` 能看到进程卡在哪个系统调用、打开了哪些文件、连接了哪些地址。生产环境使用前注意性能影响与权限。

## 资源排查顺序

### CPU 高

```bash
top
pidstat -p <pid> 1
ps -L -p <pid> -o pid,tid,pcpu,comm
```

1. 找到高 CPU 进程。
2. 判断是业务计算、死循环还是频繁 GC。
3. 查看线程栈与日志。
4. 必要时限流、扩容或修复代码。

### 内存高

```bash
free -h
ps aux --sort=-%mem | head
smem -tk
```

区分：

- 应用真实占用；
- 文件缓存（可回收）；
- 内存泄漏；
- 交换分区使用。

OOM Killer 日志：

```bash
journalctl -k | grep -i "out of memory"
dmesg -T | grep -i oom
```

### 磁盘 I/O 高

```bash
iostat -xz 1
iotop
df -h
```

`%util` 高、`await` 大通常说明磁盘饱和。检查日志写入、数据库查询、备份任务。

### 磁盘满

```bash
df -h
sudo du -xhd1 / | sort -h
sudo find / -xdev -type f -size +500M 2>/dev/null
```

先定位，再清理。不要删除正在使用的数据库文件或系统日志。

## 服务进程

```bash
systemctl status nginx
journalctl -u nginx -n 100 --no-pager
systemctl restart nginx
```

systemd 管理的服务会自动重启、记录日志，并支持资源限制。生产环境优先使用 systemd，而不是手工启动脚本。

## 负载与容量

```bash
nproc
uptime
vmstat 1
```

如果 4 核机器 load average 长期在 8 以上，说明排队严重。结合 CPU、I/O、内存判断瓶颈，不要盲目加核。

:::tip 排查原则
先观测，再假设，再验证。不要看到高 CPU 就重启；重启会丢失现场，问题可能很快复发。保留日志、指标与复现步骤。
:::

## 小练习

1. 启动一个占用 CPU 的进程，用 `top` 找到它并用 `TERM` 结束。
2. 找出监听 8080 端口的进程与启动用户。
3. 模拟删除一个被进程打开的大文件，观察 `df` 与 `lsof +L1`。

## 下一步

- [systemd 服务管理](/linux/systemd.html)
- [Shell 脚本](/linux/shell.html)
- [服务器监控](/server/monitoring.html)
