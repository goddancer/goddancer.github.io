---
layout: post
title: webpack core
categories: [Webpack]
description: webpack core
keywords: webpack, loaders, plugins
---

## 前端为什么需要打包器

* 不是所有的浏览器都直接支持JS规范(最新/所有特性)
* 脚本之间的依赖关系、加载顺序需要管控
  * 传统脚本加载处理方式：
    * 每个脚本存放单独的功能
      * 脚本太多，加载浪费并发请求数，性能差
      * 脚本之间依赖关系不清晰
      * 脚本污染全局作用域
    * 单独一个脚本存放所有功能
      * 维护困难、可读性差
      * 作用域难以管理

## webpack

### 工作原理

了解`loader`和`plugin`工作时机之前，我们首先需要知道`webpack`工作原理：
* `webpack`通过`entry`入口索引机制，进行依赖解析检索
  * 我们所有的依赖都是一个个可以被`webpack`解析的`module`模块
* 对每个`module`进行`loader`匹配处理
  * 主要注意同reg(eg: `test: /\.jsx?$/`)规则声明下，`loader`从后向前解析
  * 最开始的`loader`接收`source`，后面的每个`loader`接收前面`loader`的返回值
* 所有loader合并为`chunk`，在这个阶段，`plugin`可以介入进行`enhance`处理
* `chunk`经过`plugin`处理/拆分，生成`bundle`
  * `bundle`即最终能被浏览器识别的最终文件

### Loaders and Plugins 工作时机

**Loaders**：
* **Loaders work at the <b style="color: red;">individual file(module) level</b> during or before the bundle is generated.**

**Plugins**:
* **Plugins work at <b style="color: red;">bundle or chunk level</b> and usually work at the end of the bundle generation process.**
* **Plugins can also modify how the bundles themselves are created.**
* **Plugins have more powerful control than loaders.**

二者工作时机可以参考下图：

![loaders and plugins work time]({{site.url}}/assets/images/webpack/03.svg)

### 实现一个loader

### 实现一个plugin

---

[1] [webpack-loaders-vs-plugins-whats-the-difference](https://stackoverflow.com/questions/37452402/webpack-loaders-vs-plugins-whats-the-difference/46176755#46176755)

[2] [hash-chunkhash-contenthash]({% link _posts/webpack/2021-05-19-hash-chunkhash-contenthash.md %})
