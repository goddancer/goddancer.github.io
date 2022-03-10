---
layout: post
title: 微任务之async和await
categories: [Javascript]
description: 微任务之async和await
keywords: microtask, async, asait, promise, macrotask
---

> 在ES7 async和await之前，宏任务和微任务的理解相对简单，这里主要讲一下引入了async和await以后的eventloop原理

**关于Promise返回Promise的高级用法解答，可以参考[eventloop-promise.md]({% link _posts/javascript/2022-01-25-eventloop-promise.md %})**

## 通过题目引入

**如果可以正确做对以下两个题目，则没有继续看下去的必要**

### 高级考察1

```javascript
async function async1() {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}
async function async2() {
  console.log('async2')
}
console.log('script start')
setTimeout(function () {
  console.log('settimeout')
})
async1()
new Promise(function (resolve) {
  console.log('promise1')
  resolve()
}).then(function () {
  console.log('promise2')
})
console.log('script end')
```

### 高级考察1等价写法

<iframe name="codemirror" font-size="14" src="{{ site.url }}/public/codemirror/index.html">
async function async1() {
  console.log('2:async1 start') // 2
  Promise.resolve(async2()).then(() => {
    console.log('6:async1 end') // 6
  })
}
async function async2() {
  console.log('3:async2') // 3
}
console.log('1:script start') // 1
setTimeout(function () {
  console.log('8:settimeout') // 8
})
async1()
new Promise(function (resolve) {
  console.log('4:promise1') // 4
  resolve()
}).then(function () {
  console.log('7:promise2') // 7
})
console.log('5:script end') // 5
</iframe>

### 高级考察2

```javascript
const p = Promise.resolve();
(async () => {
  await p;
  console.log('await end');
})();
p.then(() => {
  console.log('then 1');
}).then(() => {
  console.log('then 2');
});
```

### 高级考察2等价写法

<iframe name="codemirror" font-size="14" src="{{ site.url }}/public/codemirror/index.html">
const p = Promise.resolve();
(async () => {
  Promise.resolve(p).then(() => {
    console.log('await end'); // 1
  })
})();
p.then(() => {
  console.log('then 1'); // 2
}).then(() => {
  console.log('then 2'); // 3
});
</iframe>

## 深入理解

正确解答上述问题的前提是可以正确对原题进行**等价变式**

### eventloop微任务和宏任务

> 每次宏任务执行以后都会清空微任务队列

![每次宏任务执行以后都会清空微任务队列]({{site.url}}/assets/images/blog/event-loop.svg)

### await做了什么

> 字面量的意思`await`是等待，但是并不能理解为等待`await`后面的表达式执行完毕以后，才继续执行后面的代码

> `await`的本质是让出线程。**`await`后面的表达式会先执行一遍，然后将表达式下方需要执行的语句放入`microtask`中，然后就会跳出`async`函数来执行后面的代码**

> **`new Promise`声明和`Promise.resolve`都是同步代码，只有`then`才是微任务**

> **`Promise.resolve()`和`Promise.resolve(Promise.resolve())`在执行优先级上等价**

理解了上述两点重要前提以后，我们就知道下面代码的**等价写法**

```javascript
async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}
// 等价于
async function async1() {
  console.log('async1 start');
  Promise.resolve(async2()).then(() => {
    console.log('async1 end');
  })
}
```

## 最后通过一道变式检验理解

### 原题

```javascript
async function a1 () {
  console.log('a1 start')
  await a2()
  console.log('a1 end')
}
async function a2 () {
  console.log('a2')
}
console.log('script start')
setTimeout(() => {
  console.log('setTimeout')
}, 0)
Promise.resolve().then(() => {
  console.log('promise1')
})
a1()
let promise2 = new Promise((resolve) => {
  resolve('promise2.then')
  console.log('promise2')
})
promise2.then((res) => {
  console.log(res)
  Promise.resolve().then(() => {
    console.log('promise3')
  })
})
console.log('script end')
```

### 等价写法

<iframe name="codemirror" font-size="14" src="{{ site.url }}/public/codemirror/index.html">
async function a1 () {
  console.log('2:a1 start') // 2
  Promise.resolve(a2()).then(() => {
    console.log('7:a1 end') // 7
  })
}
async function a2 () {
  console.log('3:a2') // 3
}
console.log('1:script start') // 1
setTimeout(() => {
  console.log('10:setTimeout') // 10
}, 0)
Promise.resolve().then(() => {
  console.log('6:promise1') // 6
})
a1()
let promise2 = new Promise((resolve) => {
  resolve('8:promise2.then') // 8
  console.log('4:promise2') // 4
})
promise2.then((res) => {
  console.log(res)
  Promise.resolve().then(() => {
    console.log('9:promise3') // 9
  })
})
console.log('5:script end') // 5
</iframe>

---

[1] [一道题理解setTimeout,Promise,async/await以及宏任务与微任务](https://www.cnblogs.com/wangxi01/p/11190608.html)

TODO: Vue2和Vue3中NextTick实现