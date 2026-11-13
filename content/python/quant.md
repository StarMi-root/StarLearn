---
title: Python 量化交易入门：数据、回测与风险
description: 用 Python 处理行情数据、计算收益、做简单均线策略回测，理解滑点、手续费、过拟合与最大回撤。
category: python
order: 9
tags: [量化交易, Python, 回测, 风险控制]
updated: 2026-11-13
---

# Python 量化交易入门：数据、回测与风险

量化交易用数据和程序辅助投资决策，不是“找到必胜公式”。学习时先建立正确流程：**获取数据 → 清洗 → 形成假设 → 回测 → 评估风险 → 小规模验证**。任何回测收益都不等于未来收益。

:::danger 风险提示
本教程仅用于编程与量化研究方法学习，不构成投资建议。市场有风险，历史回测可能因过拟合、幸存者偏差、滑点和手续费而严重高估收益。
:::

## 行情数据长什么样

最常见的日线数据包含：日期、开盘、最高、最低、收盘、成交量。

```python
import pandas as pd

df = pd.read_csv("prices.csv", parse_dates=["date"])
df = df.sort_values("date").drop_duplicates("date")
df = df.dropna(subset=["close"])
print(df.tail())
```

需要检查：

- 日期是否连续，是否有停牌和缺失。
- 价格是否复权，分红送股会制造假跳空。
- 成交量是否为 0，是否包含未来数据。
- 数据来源是否可靠，时间戳是否对应收盘后。

## 收益与波动

简单收益率：

```python
df["return"] = df["close"].pct_change()
```

累计净值：

```python
df["equity"] = (1 + df["return"].fillna(0)).cumprod()
```

年化波动率常用日收益标准差乘 `sqrt(252)`：

```python
annual_vol = df["return"].std() * (252 ** 0.5)
```

最大回撤衡量从历史高点到低点的最大损失：

```python
running_max = df["equity"].cummax()
drawdown = df["equity"] / running_max - 1
max_drawdown = drawdown.min()
```

## 一个简单的均线策略

规则：短期均线上穿长期均线买入，下穿卖出。这里只做多头、全仓、日线收盘执行，目的是学习回测结构，不是推荐策略。

```python
short_window = 20
long_window = 60

df["ma_short"] = df["close"].rolling(short_window).mean()
df["ma_long"] = df["close"].rolling(long_window).mean()
df["signal"] = (df["ma_short"] > df["ma_long"]).astype(int)
df["position"] = df["signal"].shift(1).fillna(0)
df["strategy_return"] = df["position"] * df["return"]
df["strategy_equity"] = (1 + df["strategy_return"]).cumprod()
```

`shift(1)` 很重要：今天收盘后才能知道均线信号，不能假设用当天收盘价成交。否则就是“未来函数”，回测会虚高。

## 加入手续费与滑点

```python
fee_rate = 0.0003
slippage = 0.0005

df["trade"] = df["position"].diff().abs().fillna(0)
df["cost"] = df["trade"] * (fee_rate + slippage)
df["net_return"] = df["strategy_return"] - df["cost"]
df["net_equity"] = (1 + df["net_return"]).cumprod()
```

交易越频繁，成本影响越大。很多策略在忽略成本时赚钱，加上手续费和滑点后收益消失。

## 评估指标

| 指标 | 含义 | 注意点 |
| --- | --- | --- |
| 年化收益 | 收益按年折算 | 样本短时不可靠 |
| 最大回撤 | 最大峰值到谷底损失 | 决定能否坚持持有 |
| 夏普比率 | 单位波动获得的超额收益 | 假设收益近似正态 |
| 胜率 | 盈利交易占比 | 高胜率也可能亏大钱 |
| 盈亏比 | 平均盈利/平均亏损 | 要和胜率一起看 |
| 换手率 | 交易频率 | 影响成本和容量 |

不要只优化收益率。一个年化 30%、最大回撤 60% 的策略，很多人拿不住；一个年化 10%、回撤 8% 的策略可能更实用。

## 过拟合与样本外测试

常见错误：

1. 反复调参数，直到历史曲线最好看。
2. 只用一段牛市数据。
3. 忽略停牌、涨跌停和流动性。
4. 用未来数据计算信号。
5. 用同一段数据既调参又评估。

基本做法：把数据分成训练段、验证段和样本外测试段；保留最终测试集，直到策略定型才使用一次。参数越少、逻辑越简单，越不容易过拟合。

## 组合与仓位

不要把所有资金压在一个信号上。常见控制：

- 单标的最大仓位。
- 总仓位上限。
- 止损/止盈规则。
- 波动率目标：波动大时降低仓位。
- 相关性控制：避免持有高度相关的资产。

```python
target_weight = min(0.2, 0.1 / max(annual_vol, 0.01))
```

这只是一个示例，不是投资建议。真实系统还要考虑保证金、流动性和极端行情。

## 回测之外

回测通过只是第一步。还需要：

- 模拟盘/纸上交易验证执行逻辑。
- 小资金实盘验证滑点和成交。
- 监控数据延迟、订单失败、异常波动。
- 保留交易日志和归因分析。
- 定期再评估策略是否失效。

## 练习：量化基础

:::quiz
question: 回测中使用 `shift(1)` 的主要目的是？
options:
  - "让数据更整齐"
  - "避免用未来信息计算当天信号"
  - "提高收益率"
  - "减少数据量"
answer: B
explain: 当天收盘后才能得到信号，最早下一期执行，避免未来函数。
:::

:::quiz
question: 最大回撤衡量的是？
options:
  - "平均收益"
  - "从历史高点到低点的最大损失"
  - "交易次数"
  - "手续费总额"
answer: B
explain: 最大回撤反映最坏持有体验和风险。
:::

:::quiz
question: 忽略手续费和滑点会导致？
options:
  - "回测收益被低估"
  - "回测收益被高估"
  - "没有影响"
  - "数据自动修复"
answer: B
explain: 真实交易有成本，忽略成本会高估策略表现。
:::

:::quiz
question: 反复调参数直到历史收益最高，主要风险是？
options:
  - "过拟合"
  - "数据太少"
  - "代码太短"
  - "手续费太低"
answer: A
explain: 过度拟合历史噪声，样本外很可能失效。
:::

:::quiz
question: 量化策略上线前，较合理的验证顺序是？
options:
  - "直接满仓实盘"
  - "回测 → 样本外 → 模拟盘 → 小资金"
  - "只看一条收益曲线"
  - "删除所有风险控制"
answer: B
explain: 逐步验证能暴露执行、成本和极端行情问题。
:::

## 下一步

- 用真实但合规的数据集重做一次回测。
- 加入基准对比和交易日志。
- 阅读《Pandas》与《Matplotlib》教程，提升数据处理和可视化能力。
