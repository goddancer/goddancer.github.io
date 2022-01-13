---
layout: post
title: share data between cross subdomain page safety
categories: [javascript, scenes]
description: how to share data between cross subdomain page safety
keywords: storage, share data
---

* siteA：m.example.com
* siteB：login.example.com

> 当`cross subdomain`进行页面通信时，siteA和siteB如何安全的传递数据呢？

## 基本思路

想要实现数据通信，一般有两种方式：
1. 透过网络
2. 本地通信

想要实现安全的数据通信，一般我们更倾向于本地通信，因为不存在网络传播的风险

## localStorage

我们都知道，localStorage遵循**Document同源安全策略**进行数据存储访问，那有没有可能通过设置`document.origin`进行降域，达到同源的效果，进而通过`localStorage`进行安全的本地通信呢？

---

reference：

[1] [safari-localstorage-not-shared-between-iframes-hosted-on-same-domain](https://stackoverflow.com/questions/63922558/safari-localstorage-not-shared-between-iframes-hosted-on-same-domain)