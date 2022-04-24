---
layout: post
title: understanding react
categories: [React]
description: 深入理解react
keywords: react
---

`react16`出现的`fiber`架构，在这之前入过`VSDom`太过庞大，`react`就会一直霸占浏览器资源，导致用户触发的事件得不到快速响应，掉帧，表现卡顿。
解决这个问题，期望的方式是将同步更新这个过程拆分为两个独立的部分，或者通过某种方式让整个过程可中断、可恢复
于是有了`fiber`优化架构和`concurrent`并发模式

## `concurrent`并发模式

先不管`fiber`，我们先来看看并发模式怎么实现的

`react`的并发并不是严格意义上的多线程并发，只是一种类似于`eventloop`的单线程时间切片技术，即我们知道在每秒60帧的渲染频率下，浏览器大概16.67ms刷新一次，也就是说，js在单个`eventloop`时间内，最多占用线程16.67ms，否则在这次浏览器刷新周期内就没有时间进行样式布局和样式绘制了

借助`fiber`的精细化数据结构，我们能够将单词`render`任务需要的时间控制下来，那如何让渡控制权给到浏览器呢？
其实很简单，我们回到`eventloop`，任务事件分同步任务、异步任务，异步任务分为微任务和宏任务，其中微任务是在单个`eventloop`的最后进行执行，只有宏任务可以推迟到下一个事件循环，那宏任务有哪些呢？为什么`react`选择`MessageChannel`而不是其他几个呢？
* `setTimeout`
  * 最主要的原因是`setTimeout`的最小延迟是4ms([the interval is forced to be at least four milliseconds](https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers))，这对于单个事件循环只有16.67ms的窗口期来说，延迟是十分严重的
* `requestAimationFrame` 动画钩子，最重要的是，在浏览器下次重绘之前调用
  * 第一次触发`scheduler task`以后，会在重绘之前再次调用，相当于执行了两次
  * 触发频率问题，根据MDN，回调函数的执行次数通常为60次每秒
* `requestIdleCallback` 插入一个函数，这个函数将在浏览器空闲时间调用；如果指定了超时时间`timeout`，则有可能为了执行函数而打乱执行顺序
  * 新出的API，兼容性较差。不过`react`借鉴了`requestIdleCallback`的思想，实现了一个基于`MessageChannel`的`polyfill`
  * 执行行为预期不可控
* `setimmediate` 非标准特性，浏览器兼容性很差，在`Nodejs`兼容良好
* *`MessageChannel`* 允许我们创建一个新的消息通道，并通过它的两个`MessagePort`属性发送数据

### react如何让渡控制权给浏览器

