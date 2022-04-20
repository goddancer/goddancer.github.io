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

## SSL

**SSL是基于非对称加密的对称加密通信。**
所谓对称加密即幂等加密，即加密和解密使用同一密钥，安全性相对较差；非对称加密即加密和解密使用不同的密钥进行，加解密分离，从而避免了网络传播导致的不安全因素。
但是因为非对称加密计算开销较大，导致性能相对较差，在web环境，网络不稳定，体验对响应要求高的条件下，完全使用非对称加密是很浪费性能，不够优化的。
使用非对称加密建立安全通信，下发对称密钥的方式，相对会优化很多。
### 握手过程

* 客户端给出HTTP协议版本号，一个客户端生成的随机数，以及客户端支持的加密算法，给到服务器
* 服务器选定加密算法，并下发CA证书到客户端，同时附带一个服务器生成的随机数
* 客户端确认CA证书的有效性，然后生成一个新的随机数，同时使用数字证书中的公钥进行加密，发送给服务器
* 服务器使用私钥解密，获取客户端发送的随机数
* 双方根据约定好的算法，使用前面的三个随机数生成一个临时会话密钥(session)，加密接下来的整个对话过程

其中有几个点需要注意：
* 在生成有效session之前的通信并不是绝对安全的，所以才需要用到随机数机制
* 因为客户端和服务器都不信任对方提供的随机数是真随机，或者说为了增加随机数的安全性，双方都会提供一个自己生成的随机数作为混淆向量
* 真正保证session安全性的是客户端发送的第二个随机数，因为这个随机数是通过CA加密过的，破译难度很大

[这里有一篇阮老师的生动讲解](http://www.ruanyifeng.com/blog/2014/09/illustration-ssl.html)


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