# 第 12 章 网络与 Web

# 60. Flask 入门

## 学习目标

- 理解 Web 框架概念
- 掌握 Flask 路由
- 学会请求与响应

## 60.1 安装

```bash
pip install flask
```

## 60.2 最小应用

```python
from flask import Flask

app = Flask(__name__)

@app.route("/")
def index():
    return "Hello, World!"

if __name__ == "__main__":
    app.run(debug=True)
```

访问 http://localhost:5000。

## 60.3 路由

```python
@app.route("/about")
def about():
    return "About page"

# 路径参数
@app.route("/user/<name>")
def user(name):
    return f"User: {name}"

# 类型转换
@app.route("/post/<int:post_id>")
def post(post_id):
    return f"Post {post_id}"
```

## 60.4 HTTP 方法

```python
@app.route("/api/data", methods=["GET", "POST"])
def api():
    if request.method == "POST":
        data = request.get_json()
        return {"received": data}, 201
    return {"items": []}
```

## 60.5 请求与响应

```python
from flask import request, jsonify

@app.route("/api/data")
def get_data():
    page = request.args.get("page", 1, type=int)
    return jsonify({"page": page, "items": []})
```

## 60.6 模板

```python
from flask import render_template

@app.route("/users")
def users():
    user_list = [{"name": "Alice"}, {"name": "Bob"}]
    return render_template("users.html", users=user_list)
```

```html
<!-- templates/users.html -->
{% for u in users %}
<p>{{ u.name }}</p>
{% endfor %}
```

## 60.7 静态文件

```python
@app.route("/static/<path:filename>")
def static_files(filename):
    return send_from_directory("static", filename)
```

## 60.8 蓝图

```python
from flask import Blueprint

api_bp = Blueprint("api", __name__, url_prefix="/api")

@api_bp.route("/data")
def data():
    return {"items": []}

app.register_blueprint(api_bp)
```

## 60.9 中间件（before/after）

```python
@app.before_request
def log_request():
    print(request.method, request.path)

@app.after_request
def log_response(response):
    print(response.status_code)
    return response
```

## 60.10 错误处理

```python
@app.errorhandler(404)
def not_found(e):
    return "Not Found", 404
```

## 60.11 配置

```python
app.config["DEBUG"] = True
app.config["SECRET_KEY"] = "secret"
```

## 60.12 项目结构

```
myapp/
  app.py
  templates/
    base.html
    users.html
  static/
    css/
    js/
  requirements.txt
```

## 60.13 运行

```bash
flask run
# 或
python app.py
```

## 60.14 与生产部署

- Gunicorn + Flask
- Nginx 反代
- 数据库连接池

## 60.15 替代框架

- **FastAPI**：异步、现代
- **Django**：全功能
- **Tornado**：高性能

## 小结

- Flask 轻量灵活
- 路由 + 蓝图
- 模板 + 静态文件
- 生产用 WSGI 服务器
