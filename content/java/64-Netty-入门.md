# 第 17 章 网络

# 64. Netty 入门

## 学习目标

- 理解 Netty
- 学会 EventLoop
- 掌握 Channel

## 64.1 安装

```xml
<dependency>
    <groupId>io.netty</groupId>
    <artifactId>netty-all</artifactId>
    <version>4.1.x</version>
</dependency>
```

## 64.2 服务器

```java
ServerBootstrap b = new ServerBootstrap();
b.group(boss, worker)
 .channel(NioServerSocketChannel.class)
 .childHandler(new ChannelInitializer<SocketChannel>() {
     protected void initChannel(SocketChannel ch) {
         ch.pipeline().addLast(new MyHandler());
     }
 });
Channel ch = b.bind(8080).sync().channel();
ch.closeFuture().sync();
```

## 64.3 Handler

```java
public class MyHandler extends ChannelInboundHandlerAdapter {
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        ByteBuf buf = (ByteBuf) msg;
        String s = buf.toString(StandardCharsets.UTF_8);
        ctx.writeAndFlush(Unpooled.copiedBuffer("hello"));
    }
}
```

## 64.4 陷阱

- 内存管理
- 线程模型
- 字节泄漏

## 64.5 最佳实践

- 事件驱动
- 非阻塞
- 内存池

## 小结

- EventLoop
- Channel 管道
- 非阻塞
- 高性能
