---
layout: post
title: Vue3渲染流程
categories: [Vue]
description: Vue3渲染流程
keywords: vue3, render, reactive, compile
---

## 组件Render流程

![vue3-render-category]({{site.url}}/assets/images/vue3/render/render-line.jpg)

当组件内容更改时，render函数将重新运行，创建另一个VDom，然后将新、旧两份VNode数据交付Vue进行对比，以采用高效更新方式渲染。

需要注意，渲染函数render function和virtual dom是两回事：
* render function的产物是virtual dom节点数据
* Mount Phase和Patch Phase需要可量化的数据结构，方便数据处理，所以VNode可以理解为JSON数据
* 我们通过算法，处理这部分数据，使之高效转化

## Vue的三个核心模块

![vue3-render-category]({{site.url}}/assets/images/vue3/source-code/01.jpg)

* 响应式模块 the reactivity module
* 编译器模块 the compiler module
* 渲染模块 the render module

### 1. Reactivity Module

![vue3-render-category]({{site.url}}/assets/images/vue3/source-code/02.jpg)

* 允许我们创建响应式js对象，当使用响应式对象的代码运行时，它们会被跟踪(tracked)；
* 如果响应式对象发生变化，它们可以在后台运行(tirgger);

### 2. Compiler Module

![vue3-render-category]({{site.url}}/assets/images/vue3/source-code/03.jpg)

* 可以将template模版代码编译成**渲染函数**；
* 这个过程可以发生在浏览器的运行时，但是在构建Vue项目时更常见(这样浏览器就能只接受渲染函数，达到性能优化的目的)；
* **所以说Vue更像一个编译时优化的运行时框架；React是纯运行时的吗？**

### 3. Render Module

![vue3-render-category]({{site.url}}/assets/images/vue3/source-code/04.jpg)

* render分为三个阶段：
  * Render Phase：在渲染阶段，render function执行，返回virtual DOM node
  * Mount Phase：在挂载阶段，根据virtual DOM node调用DOM API来创建真实节点
  * Patch Phase：在补丁阶段，渲染器将旧的virtual DOM和新的virtual DOM进行diff，只更新网页发生变化的部分

![vue3-render-category]({{site.url}}/assets/images/vue3/source-code/05.png)

## 整体渲染更新流程

* 首先，模版编译器将HTML编译为渲染函数；
* 然后，使用响应式模块初始化reactive obj
* 接下来，在渲染模块中，我们进入渲染阶段：
  * Render Phase：
    * render function引用了响应对象，响应对象本身正在监听变化情况；
    * render function返回了一个虚拟DOM节点
  * Mount Phase：
    * 挂载阶段，我们使用Virtual DOM节点创建web页面
  * Patch Phase：
    * 如果我们的响应对象发生任何变化，渲染器再次调用render函数，生成一份新的VNode节点数据；
    * 新旧两份VNode数据发送给patch function；
    * patch function对比(diff)新旧两份数据，以最高效的方式将变更还原到页面；

需要注意的是：
* *首先，render function内部使用到了init obj的对象值(引用)*
    * *然后，我们将init obj的值响应式初始化处理，此时任何**访问/修改**响应式对象的行为我们都能接收到通知*
    * *最后，此时render fn对于普通对象的引用会成为对响应式对象的引用，使得：*
      * ***当响应式对象发生访问时，我们可以track render fn作为依赖***
      * ***当响应式对象发生更新时，我们可以trigger render fn拿到新的VDom数据***
      * 当然，这里面还会有re-compile的工程，即根据template上下文的变化，重新生成render fn
* 每一个tempalte都会生成一个render函数，所以diff会结合compile静态分析以及reactivity响应式变量获取在局部做patch

## Vue3优化

![vue3-render-category]({{site.url}}/assets/images/vue3/optimize/01.jpg)

我们知道使用inline函数的方式书写click触发事件时，其实无论在Vue还是React中，都会导致子组件被重新渲染，因为本质上inline function每次都是一个new fn，指向的地址发生了变化，导致了不必要的更新：
* 在React中，我们可以使用useCallback声明函数缓存，当依赖变化时，重新执行函数，渲染子组件
* 在vue中，我们是通过compile进行自动优化的，更多的发生在vue静态模版分析阶段
  * 如上图，我们将inline fn使用句柄缓存的方式进行缓存，同时缓存函数的调用主体(this)指向ctx`_ctx.onClick($event)`，也就是说每次执行onClick函数，都会去ctx上下文获取最新的函数，即使onClick函数内部发生了变化，也不会导致问题
    * **一句话说明就是，我们自动缓存了inline fn的引用指向，引用本身始终指向上下文中最新的函数执行体本身**
    * 所以这里的template节点，经过静态分析、处理以后，其实就相当于静态节点，后续不需要再做无关的diff，因为它对vnode本身没有影响
* inline function主要有两种形式：
  * `@click="() => fn()"`
  * `@click="fn(123)"` 这其实是一种隐式的inline function

---

[1] [bilibili video](https://www.bilibili.com/video/BV1rC4y187Vw?p=1)
