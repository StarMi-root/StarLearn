---
title: 虚拟化、容器与云
description: Type 1/2 虚拟化、容器 namespace/cgroups、云服务模型、网络与存储、Kubernetes 与选型边界。
category: hardware
order: 6
tags: [虚拟化, 容器, 云, Kubernetes, cgroups]
updated: 2026-11-12
---

# 虚拟化、容器与云

虚拟化把物理资源抽象成多个隔离环境。云平台、容器和 Kubernetes 都建立在这一基础上，但隔离级别与管理方式不同。

## 虚拟机

Hypervisor 在硬件与 Guest OS 之间提供虚拟 CPU、内存、磁盘和网卡。

- **Type 1**：直接运行在硬件上，如 KVM、Xen、VMware ESXi、Hyper-V。
- **Type 2**：运行在宿主 OS 上，如 VirtualBox、VMware Workstation。

虚拟机拥有完整内核，隔离性强，可运行不同操作系统。代价是启动慢、资源开销大。

```bash
# Linux 上查看 KVM 支持
egrep -c '(vmx|svm)' /proc/cpuinfo
lsmod | grep kvm
```

## 容器

容器共享宿主内核，通过 namespace 隔离视图，通过 cgroups 限制资源。

```bash
# 查看进程的命名空间
lsns -p <pid>

# 查看 cgroup
cat /proc/<pid>/cgroup
systemd-cgtop
```

容器优势：

- 启动快、镜像小。
- 环境一致，便于 CI/CD。
- 密度高，适合微服务。

容器限制：

- 隔离弱于 VM，内核漏洞影响宿主。
- 不能运行不同内核。
- 持久化、网络与安全需额外设计。

## VM vs 容器

| 维度 | 虚拟机 | 容器 |
|---|---|---|
| 隔离 | 硬件级，强 | 内核级，较弱 |
| 启动 | 秒到分钟 | 毫秒到秒 |
| 开销 | 较高 | 较低 |
| 内核 | 独立 | 共享宿主 |
| 适用 | 多租户、强隔离 | 应用打包、微服务 |

高安全多租户场景可用 Kata Containers、Firecracker 等强隔离容器方案。

## 云服务模型

- **IaaS**：虚拟机、网络、存储，自己管 OS 与应用。
- **PaaS**：平台管理运行时，开发者部署代码。
- **FaaS**：事件驱动函数，按调用计费。
- **SaaS**：直接使用软件服务。

选择时关注：控制权、运维成本、弹性、锁定风险、合规与成本。

## 云网络

- **VPC**：隔离的虚拟网络。
- **子网**：划分公网/私网。
- **安全组**：实例级防火墙。
- **负载均衡**：分发流量、健康检查。
- **NAT 网关**：私网访问公网。
- **专线/VPN**：连接本地与云。

安全组与主机防火墙是两层，不要只配置其中一层。

## 云存储

- **块存储**：云盘，挂载为磁盘。
- **对象存储**：S3 兼容，适合图片、备份、静态资源。
- **文件存储**：NFS/SMB 共享。
- **冷归档**：低成本长期保存。

对象存储不是文件系统，注意一致性、权限、生命周期与出口流量费用。

## 快照与备份

快照适合快速回滚，但不等于完整备份：

- 快照可能依赖原盘。
- 跨区域复制才防地域故障。
- 应用一致性需要停机、冻结或数据库工具。
- 定期验证恢复。

## Kubernetes 基础

Kubernetes 管理容器化应用的部署、扩缩、服务发现与自愈。

核心对象：

- Pod：最小调度单元。
- Deployment：副本与滚动更新。
- Service：稳定访问入口。
- Ingress：HTTP 路由。
- ConfigMap/Secret：配置与敏感信息。
- PersistentVolume：持久存储。

```bash
kubectl get pods
kubectl describe pod <name>
kubectl logs <pod>
kubectl rollout status deployment/app
kubectl rollout undo deployment/app
```

Kubernetes 不是小项目的默认选择。团队没有相应运维能力时，单机 Docker Compose 往往更稳。

## 资源限制

```yaml
resources:
  requests:
    cpu: 250m
    memory: 256Mi
  limits:
    cpu: "1"
    memory: 512Mi
```

requests 影响调度，limits 影响运行时约束。内存 limit 过低会 OOMKill，CPU limit 过低会节流。

## 安全边界

- 不使用 `--privileged`。
- 不挂载 Docker socket。
- 容器以非 root 运行。
- 镜像固定版本并扫描漏洞。
- Secret 加密存储，限制 RBAC。
- 网络策略限制东西向流量。
- 多租户使用独立集群或强隔离运行时。

:::warn 隔离不是绝对
共享内核意味着容器逃逸可能影响宿主。运行不可信代码、多租户或高合规场景，应使用虚拟机或强隔离沙箱。
:::

## 选型建议

- 个人项目/小团队：单机 + Docker Compose。
- 多服务、需要弹性：托管 Kubernetes 或云容器服务。
- 强隔离/多 OS：虚拟机。
- 静态站：对象存储 + CDN 或 GitHub Pages。
- 本地 AI：裸机 + GPU，容器化注意驱动与显存。

## 小练习

1. 用 Docker 运行一个服务，查看其 namespace 与 cgroup。
2. 比较虚拟机与容器的启动时间和资源占用。
3. 为一个 Web 服务设计 VPC、子网、安全组与备份方案。

## 下一步

- [Docker 部署](/server/docker.html)
- [服务器初始化](/server/setup.html)
- [监控与日志](/server/monitoring.html)
