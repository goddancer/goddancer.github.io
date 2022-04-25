---
layout: post
title: template page
categories: [SSR]
description: some word here
keywords: nextjs, ssr
---

## SSR

* 在服务器端根据请求，或者提前，将对应路由页面compile静态化，使得下一次请求到来时，能够直接响应，返回html
* 在服务器端将需要使用的接口数据提前请求，采用全局变量的方式，填充到html script，在页面建立运行时以后，可以利用；
* 部分展示类的首屏数据，可以直接构建出来(适用于简单页面)

### 同构渲染

同构渲染简单来说就是：
* 服务端先通过服务端渲染SSR，生成html和初始化数据；
* 客户端拿到html代码和初始化数据以后，对DOM进行patch和事件绑定(client-side hydration，也称客户端激活)；

### SSR的问题

* 同构资源处理问题。因为SSR可以调用的生命周期只有`beforeCreated`和`created`，这就导致在使用第三方API时，需要保证不因为兼容性产生报错。
* 缓存问题。高流量应用场景，需要考虑更多的缓存处理问题。

---

[1] [当NestJS遇上Next.js](https://www.lingjie.tech/article/2021-01-04/28)
[2] [除了 SSR，就没有别的办法了吗](http://www.thewashingtonhua.com/blog/2019/02/07/explore-static-site-generation)
