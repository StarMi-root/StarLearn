# 第 15 章 工程化

# 56. Maven 与 Gradle

## 学习目标

- 掌握 Maven
- 学会 Gradle
- 理解依赖管理

## 56.1 Maven

```xml
<project>
    <groupId>com.example</groupId>
    <artifactId>myapp</artifactId>
    <version>1.0.0</version>
    <dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-core</artifactId>
            <version>6.0.0</version>
        </dependency>
    </dependencies>
</project>
```

## 56.2 常用命令

```bash
mvn clean compile
mvn test
mvn package
mvn install
mvn clean install
```

## 56.3 生命周期

- validate
- compile
- test
- package
- install
- deploy

## 56.4 Gradle

```kotlin
plugins {
    java
    application
}

dependencies {
    implementation("org.springframework:spring-core:6.0.0")
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.0")
}
```

## 56.5 命令

```bash
./gradlew build
./gradlew test
./gradlew jar
```

## 56.6 陷阱

- 依赖冲突
- 版本管理
- 插件

## 56.7 最佳实践

- BOM 管理版本
- 锁定依赖
- 插件最新

## 小结

- Maven 经典
- Gradle 现代
- 依赖管理
- 生命周期
