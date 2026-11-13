# 第 17 章 网络

# 62. URL 与 HttpURLConnection

## 学习目标

- 掌握 URL/URLConnection
- 学会 HTTP 请求
- 理解流读取

## 62.1 基本用法

```java
import java.net.*;

URL url = new URL("https://api.example.com/data");
HttpURLConnection conn = (HttpURLConnection) url.openConnection();
conn.setRequestMethod("GET");
conn.connect();

int status = conn.getResponseCode();
InputStream in = conn.getInputStream();
// 读取
```

## 62.2 请求体

```java
conn.setRequestMethod("POST");
conn.setDoOutput(true);
try (OutputStream out = conn.getOutputStream()) {
    out.write(json.getBytes(StandardCharsets.UTF_8));
}
```

## 62.3 陷阱

- 未关闭
- 阻塞
- 超时

## 62.4 超时

```java
conn.setConnectTimeout(5000);
conn.setReadTimeout(5000);
```

## 62.5 替代

- OkHttp
- Java 11 HttpClient
- RestTemplate

## 62.6 最佳实践

- 设超时
- 处理异常
- 用现代库

## 小结

- HttpURLConnection
- 超时设置
- 替代库
