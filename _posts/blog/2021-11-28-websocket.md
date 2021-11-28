---
layout: post
title: websocket
categories: [websocket, javascript]
description: some word here
keywords: websocket
---

## Websockets

### 特点

* <strong style="color: red;">同源策略对WebSockets不适用</strong>，可以通过该协议打开任意站点的连接。是否进行通信完全取决于服务器对请求方的控制。
* <strong style="color: red;">WebSockets只能通过连接发送纯文本数据</strong>，所以对于复杂的数据结构，必须进行序列化再发送。
* <strong style="color: red;">全双工通信</strong>，即可以双向通信。
* 协议标志符是 `ws`\|`wss`

### 优点

* 建立在TCP协议之上,服务器实现比较容易
* 与HTTP协议有着良好的兼容性,默认端口也是80和443,并且握手阶段采用HTTP协议,因此握手不容易被屏蔽,能通过各种HTTP代理服务器
* 数据格式比较轻量,性能开销小,通信高效
* 可以发送文本,也能发送二进制数据(`blob`对象或`ArrayBuffer`对象)
* 没有同源策略限制,客户端可以与任意服务器通信

### 使用

#### 1、基本使用

```javascript
const ws = new WebSocket(url)

ws.onopen = function(e) {
  ws.send('hola ws')
}
ws.onmessage = function(e) {
  const data = e.data
  console.log('data: ', data)
  ws.close()
}
ws.onclose = function(e) {}
ws.onerror = function(e) {}

// 可以使用ws.addEventListener的方式
```

#### 2、发送blob对象数据

```javascript
const file = document.querySelector('input[type=file]').files[0]
ws.send(file)
```

#### 3、发送ArrayBuffer对象数据

```javascript
const img = canvas_context.getImageData(0, 0, 400, 320)
const binary = img.data.reduce((a, c, i) => {
  a[i] = c
  return a
}, new Unit8Array(img.data.length))
ws.send(binary.buffer)
```

#### 4、判断服务器返回的数据类型

```javascript
ws.addEventListener('message', function(e) {
  const data = e.data
  if (typeof data === 'string') {
    // handle with text data string
  }
  if (data instanceof ArrayBuffer) {
    // handle with binary data
  }
}, false)
```

#### 5、判断二进制数据是否发送完成

```javascript
const data = new ArrayBuffer(1000000)
ws.send(data)

if (ws.bufferedAmount === 0) {
  // data is send done
} else {
  // binary data is sending
}
```
### WebSocket in linux

1、counter.sh

```shell
#!/bin/bash

echo 1
sleep 1
echo 2
sleep 2
echo 3
```
`bash ./counter.sh` will output `1 2 3`

2、[install websocketd](https://formulae.brew.sh/formula/websocketd#default)

```shell
# execute shell server-side
websocketd --port=8080 bash ./counter.sh
```

```javascript
// accept data client-side
const ws = new WebSocket('ws://<serverIp>:8080/')
ws.onmessage = function(ev) {
  const data = ev.data
  // will output 1 2 3
  console.log('data: ', data);
}
```

3、监听服务器文件变动

```shell
# execute shell server-side
websocketd --port=8080 ls
```

## SSE(Server-Send-Events)

### SSE本质

> 严格的说，HTTP协议无法做到服务器主动推送信息。但是，有一种变通方法，就是服务器向客户端声明，接下来要发送的是流信息(steaming)。

> 也就是说，发送的不适一次性的数据包，而是一个数据流，会连续不断地发送过来。这时，客户端不会关闭连接，会一直等着服务器发送来的新的数据流，视频播放就是这样的例子。

> 本质上，这种通信就是以流信息的方式，完成一次用时很长的下载。

> SSE就是利用这种机制，使用流信息向浏览器推送信息。它基于HTTP协议,支持广泛。


### 特点

* <strong style="color: red;">单向通信</strong>，只能服务器向客户端推送事件，`Content-Type: text/event-stream`。
* <strong style="color: red;">本质是一种流信息</strong>，流信息，即下载，如果浏览器向服务器发送数据，就变成了另一次HTTP请求。
* <strong style="color: red;">遵循同源策略</strong>.

### 优点

* SSE使用<strong style="color: red;">HTTP协议</strong>，现有的服务器软件都支持，不需要额外改造。不同于WebSockets的是，<strong style="color: red;">WebSockets是一个独立协议</strong>，需要服务器单独支持。
* <strong style="color: red;">轻量级，使用简单</strong>；WebSockets协议相对复杂。
* <strong style="color: red;">默认支持断线重连</strong>；WebSockets需要自己实现。
* SSE一般只用来传送文本,二进制数据需要编码后传送;WebSockets 默认支持传送二进制数据.
* SSE支持自定义发送的消息类型.

### 断线重连

服务器向浏览器发送的SSE数据,必须是utf-8编码的文本,并且具有以下HTTP头信息.

```xml
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

每一次发送的信息,由若干个message组成.
数据标识符用`id`字段表示,相当于每一条数据的编号.

```xml
id: msg1\n
data: message\n\n
```

一旦连接断线,浏览器就会发送一个HTTP头,里面包含一个特殊的头部字段`Last-Event-Id`,用来帮助服务器重建连接.

### 使用

#### 1、判断是否支持SSE

```javascript
if ('EventSource' in window) {}
```

#### 2、跨域访问

跨域时需要在服务器端做跨域头配置;跨域时,可以选择是否同步发送cookie.

```javascript
const eventSource = new EventSource(url, {
  withCredentials: true,
})
```

#### 3、基本使用

```javascript
const eventSource = new EventSource(url)

eventSource.onopen = function(event) {}
eventSource.onmessage = function(event) {
  const data = event.data
  // handle with data
}
eventSource.onerror = function(event) {}
evnetSource.close()

// or
eventSource.addEventListener('open', function(event) {}, false)
eventSource.addEventListener('message', function(event) {
  const data = event.data
  // handle with data
}, false)
eventSource.addEventListenter('error', function(event) {}, false)
```

#### 4、自定义事件

自定义事件以后,服务器发送来的数据,就不再会触发`message`事件

```javascript
eventSource.addEventListener('eventName', function(event) {}, false)
```