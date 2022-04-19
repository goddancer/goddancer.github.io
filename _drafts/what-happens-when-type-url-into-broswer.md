---
layout: post
title: 从浏览器输入URL到页面呈现发生了什么
categories: [Javascript]
description: 从浏览器输入URL到页面呈现发生了什么
keywords: url, browser, http, https, ssl, tcp, dns
---

## 如何判断当前输入的是URL还是搜索的关键字

首先我们需要知道，如果是输入标砖的URL的话，会有以下特征：
* Protocol **http/s://**，使用HTTP或HTTPS协议，同时协议后跟随有效主机名称格式字符(一般是ASCII字符)，此时会按照地址进行请求解析，即使域名不合法，因为在响应之前无法判断域名或地址是否合法
* 比较特殊的是文件协议，如果输入的值为**file://**协议，会根据不同浏览器的安全策略，访问本地资源
* 当协议或者主机不合法时，浏览器会将地址栏中输入的文字传给默认的搜索引擎
  * 大部分情况下，URL会带有一些特定的字符串，用来告知搜索引擎本次搜索来源于哪个浏览器

## 请求前字符转换

* 当用户输入的内容为非ASCII的unicode字符时，会将这部分字符进行编码转换
  * ASCII unicode字符主要为**`a-z`,`A-Z`,`0-9`,`-`,`.`**

## HSTS列表检查

**HSTS是HTTP严格安全传输(HTTP Strict Transport Security)的缩写**，这是一种网站用来声明他们只能使用安全链接HTTPS访问的方法，一般有两种途径：
1. **将域名添加到浏览器HSTS预加载列表**，这个列表是固化在浏览器，随着浏览器版本一同发布的，实在请求发生之前进行检查，从而决定当前请求是否必须使用HTTPS协议发出。**这种预加载的形式是很安全的，因为不会存在网络中间人攻击的可能**
* 申请添加这个列表会比较麻烦，而且周期比较长，因为必须随着浏览器版本发布一同添加或者删除，详细步骤可以参考底部文章
2. **请求时HSTS检查**，为什么说这个是请求时检查呢，因为没有固化到浏览器本地，所以需要通过第一次请求到服务器，由服务器返回声明头`Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`，表示接下来的很长一段时间里(这里是1年)，都必须使用HTTPS进行请求，此时在后续的请求中，不超过缓存时间再次请求同网站，就会强制使用HTTPS请求
* 需要注意的是，这种方式并不够安全，因为加入第一次请求是使用HTTP协议发出，就有可能被中间人拦截，从而导致攻击发生；也正是因为这一点，**HSTS的动态设定，必须透过HTTPS请求才有效**，防止中间人通过劫持HTTP协议请求，对HSTS头进行操作。

## DNS解析



1、 插入图片

```markdown
![same-site]({{site.url}}/mind/cookie/same-site.png)
![same-site]({{site.url}}/assets/images/blog/same-site.png)
```

2、 插入一段可运行代码

```markdown
<iframe name="codemirror" font-size="14" src="{{ site.url }}/public/codemirror/index.html">
</iframe>
```

3、 jekyll自带代码高亮，指定语言即可

```markdown
{\% highlight javascript %}
function hello() {
  console.log('hello world')
}
{\% endhighlight %}
```

4、 在markdown中链接本地文章

```markdown
[Link to a document]({\% link _collection/name-of-document.md %})
<!-- 下面这种写法不需要声明文件后缀 -->
[Name of Link]({\% post_url 2010-07-21-name-of-post %})
```

5、 github gist

```markdown
{\% gist goddancer/909921aefdccd54d88eeab4ea0a9e995 %}
```
{% gist goddancer/909921aefdccd54d88eeab4ea0a9e995 %}

---

[1] [HSTS](https://segmentfault.com/a/1190000022316260)

[2] [what-happens-when](https://github.com/skyline75489/what-happens-when-zh_CN)