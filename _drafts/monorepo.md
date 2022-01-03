---
layout: post
title: template page
categories: [cate1, cate2]
description: some word here
keywords: keyword1, keyword2
---

1、通过root dir整合公共依赖资源，如webpack、bable、ts、eslint、prettier等，目的是使单monorepo架构项目集合的各个子项目规范宏观一致
2、每个子项目都应该严格有自己的dependence以及devDependence，及时yarn会hoist，也需要有严格的依赖声明，使得项目迁移变得简单
3、
