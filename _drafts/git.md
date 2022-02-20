---
layout: post
title: git use case
categories: [git]
description: git use case
keywords: git
---

## 批量删除远程分支

```shell
git branch -r | grep 'feature/*' | sed 's/origin\///g' | xargs -I @ git push origin -d @
```