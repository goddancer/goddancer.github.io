---
layout: post
title: javascript defer async
categories: [Javascript]
description: javascript defer async
keywords: defer, async
---

## 知识前提

**HTML文档顺序解析，遇到资源以后，解析、执行，完成以后再回到html对应位置，继续向下解析html。主流浏览器一般有自己的优化策略**

可能的特征如下：
* 资源遵循阻塞机制，从上至下解析html，遇到css、js以后，进行下载，解析执行，完成以后再回到html对应位置，继续执行
* image的加载不会阻塞线程
* 一般有6个并行资源下载，如果资源分布在不同的域名服务下，则会按照域名服务区分，分别6个并行资源下载

主流浏览器优化策略：
* chrome在解析html过程中，遇到js以后，会先快速过一下接下来需要加载资源，如果有css资源的话，会在加载完当前资源以后，优先加载css资源，然后再回来继续加载js资源

## js加载执行模式

### 默认模式

![默认加载模式]({{site.url}}/assets/images/blog/default-js-load.png)

具有以下特征：
* 顺序执行资源的加载，资源执行会阻塞后续线程，加载不会
* 同步加载，直到遇到结束</html>标记，此时执行DOMContentLoaded事件
* 待所有资源，css、js、images、flash等均加载完成以后，才会触发window.onload事件

### defer模式

![defer模式]({{site.url}}/assets/images/blog/defer.png)

具有以下特征：
* 从<html>至</html>开始解析，遇到script以后，异步下载，当下载完成以后，等待直至document pasring done以后，再执行js
* 注意document parsing done并不是DOMContentLoaded，js执行完成以后，DOMContentLoaded才会fire。（这里可以理解为，DOM包含所有形式的标签，js也算）
* **模式的意义**
  * 需要注意defer策略的script需要放到文档顶部的head里面才有意义，才能充分利用script的异步下载、延迟执行的特性，进而优化页面性能，提升响应速度

### async模式

![async模式1]({{site.url}}/assets/images/blog/async1.png)
![async模式2]({{site.url}}/assets/images/blog/async2.png)

具有以下特征：
* js会在解析遇到以后即开始加载，加载完成以后即开始执行，执行会阻塞后续线程
* js脚本加载不计入DOMContentLoaded事件统计，即有可能DOMContentLoaded先于js之前fire

## 实际测试

### DOMContentLoaded的执行时机

* 当vue main.js中不存在宏任务时，DOMContentLoaded会在宏任务执行之前执行
* 当vue main.js中，只存在**微任务**时，DOMContentLoaded会在**微任务执行之后执行**
* 当使用setTimeout延迟执行vue挂载时，DOMContentLoaded会先于vue实例渲染之前执行
* DOMContentLoaded会在页面html解析完成以后，DOM挂载，css、js加载执行完成后fire
* 当存在宏任务时，DOMContentLoaded会先于非页面顶部的宏任务之前执行

### 关于window.onload

* 可以任务window.onload总是最后执行，执行时机可以认为是一切就绪以后
* window.onload总是在DOMContentLoaded之后执行
* window.onload存在覆盖问题，总是后面的声明覆盖前面的
* 可以认为页面总是最后执行DOMContentLoaded和window.onload

---

[1] [时序图1](https://www.cnblogs.com/jiasm/p/7683930.html)
[2] [时序图2](https://blog.csdn.net/qq_22672291/article/details/79650216)