---
layout: post
title: jekyll usecage demo
categories: [Jekyll]
description: jekyll usecage demo
keywords: jekyll
---

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

```javascript
async function async1() {
  console.log('async1 start') // 2
  Promise.resolve(async2()).then(() => {
    console.log('async1 end') // 6
  })
}
async function async2() {
  console.log('async2') // 3
}
console.log('script start') // 1
setTimeout(function () {
  console.log('settimeout') // 8
})
async1()
new Promise(function (resolve) {
  console.log('promise1') // 4
  resolve()
}).then(function () {
  console.log('promise2') // 7
})
console.log('script end') // 5
```
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

const p = Promise.resolve();
(async () => {
    Promise.resolve(Promise.resolve()).then(() => {
      console.log('await end');
    });
})();
p.then(() => {
    console.log('then 1');
}).then(() => {
    console.log('then 2');
});

Promise.resolve(Promise.resolve()).then(() => {
  console.log('await end');
});
Promise.resolve(1).then(() => {
  console.log('await1 end');
});
```

```markdown
{% highlight javascript %}
function hello() {
  console.log('hello world')
}
{% endhighlight %}
```

{% highlight javascript %}
function hello() {
  console.log('hello world')
}
{% endhighlight %}

<iframe name="codemirror" font-size="14" src="{{ site.url }}/packages/apps/codemirror/lib/index.html">
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
</iframe>

---

[1] [Nodejs打包构建时长优化](https://www.cnblogs.com/Dev0ps/p/15509671.html)