---
title: Linux 文件系统与磁盘管理
description: 目录层级、挂载、inode、软硬链接、df/du、分区与 fstab，理解 Linux 如何组织存储。
category: linux
order: 3
tags: [Linux, 文件系统, 磁盘, inode, mount]
updated: 2026-11-12
---

# Linux 文件系统与磁盘管理

Linux 把设备、进程信息、配置和普通文件统一到一棵目录树中。“一切皆文件”是理解 Linux 的关键抽象。

## 目录层级

| 路径 | 内容 |
|---|---|
| `/etc` | 系统与软件配置 |
| `/var` | 可变数据：日志、缓存、数据库 |
| `/usr` | 用户程序、库、文档 |
| `/home` | 普通用户家目录 |
| `/root` | root 家目录 |
| `/tmp` | 临时文件，可能重启清空 |
| `/opt` | 额外安装的软件 |
| `/dev` | 设备文件 |
| `/proc` | 内核与进程虚拟文件 |
| `/sys` | 内核对象与设备信息 |

不要把网站、数据库或用户数据放在 `/tmp`，也不要把自定义软件随意塞进 `/usr/bin`。遵循 FHS 约定能减少维护混乱。

## 挂载

Linux 将磁盘分区挂载到目录：

```bash
lsblk
df -hT
mount | grep nvme
sudo mount /dev/sdb1 /mnt/data
sudo umount /mnt/data
```

挂载点是一个目录。挂载后，原目录内容会被隐藏，直到卸载。

查看 UUID：

```bash
sudo blkid
```

`/etc/fstab` 用于开机自动挂载：

```fstab
UUID=xxxx-xxxx /data ext4 defaults,nofail 0 2
```

修改 `fstab` 前先备份，并使用 `sudo mount -a` 测试。错误的 fstab 可能导致系统无法正常启动；云服务器可加 `nofail` 防止数据盘缺失阻塞启动。

## inode 与链接

```bash
ls -li file
stat file
```

inode 保存文件元数据（权限、大小、时间、数据块位置），文件名只是目录中的引用。

硬链接：

```bash
ln original.txt hardlink.txt
```

指向同一 inode，删除一个名字不会删除数据，直到链接数为 0。

软链接：

```bash
ln -s /opt/app/current /var/www/html
```

类似快捷方式，可以跨文件系统。目标不存在时成为“断链”。

## 磁盘空间

```bash
df -h          # 文件系统使用量
du -sh *       # 当前目录各项大小
du -h --max-depth=1 /var | sort -h
ncdu /var      # 交互式分析（需安装）
```

`df` 看文件系统，`du` 看目录内容。两者差异大时，可能是已删除但被进程占用的文件：

```bash
sudo lsof +L1
```

重启相关进程或服务后空间才会释放。

## 分区与文件系统

```bash
lsblk -f
sudo fdisk -l
```

创建文件系统会清空数据：

```bash
sudo mkfs.ext4 /dev/sdb1
```

`mkfs`、`parted`、`dd` 都是高风险命令。操作前确认设备名，生产环境必须有备份。

常见文件系统：

| 文件系统 | 适用 |
|---|---|
| ext4 | 通用 Linux 根分区 |
| XFS | 大文件、高并发，RHEL 默认 |
| Btrfs | 快照、子卷 |
| ZFS | 数据完整性、存储池 |
| tmpfs | 内存文件系统 |

## 日志与清理

```bash
journalctl --disk-usage
sudo journalctl --vacuum-time=14d
sudo du -sh /var/log/*
```

不要直接 `rm` 正在写入的日志。使用 `logrotate` 或 journald 配置。清理前确认是否影响审计与排障。

## 文件查找与空间定位

```bash
find / -xdev -type f -size +500M 2>/dev/null
sudo du -xhd1 / | sort -h
```

`-xdev` 不跨越文件系统，避免扫描挂载的网络盘或数据盘。`2>/dev/null` 隐藏权限错误，但排障时不要盲目丢弃错误。

## 备份思维

- 备份要定期验证恢复，不只是“复制成功”。
- 重要数据至少保留一份异地副本。
- 数据库备份要保证一致性，不能只拷贝正在写入的数据文件。
- 使用 `rsync --dry-run` 预览同步结果。
- 版本化配置，避免只保留一份 `nginx.conf`。

:::warn 关于 rm -rf
`rm -rf /data/*` 会删除 `/data` 下所有内容且不可恢复。执行前先 `pwd`、`ls`，确认路径与通配符展开结果。生产环境优先使用受控脚本与备份。
:::

## 小练习

1. 用 `lsblk`、`df -hT` 找出系统根分区与数据盘。
2. 创建一个 100MB 的 loop 设备并挂载，练习格式化与卸载。
3. 找出 `/var` 下占用最大的三个目录，并解释原因。

## 下一步

- [权限与用户](/linux/permissions.html)
- [进程与资源](/linux/processes.html)
- [服务器初始化](/server/setup.html)
