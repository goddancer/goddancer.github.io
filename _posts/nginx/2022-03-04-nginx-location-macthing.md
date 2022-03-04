---
layout: post
title: nginx location匹配规则 
categories: [Nginx]
description: nginx location匹配规则
keywords: nginx, location, reg 
---

> A location can either be defined by a prefix string, or by a regular expression. Regular expressions are specified with the preceding “~*” modifier (for case-insensitive matching), or the “~” modifier (for case-sensitive matching). To find location matching a given request, nginx first checks locations defined using the prefix strings (prefix locations). Among them, the location with the longest matching prefix is selected and remembered. Then regular expressions are checked, in the order of their appearance in the configuration file. The search of regular expressions terminates on the first match, and the corresponding configuration is used. If no match with a regular expression is found then the configuration of the prefix location remembered earlier is used.

## 匹配规则

**上面一段来自nginx官方文档的引言，已经基本阐明了location的匹配规则**

location的匹配声明一般以前缀字符串或正则表达式开头，其中：
* 前缀字符串:
  * 纯字符串开头的匹配，优先级很低，可能会被正则规则覆盖，参考匹配逻辑
  * 以`^~`修饰符开头：所有命中的字符串匹配规则中，最长的一个，直接执行，**忽略正则匹配**
  * 以`=`修饰符开头：表示**精确匹配，一旦命中，直接执行**。通常将可以精确匹配的频繁发生的请求，放到nginxConfig声明头部，利于精确匹配的特性，提升响应效率
* `~*`修饰符开头：表示不区分大小写的匹配规则
* `~`修饰符开头：表示区分大小写的匹配规则

### 匹配逻辑

一般匹配规则：
* 首先检查通过前缀字符串声明的location表达式；如果能命中规则的话，记录其中描述最详细的一个表达式
* 然后检查通过正则声明的location表达式：
  * 按照正则表达式的声明顺序，从上至下检索，一旦命中，则直接执行对应location配置内容
  * 如果没有命中的正则声明，则采用之前记录的前缀字符串声明，执行对应的location配置内容
* **需要注意对于如macOS这种不区分大小写的系统，匹配前缀字符串会忽略大小写**

特殊匹配规则：
* 前缀字符串以`^~`修饰符开头的，如果有字符串命中，取最长的一个，直接执行
* 前缀字符串以`=`修饰符开头的，第一个命中的，直接执行

### 通过题目理解

```nginx
location = / {
    [ configuration A ]
}

location / {
    [ configuration B ]
}

location /documents/ {
    [ configuration C ]
}

location ^~ /images/ {
    [ configuration D ]
}

location ~* \.(gif|jpg|jpeg)$ {
    [ configuration E ]
}
```

1. the '/' request will match A
  * 精确匹配，优先级最高
2. the '/index.html' request will match B
  * 无特殊字符串修饰符规则命中
  * 普通字符串匹配，命中B
  * 无正则命中，执行B
3. the '/document/document.html' request will match C
  * 无特殊字符串修饰符规则命中
  * 普通字符串匹配，命中C
  * 无正则规则命中
  * 执行C
4. the '/images/1.gif' will match D
  * 有特殊字符串修饰符`^~`命中，同时为命中逻辑最长一项，直接执行D
5. the '/documents/1.jpg' will match E
  * 无特殊字符串修饰符规则命中
  * 普通字符串匹配，命中C
  * 正则匹配命中E
  * 正则优先级高，执行E

## 其他特殊匹配规则

### @修饰符

> The “@” prefix defines a named location. Such a location is not used for a regular request processing, but instead used for request redirection. They cannot be nested, and cannot contain nested locations.

@修饰符是用来定义`named location`的，可以理解为是独立于字符串前缀location和正则location之外的类型。
主要是用来处理内部重定向`internally redirected`请求的。
内部重定向可以理解为`proxy_pass`内部转发比较合适。

```nginx
server {
  listen 9090;
  server_name localhost;

  location / {
    root html;
    index index.html index.htm;
    allow all;
  }

  #error_page 404 http://www.baidu.com # 直接这样是不允许的

  error_page 404 = @fallback;
  location @fallback {
    proxy_pass http://www.baidu.com;
  }
}
```

通过以上代码理解@修饰符，当访问到一个不存在页面，触发了404错误，会自动执行到语句`error_page 404`处，即触发`location @fallbak`，此时当前访问会被转发到百度进行响应；
假如百度nginx能存在当前request的目标路径资源，则正常返回响应；
否则会继续触发百度的404规则。

### 隐式301

> If a location is defined by a prefix string that ends with the slash character, and requests are processed by one of proxy_pass, fastcgi_pass, uwsgi_pass, scgi_pass, memcached_pass, or grpc_pass, then the special processing is performed. In response to a request with URI equal to this string, but without the trailing slash, a permanent redirect with the code 301 will be returned to the requested URI with the slash appended.

以一个例子说明

```nginx
location /user/ {
  proxy_pass http://user.example.com;
}
```

**当定义了以上的配置时，为了使`/user`的request也能够响应到`/user/`下的`proxy_pass`，会自动给`/usr`做301到`/user/`**

可以通过**精确匹配**的方式规避这个问题

```nginx
location /user/ {
  proxy_pass http://user.example.com;
}
location = /usr {
  proxy_pass http://login.example.com;
}
```
 
---

[1] [nginx-location](http://nginx.org/en/docs/http/ngx_http_core_module.html#location)