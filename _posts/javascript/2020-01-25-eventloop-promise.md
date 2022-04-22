---
layout: post
title: promise
categories: [Javascript]
description: promise
keywords: promise, microtask, eventloop
---

## 基础

### promise result一旦settled，不会变更

<iframe name="codemirror" font-size="14" src="{{ site.url }}/public/codemirror/index.html">
const p1 = new Promise((resolve, reject) => {
  // executor
  // 会将 reactions_or_result 设置为 1
  // 会调用 SetHasHandler
  resolve(1)
  // 以下更改不会生效
  reject(2)
  resolve(3)
})
p1.then(res => {
  console.log(res)
})
</iframe>

### then会返回一个新创建的promise

<iframe name="codemirror" src="{{ site.url }}/public/codemirror/index.html">
const p1 = new Promise((resolve) => {
  resolve(1)
})
const p2 = p1
const p3 = p1.then(console.log)
console.log(p1 === p2)
console.log(p1 === p3)
</iframe>

### microtask队列等待执行

<iframe name="codemirror" src="{{ site.url }}/public/codemirror/index.html">
const p1 = new Promise((resolve) => {
  resolve('同步执行开始')
}).then(res => {
  console.log('进入microtask队列后执行')
})
console.log('同步执行结束')
</iframe>

### 当返回一个promise时

```javascript
Promise.resolve().then(() => {
  console.log(0);
  return Promise.resolve(4);
}).then((res) => {
  console.log(res)
})

// 等价于

const p1 = Promise.resolve()
const p2 = p1.then(() => {
  console.log(0);
  const p3 = Promise.resolve(4)
  return p3;
})
const p4 = .then((res) => {
  console.log(res)
})
```

其中，因为p3返回的是一个promise，会转化为一个特殊的微任务`promiseResolveThenableJobTask`

```javascript
let promiseResolveThenableJobTask = microtask(() => {
  p3.then((value) => { 
    ReslovePromise(p2, value) 
  })
})
```

所以代码在这里，首先执行这个微任务`promiseResolveThenableJobTask`，接着将`p3.then`这个微任务放入微任务队列，等待执行；

然后在执行`p3.then`这个微任务;

**当返回一个promise时，这里相当于至少两次微任务循环**

## 题目

### 一般考查

> 3 7 4 1 2 5

```javascript
const first = () => (new Promise((resolve, reject) => {
  console.log(3);
  let p = new Promise((resolve, reject) => {
    console.log(7);
    setTimeout(() => {
      console.log(5);
      resolve(6);
    }, 0)
    resolve(1);
  });
  resolve(2);
  p.then((arg) => {
    console.log(arg);
  });
}));

first().then((arg) => {
  console.log(arg);
});
console.log(4);
```

### 终极难点

当了解上面返回promise微任务的场景处理以后，下面的题目就有了做对的可能

```javascript
// 0 1 2 3 4 5 6
// 需要注意返回promise这里存在一次创建promiseResolveThenableJobTask微任务放入队列等待执行；
// 还有一次then这个微任务放入队列等待执行的过程
Promise.resolve().then(() => {
  console.log(0);
  return Promise.resolve(4);
}).then((res) => {
  console.log(res)
})

Promise.resolve().then(() => {
  console.log(1);
}).then(() => {
  console.log(2);
}).then(() => {
  console.log(3);
}).then(() => {
  console.log(5);
}).then(() => {
  console.log(6);
})
```

---

[1] [V8 Promise源码全面解读，其实你对Promise一无所知](https://juejin.cn/post/7055202073511460895#heading-34)