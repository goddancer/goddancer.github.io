---
layout: post
title: JS监听Object属性变化
categories: [Javascript]
description: JS监听Object属性变化
keywords: proxy, Object.defineproperty
---

## Proxy

<iframe name="codemirror" font-size="14" src="{{ site.url }}/public/codemirror/index.html">
const obj = {
  name: 'jico',
  words: 'hola',
}
const handler = {
  get(obj, prop) {
    console.log('[get]obj: ', obj);
    console.log('[get]prop: ', prop);
    return obj[prop]
  },
  set(obj, prop, value) {
    console.log('[set]obj: ', obj);
    console.log('[set]prop: ', prop);
    console.log('[set]value: ', value);
    obj[prop] = value
  },
}
const proxy = new Proxy(obj, handler)
console.log('proxy.name: ', proxy.name);
proxy.words = 'hola!'
console.log('proxy.words: ', proxy.words);
</iframe>

## Object.defineProperty

<iframe name="codemirror" font-size="14" src="{{ site.url }}/public/codemirror/index.html">
let value = 'jico'
const obj = Object.defineProperty(Object.create(null), 'name', {
  // this会被传入，不接受参数
  get() {
    console.log('[get]this: ', this);
    return value
  },
  // 接受一个参数
  set(newval) {
    console.log('[set]value: ', newval);
    value = newval
  },
})
console.log('obj.name1: ', obj.name);
obj.name = 'hola jico'
console.log('obj.name2: ', obj.name);
</iframe>

---

[1] [MDN:Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)