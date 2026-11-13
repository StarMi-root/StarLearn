#!/usr/bin/env python3
"""StarLearn — 零依赖静态站点 + OpenAI 兼容 AI 代理。

用法:
    AI_API_BASE="https://api.deepseek.com/v1" \
    AI_API_KEY="sk-..." \
    AI_MODEL="deepseek-chat" \
    python3 server/ai_proxy.py

环境变量:
    SITE_DIR       静态站点目录（默认 ../dist）
    HOST           监听地址（默认 127.0.0.1）
    PORT           监听端口（默认 8080）
    AI_API_BASE    上游 OpenAI 兼容 API 根地址或完整 chat/completions 地址
    AI_API_KEY     上游密钥；本地地址可留空
    AI_MODEL       模型名（默认 deepseek-chat）
    AI_TIMEOUT     上游超时秒数（默认 90）
    AI_MAX_TOKENS  最大输出 token（默认 1200）
    RATE_LIMIT     每个 IP 每分钟请求数（默认 20）
    CORS_ORIGIN    可选；仅当需要跨域静态站调用时设置，默认关闭
"""

from __future__ import annotations

import json
import logging
import mimetypes
import os
import socket
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from collections import defaultdict, deque
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Lock
from typing import Any

BASE_DIR = Path(__file__).resolve().parent.parent
SITE_DIR = Path(os.environ.get("SITE_DIR", BASE_DIR / "dist")).resolve()
HOST = os.environ.get("HOST", "127.0.0.1")
PORT = int(os.environ.get("PORT", "8080"))
AI_API_BASE = os.environ.get("AI_API_BASE", "https://api.deepseek.com/v1").rstrip("/")
AI_API_KEY = os.environ.get("AI_API_KEY", "").strip()
AI_MODEL = os.environ.get("AI_MODEL", "deepseek-chat").strip() or "deepseek-chat"
AI_TIMEOUT = max(5, min(300, int(os.environ.get("AI_TIMEOUT", "90"))))
AI_MAX_TOKENS = max(64, min(8192, int(os.environ.get("AI_MAX_TOKENS", "1200"))))
RATE_LIMIT = max(1, int(os.environ.get("RATE_LIMIT", "20")))
CORS_ORIGIN = os.environ.get("CORS_ORIGIN", "").strip()

MAX_BODY_BYTES = 96 * 1024
MAX_MESSAGES = 12
MAX_MESSAGE_CHARS = 8_000
MAX_TOTAL_CHARS = 28_000
MAX_UPSTREAM_BYTES = 2 * 1024 * 1024
RATE_WINDOW_SECONDS = 60

SYSTEM_PROMPT = """你是“StarLearn”的中文 AI 学习助手，面向正在学习编程、AI、Linux 与服务器部署的学生。
请用清晰、准确、可执行的中文回答，先给结论，再给步骤；必要时给出代码示例。
只基于当前页面、用户提供的信息和你确定的知识回答；不确定时明确说明，不要编造不存在的 API、命令或链接。
涉及删除、权限、防火墙、数据库、密钥等高风险操作时，先提醒备份与在测试环境验证。
回答尽量控制在 800 字以内，并在合适时建议下一步学习内容。"""

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    stream=sys.stderr,
)
log = logging.getLogger("techlearn.ai_proxy")

_rate_buckets: dict[str, deque[float]] = defaultdict(deque)
_rate_lock = Lock()


def is_local_base(url: str) -> bool:
    try:
        host = urllib.parse.urlparse(url).hostname or ""
    except ValueError:
        return False
    return host in {"127.0.0.1", "localhost", "::1", "0.0.0.0"}


def endpoint_url() -> str:
    if AI_API_BASE.endswith("/chat/completions"):
        return AI_API_BASE
    return f"{AI_API_BASE}/chat/completions"


def configured() -> bool:
    return bool(AI_API_BASE) and (bool(AI_API_KEY) or is_local_base(AI_API_BASE))


def allow_request(ip: str) -> bool:
    now = time.monotonic()
    with _rate_lock:
        bucket = _rate_buckets[ip]
        while bucket and now - bucket[0] > RATE_WINDOW_SECONDS:
            bucket.popleft()
        if len(bucket) >= RATE_LIMIT:
            return False
        bucket.append(now)
        return True


def clean_text(value: Any, limit: int) -> str:
    if not isinstance(value, str):
        return ""
    return value.replace("\x00", "").strip()[:limit]


