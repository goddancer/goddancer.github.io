---
layout: post
title: localStorage、sessionStorage、sessionCookie
categories: [Javascript]
description: localStorage、sessionStorage、sessionCookie
keywords: localStorage, sessionStorage, sessionCookie
---

## window.localStorage

* 遵循`Document`同源策略
* 可以长期保存

即页面的`document.origin`相同的情况下，才能共享`storage`存储。**那是否可以通过降域的操作，来实现跨子域共享`localStorage`通信呢？**

> 答案是不行的，可以参考另一篇文章，[share data between cross subdomain page safety]()

## session cookie

不设置过期时间的cookie称为session cookie，此类cookie会在浏览器关闭时自动清除。需要注意的是，session可能会引发歧义，并不是在关闭当前tab时，即清除，而是仅当关闭浏览器以后，才会清除。
## window.sessionStorage
### 1、sessionStorage遵循以下规则

1. sessionStorage内容不共享，即使同源，甚至`location.href`一致，仍然不共享，**这点很关键**
2. sessionStorage内容基于页面唯一性，在浏览器打开期间一直保持，重新加载页面(`location.reload`)或关闭当前tab后重新恢复(`shift+cmd+t`)，仍然存在。需要注意：
  * 这并不是sessionStorage内容在关闭以后，即会清除，相反，在浏览器关闭之前，并不会清除
  * 之所以会达到类似清除的效果，是因为在实际生产环境中，很难达到类似`chrome shift+cmd+t`恢复页面的效果，往往是页面关闭+重新打开，此时相当于一个新的页面，之前的session并不会继承
3. 打开多个相同URL的页面，会创建各自的`sessionStorage`
4. 关闭浏览器tab，仅会清除对应的`sessionStorage`

### 2、可以用如下代码进行测试

<iframe name="codemirror" src="{{ site.url }}/public/codemirror/index.html">
const value1 = window.sessionStorage.getItem('key1');
const value2 = window.sessionStorage.getItem('key2');
if (!value1) {
  window.sessionStorage.setItem('key1', 'value1');
}
if (!value2) {
  window.sessionStorage.setItem('key2', 'value2');
}
console.log('value1: ', value1);
console.log('value2: ', value2);
</iframe>

// TODO：存储方案对比图

--

[1] [localstorage的跨域存储方案](https://www.jianshu.com/p/e86d92aeae69)