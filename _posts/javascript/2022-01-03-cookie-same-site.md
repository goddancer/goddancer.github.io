---
layout: post
title: Cookie SameSite
categories: [browser, cookie]
description: Cookie SameSite info and example
keywords: cookie, sameSite, browser
---
![same-site]({{site.url}}/mind/cookie/same-site.png)

## 知识前提

### 1、eTLD

> 效顶级域名eTLD(effective top level domain)

只有知道页面的eTLD是什么([如何判断？](...))，才好通过eTLD+1判断请求与页面的同源情况。

有一些特殊的域名，看起来是同源的，但是实际并不同源，如github.io，即a.github.io和b.github.io并不同源，实际是两个不同的域名，并不是子域名关系。

关于eTLD的完整列表清单，可以参考Mozilla Foundation维护的[Public Suffix List](https://publicsuffix.org/)

### 2、同站与跨站

什么是同站呢，eTLD+1相同，即为同站。

如：a.example.com和b.example.com。首先我们知道eTLD是com，两者的eTLD+1为example.com，则为同站。

## SameSite

### 1、Cookie携带遵循同站同源策略

cookie的携带遵循同站同源策略，即a.example.com下可以携带a.example.com和example.com下的cookie，但不可以携带eTLD+1不相关的站点Cookie。

只要为同站，则会有可以携带的cookie，可携带范围为eTLD+1，eTLD+n(若同)，location.hostname(若同)。

### 2、SameSite行为对比

![SameSite行为对比]({{site.url}}/mind/cookie/same-site-action.png)

## example

### 1、SameSite=None

> 在不违背Cookie携带策略的前提下，无论是same-site还是cross-site，都可以携带cookie

> 设置SameSite=None需要特别注意，为了行为可预期，需要使用HTTPS协议，设置为`Set-Cookie: SameSite=None; Secure`

#### case1

site: a.example.com

request: picture.com

answer: 将会携带cookie前往picture.com，因为设置了SameSite=None

#### case2

site: a.example.com

request: picture.example.com

answer: 将会携带cookie前往picture.com，因为设置了SameSite=None

### 2、SameSite=Strict

> 仅当Site的eTLD+1与request的eTLD+1相同时，才会携带cookie

#### case1

site: a.example.com

request: picture.com

answer: eTLD+1不同，不会携带cookie

#### case2

site: a.example.com

request: picture.example.com

answer: eTLD+1相同，会携带example.com下的cookie

#### case3

site: a.example.com

request: a.example.com

answer: eTLD+1、location.hostname相同，会携带example.com以及location.hostname下的cookie

### 3、SameSite=Lax

> 浏览器默认值。仅页面顶级导航`<a href="...">`、资源预加载`<link rel="prerender" src="..." />`、GET表单提交`<from method="GET" action="...">`会携带cookie

#### case1

site: a.example.com

request: `<a href="picture.com">`

answer: eTLD+1不同，但SameSite=Lax，且request element为页面顶级导航a链接，会携带picture.com下的cookie

#### case2

site: a.example.com

request: `<link rel="prerender" src="picture.com" />`

answer: eTLD+1不同，但SameSite=Lax，且request element为资源预加载，会携带picture.com下的cookie

#### case3

site: a.example.com

request: `<from method="GET" action="picture.com">`

answer: eTLD+1不同，但SameSite=Lax，且request element为form GET，会携带picture.com下的cookie

---

reference:

[1] [MDN：SameSite Cookies](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Set-Cookie/SameSite)

[2] [hrome-80-後針對第三方-cookie-的規則調整-default-samesite-lax](https://ianhung0529.medium.com/chrome-80-%E5%BE%8C%E9%87%9D%E5%B0%8D%E7%AC%AC%E4%B8%89%E6%96%B9-cookie-%E7%9A%84%E8%A6%8F%E5%89%87%E8%AA%BF%E6%95%B4-default-samesite-lax-aaba0bc785a3?p=aaba0bc785a3)

[3] [github issue](https://github.com/mqyqingfeng/Blog/issues/157)

[4] [阮一峰：Cookie的SameSite属性](https://www.ruanyifeng.com/blog/2019/09/cookie-samesite.html)