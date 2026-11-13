---
title: Linux 练习课
description: 用 5 道选择题和 3 个运维任务，检查命令、权限、进程、systemd 与 Shell 脚本能力。
category: linux
order: 8
practice: true
tags: [Linux, 练习, 运维, Shell]
updated: 2026-11-12
---

# Linux 练习课

建议在虚拟机或测试服务器中完成。涉及删除、权限、防火墙的命令，先在快照环境中验证。

:::quiz
question: "查看当前目录下所有文件（含隐藏文件）的详细列表，应使用？"
options:
  - "ls -lah"
  - "ls -r"
  - "cat -la"
  - "find -all"
answer: A
explain: "`-l` 长格式，`-a` 显示隐藏文件，`-h` 人类可读大小。"
:::

:::quiz
question: "目录权限中的 `x` 位主要控制什么？"
options:
  - "能否进入目录并访问其中的文件"
  - "能否读取目录内文件内容"
  - "能否修改文件所有者"
  - "能否压缩目录"
answer: A
explain: "目录的 x 位允许进入目录（cd）和访问已知路径的文件。r 允许列出目录项，w 允许增删改名。"
:::

:::quiz
question: "`kill -TERM <pid>` 与 `kill -KILL <pid>` 的关键差异是？"
options:
  - "TERM 允许进程优雅退出，KILL 强制终止"
  - "TERM 只能杀 root 进程"
  - "KILL 不会终止进程"
  - "两者完全相同"
answer: A
explain: "TERM 信号可被捕获，进程能清理资源；KILL 无法被捕获，是最后手段。"
:::

:::quiz
question: "修改 systemd unit 文件后，通常需要执行？"
options:
  - "systemctl daemon-reload"
  - "reboot -f"
  - "chmod 777 /etc"
  - "rm -rf /etc/systemd"
answer: A
explain: "daemon-reload 让 systemd 重新读取 unit 文件。仅改应用配置通常只需 restart/reload 服务。"
:::

:::quiz
question: "Shell 脚本开头 `set -euo pipefail` 的作用是？"
options:
  - "命令失败退出、未定义变量报错、管道失败可检测"
  - "自动安装依赖"
  - "让脚本以 root 运行"
  - "开启图形界面"
answer: A
explain: "`-e` 遇错退出，`-u` 未定义变量报错，`pipefail` 让管道中任一命令失败时整体失败。"
:::

## 运维任务

### 任务 1：服务部署

在 Linux 服务器上：

1. 创建非 root 用户 `deploy`。
2. 把静态站点放到 `/opt/techlearn`。
3. 启动 `server/ai_proxy.py` 或 Nginx。
4. 用 systemd 托管，设置开机自启。
5. 只监听 127.0.0.1，由 Nginx 对外。
6. 配置日志与健康检查。

### 任务 2：磁盘排查

模拟或真实环境：

1. 找出 `/var` 下占用最大的目录。
2. 找出 7 天内修改过的大于 100MB 的文件。
3. 检查是否有已删除但仍被进程占用的文件。
4. 写一份清理方案，说明风险与回滚。

### 任务 3：自动化备份

写一个 Shell 脚本：

- 备份指定目录为 `tar.gz`；
- 文件名包含日期；
- 保留最近 7 份；
- 失败时非零退出并记录日志；
- 用 systemd timer 每天运行；
- 恢复演练一次。

## 自检清单

- 能否解释文件与目录的 rwx 差异？
- 是否知道如何定位端口占用？
- 能否读懂 systemd unit 的关键字段？
- 是否会用 `set -euo pipefail` 与 `trap`？
- 是否养成了先确认路径再删除的习惯？

## 返回

- [Linux 教程首页](/linux/index.html)
- [综合测验](/exercises.html)
