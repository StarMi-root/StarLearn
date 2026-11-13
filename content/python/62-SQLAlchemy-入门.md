# 第 13 章 数据库

# 62. SQLAlchemy 入门

## 学习目标

- 理解 ORM
- 掌握模型定义
- 学会查询与会话

## 62.1 安装

```bash
pip install sqlalchemy
```

## 62.2 基本设置

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine("sqlite:///data.db")
Session = sessionmaker(bind=engine)
```

## 62.3 定义模型

```python
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True)

# 建表
Base.metadata.create_all(engine)
```

## 62.4 插入

```python
session = Session()
user = User(name="Alice", email="alice@example.com")
session.add(user)
session.commit()
session.close()
```

## 62.5 查询

```python
session = Session()
user = session.query(User).filter_by(name="Alice").first()
print(user.email)

# 所有
users = session.query(User).all()

# 条件
users = session.query(User).filter(User.name.like("%li%")).all()
```

## 62.6 更新

```python
user.name = "Bob"
session.commit()
```

## 62.7 删除

```python
session.delete(user)
session.commit()
```

## 62.8 关系

```python
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    orders = relationship("Order", back_populates="user")

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="orders")
```

## 62.9 会话管理

```python
# 上下文管理器
with Session() as session:
    user = User(name="Alice")
    session.add(user)
    session.commit()

# 或
session = Session()
try:
    ...
    session.commit()
except:
    session.rollback()
    raise
finally:
    session.close()
```

## 62.10 高级查询

```python
from sqlalchemy import func, and_

# 聚合
count = session.query(func.count(User.id)).scalar()

# 复杂条件
session.query(User).filter(and_(
    User.name.like("%li%"),
    User.id > 10
)).all()
```

## 62.11 迁移（Alembic）

```bash
pip install alembic
alembic init migrations
# 编辑 alembic.ini
alembic revision --autogenerate -m "init"
alembic upgrade head
```

## 62.12 性能

- 懒加载 vs 急加载
- `session.query(User).options(eagerload(User.orders))`
- 避免 N+1

## 62.13 陷阱

- 会话生命周期
- 未 commit
- N+1 查询
- 大对象

## 62.14 与 SQLite 对比

| 特性 | SQLite | SQLAlchemy |
|------|--------|------------|
| 抽象层 | 直接 SQL | ORM |
| 学习曲线 | 低 | 中 |
| 跨数据库 | 单一 | 多 |
| 生产 | 轻量 | 通用 |

## 小结

- ORM 减少 SQL
- 模型定义表
- 会话管理
- 关系映射
