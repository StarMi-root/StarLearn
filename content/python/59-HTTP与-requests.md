# 第 12 章 网络与 Web

# 59. HTTP 与 requests

## 学习目标

- 掌握 requests 库
- 学会常见 HTTP 方法
- 处理认证与错误

## 59.1 安装

```bash
pip install requests
```

## 59.2 基本用法

```python
import requests

response = requests.get("https://api.example.com/data")
print(response.status_code)  # 200
print(response.text)         # 文本
data = response.json()       # 解析 JSON
```

## 59.3 常用方法

```python
requests.get(url, params={"key": "value"})
requests.post(url, json={"data": 1})
requests.put(url, json={"data": 1})
requests.patch(url, json={"field": "new"})
requests.delete(url)
```

## 59.4 请求头

```python
headers = {
    "Authorization": "Bearer token",
    "Content-Type": "application/json"
}
requests.get(url, headers=headers)
```

## 59.5 参数

```python
# GET 参数
requests.get(url, params={"page": 1, "size": 20})

# 数据（表单）
requests.post(url, data={"field": "value"})

# JSON
requests.post(url, json={"key": "value"})
```

## 59.6 文件上传

```python
files = {"file": open("image.png", "rb")}
requests.post(url, files=files)
```

## 59.7 认证

```python
# Basic
requests.get(url, auth=("user", "pass"))

# Bearer
requests.get(url, headers={"Authorization": "Bearer token"})

# 自定义
import base64
credentials = base64.b64encode(b"user:pass").decode()
requests.get(url, headers={"Authorization": f"Basic {credentials}"})
```

## 59.8 Session

```python
with requests.Session() as s:
    s.headers.update({"Authorization": "token"})
    r1 = s.get(url1)
    r2 = s.get(url2)  # 复用连接
```

## 59.9 错误处理

```python
import requests

try:
    response = requests.get(url, timeout=5)
    response.raise_for_status()  # 4xx/5xx 抛异常
except requests.exceptions.HTTPError as e:
    print(f"HTTP error: {e}")
except requests.exceptions.ConnectionError:
    print("network error")
except requests.exceptions.Timeout:
    print("timeout")
```

## 59.10 重试

```python
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

retry = Retry(total=5, backoff_factor=1)
adapter = HTTPAdapter(max_retries=retry)
session = requests.Session()
session.mount("http://", adapter)
session.mount("https://", adapter)
```

## 59.11 流式下载

```python
with requests.get(url, stream=True) as r:
    with open("file.bin", "wb") as f:
        for chunk in r.iter_content(8192):
            f.write(chunk)
```

## 59.12 异步（aiohttp）

```python
import aiohttp

async def fetch(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            return await resp.json()
```

## 59.13 陷阱

- 不检查 status_code
- 不设置 timeout
- 不处理异常
- 大文件不用 stream

## 59.14 最佳实践

- 始终设置 timeout
- 用 Session 复用连接
- 处理 4xx/5xx
- 日志记录

## 小结

- requests 简洁强大
- 始终处理异常
- 用 timeout
- 异步用 aiohttp
