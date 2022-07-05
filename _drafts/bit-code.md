---
layout: post
title: jekyll usecage demo
categories: [Jekyll]
description: jekyll usecage demo
keywords: jekyll
---

有时候会见到一些基于二进制编码的位运算的骚操作，是时候需要回忆一下这些在大学学习完以后就基本再也没用上的计算机基础知识了。

首先考虑以下代码什么含义：

```js
const a = [1, 2, 3]
console.log('it should be [-1]:', a.indexOf(4))
console.log('it should be [0]:', ~-1)
console.log('it should be [true]:', !~-1)

console.log('it should be absolutely equal:', !~a.indexOf(4) === (a.indexOf(4) === -1))
```

这里的魔法其实就是：
* **~**运算符标识按位取反，的到的是某个数基于二进制的**反码**
* -1的反码是0
* !0即对0进行布尔转换，为true
* 核心概念即：原码、反码、补码的计算过程

---

[1] [whats-the-mean-in-javascript](https://stackoverflow.com/questions/28423512/whats-the-mean-in-javascript)

[2] [原码、反码、补码浅析](https://www.cnblogs.com/lonny/p/4282055.html)