def build_messages(payload: dict[str, Any]) -> list[dict[str, str]]:
    page = payload.get("page") if isinstance(payload.get("page"), dict) else {}
    page_title = clean_text(page.get("title"), 200)
    page_url = clean_text(page.get("url"), 600)
    page_note = ""
    if page_title:
        page_note = f"\n当前页面：{page_title}"
        if page_url:
            page_note += f"（{page_url}）"

    raw_messages = payload.get("messages")
    if not isinstance(raw_messages, list):
        raise ValueError("messages 必须是数组")

    messages: list[dict[str, str]] = [{"role": "system", "content": SYSTEM_PROMPT + page_note}]
    total = 0
    source = raw_messages[-MAX_MESSAGES:]
    for item in source:
        if not isinstance(item, dict):
            continue
        role = item.get("role")
        if role not in {"user", "assistant"}:
            continue
        content = clean_text(item.get("content"), MAX_MESSAGE_CHARS)
        if not content:
            continue
        total += len(content)
        if total > MAX_TOTAL_CHARS:
            raise ValueError("对话上下文过长，请清空历史或缩短问题")
        messages.append({"role": role, "content": content})

    if not any(m["role"] == "user" for m in messages):
        raise ValueError("至少需要一条用户消息")
    return messages


def upstream_chat(messages: list[dict[str, str]]) -> str:
    payload = json.dumps(
        {
            "model": AI_MODEL,
            "messages": messages,
            "temperature": 0.3,
            "max_tokens": AI_MAX_TOKENS,
            "stream": False,
        },
        ensure_ascii=False,
    ).encode("utf-8")

    headers = {"Content-Type": "application/json", "Accept": "application/json"}
    if AI_API_KEY:
        headers["Authorization"] = f"Bearer {AI_API_KEY}"

    request = urllib.request.Request(endpoint_url(), data=payload, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(request, timeout=AI_TIMEOUT) as response:
            body = response.read(MAX_UPSTREAM_BYTES)
    except urllib.error.HTTPError as exc:
        detail = ""
        try:
            detail = exc.read(2048).decode("utf-8", "replace")
        except Exception:
            pass
        log.warning("upstream HTTP %s: %s", exc.code, detail[:300])
        if exc.code == 401:
            raise RuntimeError("上游模型认证失败，请检查 AI_API_KEY") from exc
        if exc.code == 403:
            raise RuntimeError("上游模型拒绝访问，请检查模型权限") from exc
        if exc.code == 429:
            raise RuntimeError("上游模型触发限流，请稍后重试") from exc
        raise RuntimeError(f"上游模型返回错误（HTTP {exc.code}）") from exc
    except (TimeoutError, socket.timeout) as exc:
        raise RuntimeError("上游模型响应超时，请稍后重试") from exc
    except urllib.error.URLError as exc:
        log.warning("upstream network error: %s", exc)
        raise RuntimeError("无法连接上游模型服务，请检查地址与网络") from exc

    try:
        data = json.loads(body)
    except json.JSONDecodeError as exc:
        raise RuntimeError("上游返回了无法解析的响应") from exc

    try:
        reply = data["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError) as exc:
        raise RuntimeError("上游响应缺少 choices[0].message.content") from exc

    if not isinstance(reply, str) or not reply.strip():
        raise RuntimeError("上游返回了空回答")
    return reply.strip()


class Handler(BaseHTTPRequestHandler):
    server_version = "StarLearnAI/1.0"
    protocol_version = "HTTP/1.1"

    def log_message(self, fmt: str, *args: Any) -> None:
        log.info("%s - %s", self.client_address[0], fmt % args)

    def _headers(self, status: int, content_type: str, length: int, cache: str = "no-store") -> None:
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(length))
        self.send_header("Cache-Control", cache)
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        self.send_header("X-Frame-Options", "SAMEORIGIN")
        if CORS_ORIGIN:
            self.send_header("Access-Control-Allow-Origin", CORS_ORIGIN)
            self.send_header("Vary", "Origin")
            self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
            self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        if self.close_connection:
            self.send_header("Connection", "close")
        self.end_headers()

    def _json(self, status: int, payload: dict[str, Any], cache: str = "no-store") -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self._headers(status, "application/json; charset=utf-8", len(body), cache)
        if self.command != "HEAD":
            self.wfile.write(body)

    def _error(self, status: int, message: str) -> None:
        # 提前返回错误时请求体可能尚未读取；关闭连接，避免剩余字节被当成下一个请求。
        self.close_connection = True
        self._json(status, {"error": message})

    def do_OPTIONS(self) -> None:
        if self.path.startswith("/api/"):
            self._headers(HTTPStatus.NO_CONTENT, "text/plain", 0)
        else:
            self._error(HTTPStatus.NOT_FOUND, "Not found")

    def do_GET(self) -> None:
        parsed = urllib.parse.urlsplit(self.path)
        if parsed.path == "/api/health":
            self._json(
                HTTPStatus.OK,
                {
                    "ok": True,
                    "model": AI_MODEL,
                    "configured": configured(),
                    "site": str(SITE_DIR),
                },
            )
            return
        if parsed.path.startswith("/api/"):
            self._error(HTTPStatus.NOT_FOUND, "接口不存在")
            return
        self._serve_static(parsed.path, head=False)

    def do_HEAD(self) -> None:
        parsed = urllib.parse.urlsplit(self.path)
        if parsed.path.startswith("/api/"):
            self._error(HTTPStatus.METHOD_NOT_ALLOWED, "Method not allowed")
            return
        self._serve_static(parsed.path, head=True)

    def do_POST(self) -> None:
        parsed = urllib.parse.urlsplit(self.path)
        if parsed.path != "/api/chat":
            self._error(HTTPStatus.NOT_FOUND, "接口不存在")
            return

        ip = self.client_address[0]
        if not allow_request(ip):
            self.close_connection = True
            self.send_response(HTTPStatus.TOO_MANY_REQUESTS)
            self.send_header("Retry-After", str(RATE_WINDOW_SECONDS))
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", "0")
            self.send_header("Connection", "close")
            self.end_headers()
            return

        if not configured():
            self._error(HTTPStatus.SERVICE_UNAVAILABLE, "AI 代理尚未配置：请设置 AI_API_BASE 与 AI_API_KEY")
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            self._error(HTTPStatus.BAD_REQUEST, "Content-Length 无效")
            return
        if length <= 0:
            self._error(HTTPStatus.BAD_REQUEST, "请求体为空")
            return
        if length > MAX_BODY_BYTES:
            self._error(HTTPStatus.REQUEST_ENTITY_TOO_LARGE, "请求体过大")
            return

        try:
            payload = json.loads(self.rfile.read(length))
            if not isinstance(payload, dict):
                raise ValueError("请求体必须是 JSON 对象")
            messages = build_messages(payload)
            reply = upstream_chat(messages)
        except ValueError as exc:
            self._error(HTTPStatus.BAD_REQUEST, str(exc))
            return
        except RuntimeError as exc:
            self._error(HTTPStatus.BAD_GATEWAY, str(exc))
            return
        except Exception:
            log.exception("unexpected error")
            self._error(HTTPStatus.INTERNAL_SERVER_ERROR, "服务器内部错误")
            return

        self._json(HTTPStatus.OK, {"reply": reply, "model": AI_MODEL})

    def _serve_static(self, raw_path: str, head: bool) -> None:
        try:
            decoded = urllib.parse.unquote(raw_path, errors="strict")
        except UnicodeDecodeError:
            self._error(HTTPStatus.BAD_REQUEST, "路径编码无效")
            return
        if "\x00" in decoded:
            self._error(HTTPStatus.BAD_REQUEST, "路径无效")
            return

        relative = decoded.lstrip("/") or "index.html"
        target = (SITE_DIR / relative).resolve()
        try:
            target.relative_to(SITE_DIR)
        except ValueError:
            self._error(HTTPStatus.FORBIDDEN, "禁止访问")
            return

        if target.is_dir():
            target = target / "index.html"
        if not target.is_file() and not target.suffix:
            maybe = target.with_suffix(".html")
            if maybe.is_file():
                target = maybe

        if not target.is_file():
            self._serve_404(head)
            return

        content_type, _ = mimetypes.guess_type(str(target))
        if target.suffix == ".md":
            content_type = "text/markdown; charset=utf-8"
        elif target.suffix == ".webmanifest":
            content_type = "application/manifest+json"
        content_type = content_type or "application/octet-stream"
        if content_type.startswith("text/") and "charset" not in content_type:
            content_type += "; charset=utf-8"

        try:
            body = target.read_bytes()
        except OSError:
            log.exception("read failed: %s", target)
            self._error(HTTPStatus.INTERNAL_SERVER_ERROR, "读取文件失败")
            return

        cache = "no-cache"
        if decoded.endswith((".css", ".js", ".webmanifest")):
            cache = "public, max-age=3600"
        elif decoded.endswith((".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".woff2")):
            cache = "public, max-age=604800"
        self._headers(HTTPStatus.OK, content_type, len(body), cache)
        if not head:
            self.wfile.write(body)

    def _serve_404(self, head: bool) -> None:
        page = SITE_DIR / "404.html"
        if page.is_file():
            body = page.read_bytes()
            self._headers(HTTPStatus.NOT_FOUND, "text/html; charset=utf-8", len(body), "no-cache")
            if not head:
                self.wfile.write(body)
        else:
            self._json(HTTPStatus.NOT_FOUND, {"error": "页面不存在"})


def main() -> None:
    if not SITE_DIR.is_dir():
        log.warning("SITE_DIR does not exist: %s (API still available)", SITE_DIR)
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    server.daemon_threads = True
    log.info("StarLearn AI proxy listening on http://%s:%s", HOST, PORT)
    log.info("site=%s model=%s configured=%s", SITE_DIR, AI_MODEL, configured())
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        log.info("shutting down")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
