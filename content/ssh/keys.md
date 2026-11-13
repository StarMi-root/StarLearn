---
title: SSH 密钥、Agent 与多账号管理
description: 生成 Ed25519 密钥、使用 ssh-agent、配置多个 GitHub/服务器账号，理解公钥认证与密钥安全。
category: ssh
order: 2
tags: [SSH, 密钥, ssh-agent, 多账号]
updated: 2026-11-12
---

# SSH 密钥、Agent 与多账号管理

公钥认证使用一对密钥：私钥留在本地，公钥放到服务器。服务器用公钥验证你持有对应私钥，私钥本身不会在网络中传输。

## 生成密钥

```bash
ssh-keygen -t ed25519 -C "starlearn@example.com"
```

推荐：

- 类型：`ed25519`，现代、短、安全。
- 兼容老系统可用 `rsa -b 4096`。
- 设置强 passphrase，防止私钥文件泄露后被直接使用。
- 保存到默认路径，或按用途命名。

生成后：

```text
~/.ssh/id_ed25519
~/.ssh/id_ed25519.pub
```

**永远不要分享私钥**。公钥可以公开。

## 安装公钥

```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub deploy@server
```

手动方式：

```bash
cat ~/.ssh/id_ed25519.pub | ssh deploy@server \
  'mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys'
```

验证：

```bash
ssh -i ~/.ssh/id_ed25519 deploy@server
```

服务器端检查：

```bash
ls -ld ~ ~/.ssh
ls -l ~/.ssh/authorized_keys
```

家目录不能对组或其他用户可写，否则 SSH 可能拒绝公钥认证。

## ssh-agent

Agent 在内存中保存解密后的私钥，避免每次输入 passphrase：

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
ssh-add -l
```

macOS 可将密钥存入 Keychain：

```bash
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
```

Linux 桌面可使用 `gnome-keyring` 或 systemd user service。不要把私钥密码写进脚本。

## 多账号配置

同一台机器管理个人与工作 GitHub：

```sshconfig
Host github-personal
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_personal
    IdentitiesOnly yes

Host github-work
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_work
    IdentitiesOnly yes
```

克隆：

```bash
git clone git@github-personal:me/project.git
git clone git@github-work:company/project.git
```

服务器多环境：

```sshconfig
Host prod
    HostName 203.0.113.10
    User deploy
    IdentityFile ~/.ssh/id_ed25519_prod
    IdentitiesOnly yes

Host staging
    HostName 203.0.113.20
    User deploy
    IdentityFile ~/.ssh/id_ed25519_staging
    IdentitiesOnly yes
```

`IdentitiesOnly yes` 防止 agent 把错误密钥先提供给服务器，触发 `Too many authentication failures`。

## GitHub 公钥

复制公钥：

```bash
cat ~/.ssh/id_ed25519.pub
```

粘贴到 GitHub **Settings → SSH and GPG keys → New SSH key**。测试：

```bash
ssh -T git@github.com
```

成功提示类似：

```text
Hi user! You've successfully authenticated, but GitHub does not provide shell access.
```

## 密钥轮换

- 私钥可能泄露时立即从服务器与平台删除对应公钥。
- 定期轮换高权限部署密钥。
- 为不同用途使用不同密钥，避免一把钥匙开所有门。
- CI 使用专用部署密钥，限制命令与仓库。
- 离职或设备丢失时吊销相关密钥。

## 权限速查

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/config
```

## 常见错误

**Key is ignored**：权限过宽、路径错误、agent 提供了其他密钥。用 `ssh -vvv` 查看 `Offering public key`。

**Agent admitted failure**：私钥未加载或 passphrase 错误。`ssh-add -l` 检查。

**Permission denied**：公钥没有追加成功、用户名错误、服务器禁用公钥认证。检查 `/etc/ssh/sshd_config`。

**GitHub 仍然要求密码**：远程地址是 HTTPS 而不是 SSH。改为 `git@github.com:user/repo.git`。

:::danger 私钥泄露
私钥一旦泄露，攻击者可直接登录所有信任该公钥的服务器。立即从 `authorized_keys` 与代码平台删除对应公钥，轮换密钥，并检查登录日志。
:::

## 小练习

1. 生成带 passphrase 的 Ed25519 密钥并加入 agent。
2. 配置两个 GitHub 账号的 SSH 别名。
3. 用 `ssh -vvv` 分析一次密钥认证过程。

## 下一步

- [端口转发与文件传输](/ssh/tunnel.html)
- [SSH 安全加固](/ssh/hardening.html)
