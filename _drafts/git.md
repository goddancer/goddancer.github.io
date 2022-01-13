---
layout: post
title: template page
categories: [cate1, cate2]
description: some word here
keywords: keyword1, keyword2
---

## 批量删除远程分支

```shell
git branch -r | grep 'feature/*' | sed 's/origin\///g' | xargs -I @ git push origin -d @
```