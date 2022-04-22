---
layout: post
title: freeze-scroll
categories: [Javascript]
description: freeze scroll with passive or position fixed
keywords: freeze scroll, passive, fixed
---

## 冻结滚动

> 某些场景下，我们需要冻结页面滚动，比如弹窗展示时

### 方案汇总

冻结滚动一般有两种方案：

1. 通过`preventDefault`阻止默认事件，使滚动手势无效
2. 通`fixed`过定位，使页面固定在某一屏的位置，这里需要结合页面的scrollTop值，将固定定位的top值设置一下

## `preventDefault`

思路：**通过监听`touchmove`事件，在手势滑动的时候，通过`ev.preventDefault`阻止默认事件，使滚动行为无效**

* 检查passive是否支持：[passive support check]({% link _posts/javascript/2020-02-19-passive-support-check.md %})

### 原理

**当`passive`设置为`true`时，`listener`将永远不会调用`preventDefault()`，即使代码中显式声明了语句，也不会调用。**
所以需要手动设置`passive`为`false`

### core code

```javascript
document.body.addEventListener('touchmove', function(ev) {
  ev.preventDefault()
}, {
  passive: false,
  once: true,
})
```

### 注意事项

1. `el.addEventListener.option`的默认值为`false`，但是由于主流浏览器的[滚动优化策略](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener#%E4%BD%BF%E7%94%A8_passive_%E6%94%B9%E5%96%84%E7%9A%84%E6%BB%9A%E5%B1%8F%E6%80%A7%E8%83%BD)，以下三个节点的`touchstart`、`touchmove`事件的`passive`默认值为`true`

* `window`
* `document`
* `document.body`

## `fixed & overflow`

### 思路

**通过`fixed`定位以及`overflow: hidden`动态切换，使可滚动区域固定**

### 注意

**部分场景可能需要结合`scrollTop`使用，防止视图位置**
## demo

在chrome浏览器中，切换到手机模式，执行这段代码并尝试手势滑动页面

<iframe name="codemirror" font-size="14" src="{{ site.url }}/public/vue3-case/index.html#/freeze-scroll">
</iframe>

--

[1] [EventTarget.addEventListener()](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener)