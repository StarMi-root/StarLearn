---
title: 内存、存储与 RAID
description: DRAM、缓存、虚拟内存、页缓存、SSD、NVMe、IOPS、RAID 与容量规划，理解数据从内存到磁盘的路径。
category: hardware
order: 5
tags: [内存, DRAM, SSD, NVMe, RAID]
updated: 2026-11-12
---

# 内存、存储与 RAID

内存决定能同时处理多少数据，存储决定数据能否持久保存。两者性能差几个数量级，理解这条层次结构是系统优化的基础。

## 存储层次

```text
寄存器       ~1 ns
L1 缓存      ~1 ns
L2 缓存      ~4 ns
L3 缓存      ~15 ns
DRAM         ~80 ns
NVMe SSD     ~50–200 µs
SATA SSD     ~100–300 µs
HDD          ~5–15 ms
网络存储      ms 级
```

越往下容量越大、越慢、越便宜。缓存与预取的目的就是减少访问下层。

## DRAM

- **DDR5**：现代桌面与服务器内存。
- **通道**：双通道/多通道提升带宽。
- **ECC**：检测并纠正位错误，服务器常用。
- **频率与时序**：影响带宽与延迟，但容量与通道数通常更重要。

内存带宽估算：

```text
带宽 ≈ 频率 × 位宽 / 8 × 通道数
```

实际带宽受控制器、访问模式与 NUMA 影响。

## 虚拟内存与页缓存

操作系统给进程独立虚拟地址空间，通过页表映射物理内存。

- **页缓存**：缓存文件数据，读文件可能直接命中内存。
- **缺页**：访问未映射页时触发，可能读磁盘。
- **Swap**：内存压力下换出冷页，延迟显著增加。
- **大页**：减少 TLB 未命中，数据库与虚拟化常用。

```bash
free -h
vmstat 1
cat /proc/meminfo
```

`available` 是可用内存估计，包含可回收缓存。不要看到 `free` 很小就认为内存不足。

## 内存不足与 OOM

```bash
dmesg -T | grep -i "out of memory"
journalctl -k | grep -i oom
```

OOM Killer 会选择进程终止。避免方式：

- 设置容器内存限制与合理堆大小。
- 监控 RSS 与缓存增长。
- 修复内存泄漏。
- 增加内存或优化数据结构。
- 为关键服务配置 systemd `MemoryMax`。

## SSD 与 NAND

SSD 由 NAND 闪存、控制器和缓存组成。

| 类型 | 特点 |
|---|---|
| SLC | 最快、寿命长、成本高 |
| MLC | 平衡，逐渐减少 |
| TLC | 主流消费与数据中心 |
| QLC | 容量大、写入寿命较低 |

SSD 写入需要先擦除块，控制器通过磨损均衡、垃圾回收和 TRIM 管理。写满或长期高写入会导致性能下降。

## NVMe 与 SATA

- **SATA**：约 6 Gbps，受协议限制。
- **NVMe**：走 PCIe，队列深、延迟低。
- **PCIe 代际**：3.0/4.0/5.0 带宽翻倍。

```bash
lsblk -o NAME,SIZE,MODEL,ROTA
nvme list
sudo smartctl -a /dev/nvme0
sudo fstrim -av
```

`ROTA=0` 通常表示 SSD。`fstrim` 通知 SSD 回收未使用块，虚拟化环境需确认支持。

## IOPS 与吞吐

- **IOPS**：每秒 I/O 操作数，随机小 I/O 关键。
- **吞吐**：MB/s，顺序大文件关键。
- **延迟**：单次 I/O 完成时间。
- **队列深度**：并发请求数。

数据库通常关心随机读写 IOPS 与延迟，备份关心顺序吞吐。

```bash
iostat -xz 1
fio --name=randread --ioengine=libaio --rw=randread --bs=4k \
    --numjobs=4 --size=1G --runtime=30 --group_reporting
```

## RAID

| 级别 | 最少盘 | 特点 |
|---|---|---|
| RAID 0 | 2 | 条带化，性能高，无冗余 |
| RAID 1 | 2 | 镜像，容量减半 |
| RAID 5 | 3 | 单校验，允许坏一块 |
| RAID 6 | 4 | 双校验，允许坏两块 |
| RAID 10 | 4 | 镜像 + 条带，性能与冗余兼顾 |

RAID 不是备份。它防磁盘故障，不防误删、勒索软件、火灾或逻辑损坏。必须单独备份。

## 容量规划

- 预留 15%–20% 空间给日志、临时文件与快照。
- 监控 inode，不只监控字节。
- 数据库数据盘与日志盘可分离。
- 备份空间按保留周期与增长率估算。
- 云盘注意 IOPS 与吞吐上限，不只容量。

```bash
df -h
df -i
du -xhd1 /var | sort -h
```

## 文件系统选择

- ext4：通用稳定。
- XFS：大文件与高并发。
- Btrfs：快照与子卷，需理解维护。
- ZFS：校验、压缩、快照，内存要求较高。

格式化与分区是高危操作，生产环境先备份并确认设备名。

:::danger 备份不是同步
RAID、快照和 rsync 到同一台机器都不是完整备份。至少保留一份离线或异地副本，并定期做恢复演练。
:::

## 小练习

1. 用 `free`、`vmstat`、`iostat` 描述本机内存与磁盘状态。
2. 用 `fio` 测试随机读 IOPS 与顺序吞吐。
3. 解释 RAID 5 与 RAID 10 的取舍，以及为什么还需要备份。

## 下一步

- [虚拟化与云](/hardware/virtualization.html)
- [Linux 文件系统](/linux/filesystem.html)
- [监控与备份](/server/monitoring.html)
