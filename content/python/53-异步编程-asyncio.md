# 第 10 章 并发与异步

# 53. 异步编程 asyncio

## 学习目标

- 理解事件循环
- 掌握 async/await
- 学会并发任务

## 53.1 协程基础

```python
import asyncio

async def say_hello():
    print("Hello")
    await asyncio.sleep(1)
    print("World")

asyncio.run(say_hello())
```

## 53.2 await 语义

- 暂停当前协程
- 让出控制权
- 不阻塞其他任务

## 53.3 并发任务

```python
import asyncio

async def fetch(url):
    await asyncio.sleep(1)
    return url

async def main():
    urls = ["a", "b", "c"]
    tasks = [fetch(u) for u in urls]
    results = await asyncio.gather(*tasks)
    print(results)

asyncio.run(main())
# 总耗时 ~1 秒（不是 3 秒）
```

## 53.4 任务与并发

```python
async def main():
    t1 = asyncio.create_task(fetch("a"))
    t2 = asyncio.create_task(fetch("b"))
    await t1
    await t2
```

## 53.5 异步 IO

```python
import aiofiles

async def read_file(path):
    async with aiofiles.open(path) as f:
        return await f.read()
```

## 53.6 异步网络

```python
import aiohttp

async def fetch_url(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            return await resp.text()
```

## 53.7 异步生成器

```python
async def gen():
    for i in range(5):
        yield i
        await asyncio.sleep(0.1)

async def main():
    async for item in gen():
        print(item)
```

## 53.8 信号量与限流

```python
sem = asyncio.Semaphore(5)

async def limited():
    async with sem:
        await do_work()
```

## 53.9 异常处理

```python
async def risky():
    raise ValueError("fail")

try:
    await risky()
except ValueError:
    print("caught")
```

## 53.10 取消任务

```python
task = asyncio.create_task(fetch("a"))
await asyncio.sleep(0.5)
task.cancel()
try:
    await task
except asyncio.CancelledError:
    print("cancelled")
```

## 53.11 何时用 asyncio

- 高并发 I/O（网络、数据库）
- 大量连接
- Web 服务器

## 53.12 陷阱

- 同步阻塞代码卡死事件循环
- `await` 只能在 async 函数中
- 协程必须 await 才执行

## 53.13 与线程对比

| 特性 | 线程 | 协程 |
|------|------|------|
| 切换开销 | 大 | 小 |
| 并发数 | 几百 | 几十万 |
| 共享内存 | 是 | 否 |
| 调试 | 难 | 中等 |

## 小结

- asyncio 适合 I/O 密集
- 事件循环调度协程
- `await` 不阻塞
- 避免同步阻塞