[源码参考](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/scheduler/src/forks/SchedulerHostConfig.default.js#L115-L119)

```javascript
// Scheduler periodically yields in case there is other work on the main
// thread, like user events. By default, it yields multiple times per frame.
// It does not attempt to align with frame boundaries, since most tasks don't
// need to be frame aligned; for those that do, use requestAnimationFrame.
let yieldInterval = 5;
let deadline = 0;

// TODO: Make this configurable
// TODO: Adjust this based on priority?
const maxYieldInterval = 300;
let needsPaint = false;

if (
  enableIsInputPending &&
  navigator !== undefined &&
  navigator.scheduling !== undefined &&
  navigator.scheduling.isInputPending !== undefined
) {
  const scheduling = navigator.scheduling;
  shouldYieldToHost = function() {
    const currentTime = getCurrentTime();
    if (currentTime >= deadline) {
      // There's no time left. We may want to yield control of the main
      // thread, so the browser can perform high priority tasks. The main ones
      // are painting and user input. If there's a pending paint or a pending
      // input, then we should yield. But if there's neither, then we can
      // yield less often while remaining responsive. We'll eventually yield
      // regardless, since there could be a pending paint that wasn't
      // accompanied by a call to `requestPaint`, or other main thread tasks
      // like network events.
      if (needsPaint || scheduling.isInputPending()) {
        // There is either a pending paint or a pending input.
        return true;
      }
      // There's no pending input. Only yield if we've reached the max
      // yield interval.
      return currentTime >= maxYieldInterval;
    } else {
      // There's still time left in the frame.
      return false;
    }
  };

  requestPaint = function() {
    needsPaint = true;
  };
} else {
  // `isInputPending` is not available. Since we have no way of knowing if
  // there's pending input, always yield at the end of the frame.
  shouldYieldToHost = function() {
    return getCurrentTime() >= deadline;
  };

  // Since we yield every frame regardless, `requestPaint` has no effect.
  requestPaint = function() {};
}

forceFrameRate = function(fps) {
  if (fps < 0 || fps > 125) {
    // Using console['error'] to evade Babel and ESLint
    console['error'](
      'forceFrameRate takes a positive int between 0 and 125, ' +
        'forcing frame rates higher than 125 fps is not unsupported',
    );
    return;
  }
  if (fps > 0) {
    yieldInterval = Math.floor(1000 / fps);
  } else {
    // reset the framerate
    yieldInterval = 5;
  }
};
```
* 可以看到，默认的让渡时间为5ms，即`react`执行5ms以后，让渡控制权给浏览器`host`，但是这里还有一个根据刷新比率计算的逻辑，按照fps 60计算，`yieldInterval`为16ms
* 通过`shouldYieldToHost: boolean`，返回布尔值结果，给到`schedule`，如果`true`，则让渡，否则继续执行下一个`filber`任务
* 这里有一个有意思的优化，即如果当前正在输入的话，就让渡控制权给浏览器，体现了高优先级优先响应的逻辑`navigator.scheduling.isInputPending`

### React模拟宏任务

```javascript
let schedulePerformWorkUntilDeadline;
if (typeof localSetImmediate === 'function') {
  // Node.js and old IE.
  // There's a few reasons for why we prefer setImmediate.
  //
  // Unlike MessageChannel, it doesn't prevent a Node.js process from exiting.
  // (Even though this is a DOM fork of the Scheduler, you could get here
  // with a mix of Node.js 15+, which has a MessageChannel, and jsdom.)
  // https://github.com/facebook/react/issues/20756
  //
  // But also, it runs earlier which is the semantic we want.
  // If other browsers ever implement it, it's better to use it.
  // Although both of these would be inferior to native scheduling.
  schedulePerformWorkUntilDeadline = () => {
    localSetImmediate(performWorkUntilDeadline);
  };
} else if (typeof MessageChannel !== 'undefined') {
  // DOM and Worker environments.
  // We prefer MessageChannel because of the 4ms setTimeout clamping.
  const channel = new MessageChannel();
  const port = channel.port2;
  channel.port1.onmessage = performWorkUntilDeadline;
  schedulePerformWorkUntilDeadline = () => {
    port.postMessage(null);
  };
} else {
  // We should only fallback here in non-browser environments.
  schedulePerformWorkUntilDeadline = () => {
    localSetTimeout(performWorkUntilDeadline, 0);
  };
}

function requestHostCallback(callback) {
  scheduledHostCallback = callback;
  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true;
    schedulePerformWorkUntilDeadline();
  }
}
```
* 注册调度函数执行调度任务直到截止时间`schedulePerformWorkUntilDeadline`，函数在标准浏览器环境使用`MessageChannel port1`注册回调函数`performWorkUntilDeadline`
* 通过`requestHostCallback`调度`MessageLoop`队列执行

* 在`react15`及之前，`react`会深度优先(先找到最深，然后同级，然后向上)递归`VSDom`树，找出需要变动的节点，然后同步更新它们。这个过程`react`成为`reconciliation`（协调）
* 在`reconciliation`阶段，`react`会一直占用浏览器资源，导致用户触发的事件得不到响应，而且还会导致掉帧，用户体验卡顿

### 

`useMemo`：缓存计算结果
`useCallback`：缓存函数
函数组件`FC`每次执行都会基于当前声明的变量进行一次重新渲染，即使此时变量是使用`useDeferredValue`进行包裹，也只是基于这个值重新声明了一个`deferValue`而已？

## FC

> 函数组件是没有状态、没有声明周期的组件，`react`未了解决这个问题，引入了`hooks`

我们知道`class`只是一个原型函数的语法糖，`react`在`class`范式中，可以内部持有状态，到函数式组件中就不能持有状态，说不过去啊？？

## 不要在循环、条件或者嵌套函数中调用`hook`

> 应该仅在顶层调用`hooks`。原因是因为`react`通过`hooks`的调用顺序来知道对应关系的，如果每次调用`FC`得到的`hooks`顺序都不一样，会导致混乱。

---

[1] []()
