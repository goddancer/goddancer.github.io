---
layout: post
title: 核心
categories: [Docker]
description: jekyll usecage demo
keywords: jekyll
---

## 核心概念

### 容器

[特性](https://yeasy.gitbook.io/docker_practice/basic_concept/container)：
* 容器存储的生命周期和容器一样，会在容器删除或者重启时丢失
* 根据Docker最佳实践，容器不应该向存储层写入任何数据，容器存储层需要保持无状态化
* 所有的容器内写入操作，都应该使用`数据卷（Volume）`或者`绑定宿主目录`的方式，这些位置的读写或跳过容器存储层，直接对宿主发生读写，性能和稳定性更高的同时，数据也能持久化。

### 建立docker用户组

* 

---

[1] [Docker-从入门到实践](https://yeasy.gitbook.io/docker_practice/basic_concept/container)