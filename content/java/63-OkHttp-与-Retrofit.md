# 第 17 章 网络

# 63. OkHttp 与 Retrofit

## 学习目标

- 掌握 OkHttp
- 学会 Retrofit
- 理解异步

## 63.1 OkHttp

```java
OkHttpClient client = new OkHttpClient();
Request request = new Request.Builder()
    .url("https://api.example.com")
    .build();

try (Response response = client.newCall(request).execute()) {
    System.out.println(response.body().string());
}
```

## 63.2 异步

```java
client.newCall(request).enqueue(new Callback() {
    public void onResponse(Call call, Response response) {
        // 回调
    }
    public void onFailure(Call call, IOException e) {
        // 失败
    }
});
```

## 63.3 Retrofit

```java
public interface Api {
    @GET("users/{id}")
    Call<User> user(@Path("id") int id);

    @POST("users")
    Call<User> create(@Body User user);
}

Retrofit retrofit = new Retrofit.Builder()
    .baseUrl("https://api.example.com")
    .addConverterFactory(GsonConverterFactory.create())
    .build();

Api api = retrofit.create(Api.class);
api.user(1).enqueue(new Callback<User>() { ... });
```

## 63.4 陷阱

- 同步阻塞
- 未关闭
- 重试

## 63.5 最佳实践

- 异步
- 重试
- 拦截器

## 小结

- OkHttp 现代
- Retrofit 接口
- 异步回调
- 拦截器
