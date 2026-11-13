---
title: SSH 练习课
description: 用 5 道选择题和 3 个远程运维任务，检查登录、密钥、转发、跳板机与安全加固。
category: ssh
order: 5
practice: true
tags: [SSH, 练习, 密钥, 隧道]
updated: 2026-11-12
---

# SSH 练习课

请在两台测试机或云服务器上完成。修改 SSH 配置前保留一个已登录会话，避免锁死。

:::quiz
question: "SSH 公钥认证时，私钥应该放在哪里？"
options:
  - "只保存在客户端，并设置严格权限"
  - "上传到服务器 /tmp"
  - "提交到 Git 仓库"
  - "写入网页 HTML"
answer: A
explain: "私钥只留在客户端，公钥放到服务器 authorized_keys。私钥泄露等同于身份泄露。"
:::

:::quiz
question: "`ssh -L 8080:127.0.0.1:80 server` 的作用是？"
options:
  - "把本地 8080 转发到服务器的 80"
  - "把服务器 8080 转发到本地 80"
  - "修改服务器端口为 8080"
  - "关闭 SSH 服务"
answer: A
explain: "-L 是本地转发，访问本地 8080 会通过 SSH 隧道到达服务器上监听 127.0.0.1:80 的服务。"
:::

:::quiz
question: "通过跳板机连接内网主机，推荐使用？"
options:
  - "ProxyJump"
  - "关闭主机密钥检查"
  - "把内网机暴露到公网"
  - "共享 root 密码"
answer: A
explain: "ProxyJump 让 SSH 先连跳板机再连目标，避免把内网服务直接暴露公网。"
:::

:::quiz
question: "`PasswordAuthentication no` 的作用是？"
options:
  - "禁止密码认证，只允许公钥等方式"
  - "禁止所有登录"
  - "自动生成密钥"
  - "关闭防火墙"
answer: A
explain: "关闭密码认证能显著降低暴力破解风险，但必须确认公钥登录可用后再启用。"
:::

:::quiz
question: "`rsync --delete` 使用前最应该做什么？"
options:
  - "先用 --dry-run 预览"
  - "直接在生产运行"
  - "删除目标磁盘"
  - "关闭 SSH"
answer: A
explain: "--delete 会删除目标中源不存在的文件，路径写错可能造成数据丢失。先用 --dry-run 检查同步计划。"
:::

## 运维任务

### 任务 1：安全登录

1. 创建普通用户 `deploy`。
2. 生成 Ed25519 密钥并安装公钥。
3. 验证密钥登录与 sudo。
4. 禁用 root 与密码登录。
5. 配置 `~/.ssh/config` 别名与 keepalive。
6. 用 `ssh -v` 记录认证过程。

### 任务 2：隧道与跳板

1. 在服务器启动一个只监听 127.0.0.1 的 HTTP 服务。
2. 用本地转发在浏览器访问它。
3. 配置一台跳板机，通过 ProxyJump 访问内网测试机。
4. 用 rsync 同步一个目录，先 dry-run 再实际执行。
5. 解释为什么不应把数据库端口直接暴露公网。

### 任务 3：加固与审计

1. 配置 fail2ban 并模拟失败登录。
2. 检查 SSH 登录日志，列出失败来源 Top 5。
3. 审计 `authorized_keys` 与 sudo 权限。
4. 写一份 SSH 安全基线清单。
5. 设计密钥泄露后的应急步骤。

## 自检清单

- 能否解释公钥认证流程？
- 是否理解本地转发与远程转发的区别？
- 能否通过跳板机安全访问内网？
- 是否知道如何避免把自己锁在服务器外？
- 是否定期审计登录与密钥？

## 返回

- [SSH 教程首页](/ssh/index.html)
- [综合测验](/exercises.html)
