---
layout: post
title: 动态执行代码的几种方式
categories: [javascript]
description: 动态执行代码的几种方式
keywords: createElement, new Function, eval
---

动态执行代码大概有几种方式：

1、动态创建script 标签

```javascript
const script = document.createElement('script');
script.innerText = `console.log('hola')`;
document.body.append(script);
```
2、通过`new Function`语法。[详细说明](https://zh.javascript.info/new-function)

> 需要注意`new Function`的形式执行代码时的作用域为**全局作用域**，无论在什么地方调用执行，都一样。

```javascript
try {
  // 可以直接传入函数体调用执行
  new Function(`console.log('hola')`)();
  // 可以传递多个参数
  new Function('arg1', 'arg2', `console.log(Array.prototype.join.apply(arguments))`)('hola', 'jico');
  // 可以使用剩余参数运算符
  new Function('...arg', `console.log(arg.join(', '))`)('hola', 'jico');
} catch(e) {
  throw new Error(e)
}
```
3、eval

> 需要注意eval代码执行时的作用域为**当前作用域**，可以访问到执行时所在函数中的局部变量。

```javascript
const name = 'jico';
const strFn = `console.log(name)`;
eval(strFn);
```