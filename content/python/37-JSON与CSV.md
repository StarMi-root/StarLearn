# 第 8 章 文件与 I/O

# 37. JSON 与 CSV

## 学习目标

- 掌握 json 模块
- 学会 csv 模块
- 处理常见场景

## 37.1 json 模块

### 序列化

```python
import json

data = {"name": "Alice", "age": 30, "hobbies": ["reading", "coding"]}
text = json.dumps(data)
# '{"name": "Alice", "age": 30, "hobbies": ["reading", "coding"]}'

# 美化
pretty = json.dumps(data, indent=2, ensure_ascii=False)
```

### 反序列化

```python
obj = json.loads(text)
obj["name"]  # "Alice"
```

### 文件操作

```python
with open("data.json", "w", encoding="utf-8") as f:
    json.dump(obj, f, indent=2, ensure_ascii=False)

with open("data.json", encoding="utf-8") as f:
    obj = json.load(f)
```

## 37.2 csv 模块

### 读取

```python
import csv

with open("data.csv", newline="") as f:
    reader = csv.reader(f)
    header = next(reader)
    for row in reader:
        print(row)  # 列表
```

### 字典读取

```python
with open("data.csv", newline="") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["name"], row["age"])
```

### 写入

```python
with open("out.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["name", "age"])
    writer.writerow(["Alice", 30])

# 字典写入
with open("out.csv", "w", newline="") as f:
    fieldnames = ["name", "age"]
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerow({"name": "Alice", "age": 30})
```

## 37.3 嵌套 JSON

```python
data = {
    "users": [
        {"name": "Alice", "addresses": ["NYC", "LA"]},
        {"name": "Bob", "addresses": ["SF"]}
    ]
}
```

## 37.4 CSV 陷阱

```python
# 必须 newline=""
with open("data.csv", newline="") as f:
    ...
# 否则 Windows 会出现空行
```

## 37.5 大文件处理

```python
# 逐行处理
with open("huge.csv", newline="") as f:
    reader = csv.reader(f)
    for row in reader:
        process(row)
```

## 37.6 其他格式

- **YAML**：`pip install pyyaml`
- **XML**：`xml.etree`
- **TOML**：`tomllib`（3.11+）或 `tomli`
- **SQLite**：`sqlite3`（标准库）
- **Parquet**：`pandas`

## 37.7 JSON 扩展

```python
# 自定义编码
def default(obj):
    if isinstance(obj, set):
        return list(obj)
    raise TypeError

json.dumps(data, default=default)

# 解析日期
from json import JSONDecoder
from datetime import datetime
```

## 小结

- json.dump/dumps 序列化
- csv 模块处理表格
- 大文件逐行处理
- 显式指定编码
