# syntax=docker/dockerfile:1

FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    SITE_DIR=/app/dist \
    HOST=0.0.0.0 \
    PORT=8080

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY server/ai_proxy.py ./server/ai_proxy.py

RUN useradd --system --no-create-home --shell /usr/sbin/nologin appuser \
    && chown -R appuser:appuser /app
USER appuser

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD python3 -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8080/api/health')" || exit 1

CMD ["python3", "server/ai_proxy.py"]
