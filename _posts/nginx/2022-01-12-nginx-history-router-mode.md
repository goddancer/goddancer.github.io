---
layout: post
title: nginx配合history路由模式
categories: [nginx]
description: nginx配合history路由模式
keywords: nginx, router, history
---

> `rewrite ^/(.*) /index.html break;`

```nginx
server {
  listen 80;
  server_name dev.example.com;

  access_log /data/logs/nginx/dev.log;
  error_log /data/logs/nginx/dev_err.log;

  location ~* \.(js|css|jpg|jpeg|gif|png|swf)$ {
    root html/project;
  }

  location / {
    root  html/project;
    #index  index.html index.htm;
    rewrite ^/(.*) /index.html break;
  }

  error_page 500 502 503 504  /50x.html;

  location = /50x.html {
    root html;
  }
}
```