---
layout: post
title: Nginx重启报错-kill failed
categories: [Nginx]
description: nginx alert kill failed, no such process
keywords: nginx, reload, kill failed, no such process
---

有时候一台机器上可能安装了几个版本的nginx，直接进行`nginx -t && nginx -s reload`执行，会提示`nginx: [alert] kill(3130750, 1) failed (3: No such process)`

---

[1] [Nodejs打包构建时长优化](https://www.cnblogs.com/Dev0ps/p/15509671.html)