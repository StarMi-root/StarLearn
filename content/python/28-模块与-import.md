# 第 6 章 模块与包

# 28. 模块与 import

## 学习目标

- 理解模块系统
- 学会 import 的几种形式
- 掌握 __name__ 与 __main__
- 避免导入陷阱

## 28.1 模块即文件

```python
# utils.py
def helper(x):
    return x * 2
```

```python
# main.py
import utils
print(utils.helper(5))  # 10
```

## 28.2 导入形式

### import module

```python
import os
os.getcwd()
```

### import module as alias

```python
import numpy as np
np.array([1, 2, 3])
```

### from module import name

```python
from os import path
path.exists("/tmp")
```

### from module import a, b as c

```python
from math import pi, sqrt as s
```

### import *

```python
from math import *
# 不推荐：污染命名空间
```

## 28.3 模块缓存

```python
import sys
print("math" in sys.modules)  # True（已导入的模块被缓存）
```

## 28.4 __name__ 与 __main__

```python
# mymodule.py
def main():
    print("running main")

if __name__ == "__main__":
    main()
```

- 直接运行：`__name__ == "__main__"`
- 被导入：`__name__ == "mymodule"`

## 28.5 循环导入

```python
# a.py
import b
def f(): return b.g() + 1

# b.py
import a
def g(): return 1
```

解决：
- 重构，把共享部分提取到新模块
- 在函数内部延迟导入
- 使用 TYPE_CHECKING 注解

## 28.6 延迟导入

```python
def process():
    import heavy_module
    return heavy_module.run()
```

只在需要时导入，加速启动。

## 28.7 包（package）

目录有 `__init__.py` 即为包：

```
mypackage/
  __init__.py
  subpackage/
    __init__.py
    module.py
```

## 28.8 命名空间包（Python 3.3+）

没有 `__init__.py` 的目录也可作为包（命名空间包）。

## 小结

- `import module` 最清晰
- 避免 `from module import *`
- 用 `__main__` 区分运行与导入
- 循环导入要重构
