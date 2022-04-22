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

* 首先查询浏览器DNS缓存，如果有直接返回(要查看chrome中的缓存，打开[chrome://net-internals/#dns](chrome://net-internals/#dns))
* 如果没有缓存，继续检查操作系统hosts缓存，不同系统可能存储位置不一样，unix和类unix系统一般存储在`/etc/hosts`，[详细参考](https://en.wikipedia.org/wiki/Hosts_%28file%29#Location_in_the_file_system)
* 如果依旧没有缓存，则会向本地网络提供商(如移动、联通、局域网等网络提供商)设置的DNS服务器发送一条DNS查询请求进行查询，也可以通过系统网络配置，指定信任的DNS服务器地址(如114等)
* 如果本地DNS服务器存在DNS缓存，则会直接返回
* 假如所有DNS服务器都没有DNS缓存，以`a.example.com`为例，我们的查询方式为：
  * 我们向根服务器/查询`a.example.com`的DNS记录，根服务器没有具体记录，返回eTLD com的DNS服务器地址
    * 需要注意，中国互联网发展较晚，根服务器的源服务器都在国外，国内的根服务器是一个备份服务器
  * 继续向eTLD DNS服务器查询，若没有具体记录，返回eTLD + 1的DNS服务器地址
  * 继续向eTLD + 1 DNS服务器查询，此时查询到eTLD+ 2 `a.example.com`地址

## CDN

**要查询DNS域名应答记录，可以借助`dig`命令**

```text
; <<>> DiG 9.10.6 <<>> cntv.cn
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 14998
;; flags: qr rd ra; QUERY: 1, ANSWER: 3, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4000
;; QUESTION SECTION:
;cntv.cn.			IN	A

;; ANSWER SECTION:
cntv.cn.		1	IN	CNAME	cntv.cn.wsglb0.com.
cntv.cn.wsglb0.com.	1	IN	A	111.206.105.194
cntv.cn.wsglb0.com.	1	IN	A	111.206.176.78

;; Query time: 16 msec
;; SERVER: 10.8.69.12#53(10.8.69.12)
;; WHEN: Thu Apr 21 14:53:52 CST 2022
;; MSG SIZE  rcvd: 100
```

以cntv.cn为例，应答部分记录：
* 第一条记录，cntv.cn做了CNAME解析到CDN域名cntv.cn.wsglb0.com；
* 继续解析DNS，有两条记录

## 浏览器缓存

* 强缓存命中，状态码为200 from cache
* 协商缓存命中，状态为304 not modified

### 强缓存

如果该域名下的静态资源存在缓存，且缓存策略为强缓存，如果缓存命中，则不需要给服务器发送请求。此时不需要走TCP、SSL等步骤，直接使用缓存进行页面渲染即可。
强缓存字段：
* Expires: Thu, 21 Apr 2022 07:56:35 GMT
* Cache-Control: max-age=300 优先级高于Expires

### 协商缓存

* Cache-Control: must-revalidate 强缓存过期以后，在缓存重用之前必须和服务器进行验证
  * 通常结合使用`Cache-Control: max-age=604800, must-revalidate`
* Response Headers
  * `ETag: "622f1b4e-999"`
  * `Last-Modified: Mon, 14 Mar 2022 10:39:10 GMT`
* Request Headers
  * `If-Modified-Since: Mon, 14 Mar 2022 10:39:10 GMT`
  * `If-None-Match: W/"622f1b4e-999"`

## TCP

TCP即传输控制协议(Transmission Control Protocol)。整个过程可以简单的理解为三次握手和四次挥手。

* SYN：连接请求/连接接收 报文
* ACK：确认报文

其中三次握手用来建立TCP连接（为什么？）：
* 第一次握手，客户端发送SYN报文给服务器。**客户端发送，服务器接收**
  * 服务器：确认客户端发送正常，自己接收正常
  * 客户端：无可确认信息
* 第二次握手，服务器发送SYN报文给客户端。**服务器发送，客户端接收**
  * 客户端：确认自己发送正常，接收正常；确认服务器接收正常，发送正常
  * 服务器：无可确认信息
* 第三次握手，客户端发送ACK报文给服务器
  * 服务器：确认自己发送正常，接收正常；确认客户端发送正常，接收正常

* FIN：连接终止报文
* ACK：确认报文

需要四次挥手断开TCP连接（为什么？）：
* 服务端不能直接关闭TCP连接，因为在关闭之前需要接收到ACK确认报文，才能确认可进行操作，所以需要存在一个中间状态，成为**半关闭(half-close)**
* 客户端计划断开TCP连接：
  * 客户端发送FIN报文给服务器，请求断开TCP，发送完毕，客户端TCP半关闭，等待服务器确认
  * 服务器收到FIN，发送ACK给到客户端，客户端确认关闭，TCP连接释放
* 服务端计算断开TCP连接：
  * 同上

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

## 首次渲染

解析HTML页面，按照上述步骤取得css、js、images等资源，需要注意在不同浏览器会有资源加载优化策略，在chrome中加载js资源时，如果遇到后方存在css资源，会优先查看后续是否还有css资源，如果有，优先加载。
加载完成以后：
* 解析资源
* 计算样式/图层布局
* 整合涂层、渲染

## 后续渲染

需要注意重绘repaint和重排reflow的关系：
* 页面元素发生样式或者位置的改变，即会引起重绘；重绘即重新绘制页面
  * 修改DOM
  * 修改样式
  * 用户事件引起的元素变化，滚动页面，显示隐藏(display)等等
* 重排即重新生成布局
  * visibility变化
  * 颜色改变
  * 几何变化，如位置移动等
需要注意：
* 重绘必然发生重排；但重排不一定伴随重绘

---

[1] [HSTS](https://segmentfault.com/a/1190000022316260)

[2] [what-happens-when](https://github.com/skyline75489/what-happens-when-zh_CN)

[3] [TCP](https://segmentfault.com/a/1190000039165592)