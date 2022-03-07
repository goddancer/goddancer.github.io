---
layout: post
title: nginx rewrite与history路由模式
categories: [Nginx]
description: nginx rewrite与history路由模式
keywords: nginx, router, history, rewrite
---

> [location匹配规则参考]({% link _posts/nginx/2022-03-04-nginx-location-macthing.md %})

## history路由模式

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

## nginx rewrite

> 如果不写last和break，将依次执行声明的rewrite

### rewrite break

> url重写后，直接使用当前资源，不执行location里余下的语句。完成本次请求，地址栏url不变。

```nginx
location / {
  root html;
  rewrite ^/(.*) /index.html break;
}
```

### 301 rewrite permanent

> 返回HTTP_CODE 301，浏览器地址栏显示重定向以后的地址，爬虫更新URL

**301 不携带path，固定首页**
```nginx
location / {
  root html;
  rewrite ^/(.*)$ http://example.com/ permanent;
}
```

**301 携带path，相当于仅切换域名**

```nginx
location / {
  root html;
  rewrite ^/(.*)$ http://example.com/$1 permanent;
}
```

### 302 rewrite redirect

> 返回HTTP_CODE 302，浏览器地址不变，爬虫不更新URL

**不加`permanent`就是302**

```nginx
# 不携带path
location / {
  root html;
  rewrite ^/(.*)$ http://example.com/;
}
```

```nginx
# 携带path
location / {
  root html;
  rewrite ^/(.*)$ http://example.com/$1;
}
```




