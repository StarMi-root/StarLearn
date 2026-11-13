# 第 15 章 工程化

# 58. 代码风格与 Lint

## 学习目标

- 掌握 Checkstyle
- 学会 SpotBugs
- 理解静态分析

## 58.1 Checkstyle

```xml
<dependency>
    <groupId>com.puppycrawl.tools</groupId>
    <artifactId>checkstyle</artifactId>
    <version>10.x</version>
</dependency>
```

```bash
checkstyle -c config/sun_checks.xml src/main/java
```

## 58.2 SpotBugs

```xml
<dependency>
    <groupId>com.github.spotbugs</groupId>
    <artifactId>spotbugs-maven-plugin</artifactId>
</dependency>
```

## 58.3 PMD

```bash
pmd check -d src/main/java -R ruleset.xml
```

## 58.4 常见规则

- 命名规范
- 方法长度
- 参数数量
- 空指针
- 资源泄漏

## 58.5 IDE 集成

- IntelliJ 内置
- 保存时检查
- 提交前钩子

## 58.6 陷阱

- 规则过严
- 误报
- 性能

## 58.7 最佳实践

- 统一规则
- 自动修复
- 钩子

## 小结

- Checkstyle 风格
- SpotBugs bug
- PMD 静态
- 钩子自动化
