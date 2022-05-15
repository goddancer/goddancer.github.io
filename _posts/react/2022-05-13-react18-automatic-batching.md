---
layout: post
title: react18 automatic batching
categories: [React]
description: react18 automatic batching
keywords: automatic batching, flushSync, batching
--- 

## 从一个问题引入

> setState是同步的还是异步的?

在一般场景下：
* 在React的生命周期、合成事件中它是异步的；
* 在异步事件(promise、setTimeout)、原生事件中，是同步的
  * > Until React 18, we only batched updates during the React event handlers. Updates inside of promises, setTimeout, native event handlers, or any other event were not batched in React by default.

这个问题的根源是React或者Vue这种，由数据驱动视图的框架必须回答的一道命题--当数据改变时，如何减少渲染次数？
* Vue选择了异步更新，React则是同步更新，合并state
  * setState会触发生命周期(effect等)的流转，但直到调用render前，才对state进行合并，从而表现出“异步”的效果

### 对比Vue

* **当响应式对象变化时，会通知到render function进行rerender，此时会产出新的vDom，Vue会将新旧两份VDom进行对比，然后高效更新到真实DOM**
* 我们知道，得益于vue的静态模版分析，一般场景下，在client运行时我们已经得到了对应SFC的render function，此时当reactive obj发生变化时，我们只需要重新调用render function产出新的VDom，然后进行对比更新即可

### 思考如下代码

```vue
<template>
  <div>
    <div ref="a">{{ a }}</div>
    <button @click="click">按钮</button>
  </div>
</template>
<script>
import { nextTick } from 'vue'
export default {
  data() {
    return {
      a: 1
    }
  },
  methods: {
    click() {
      nextTick(() => {
        // 因为该微任务声明在reactivity change微任务之前
        console.log('[nextTick]it should be 1:', this.$refs.a.innerHTML);
      })
      // reactivity change微任务
      this.a = 2;
      // DOM取值同步任务
      console.log('it should be 1:', this.$refs.a.innerHTML); // 预期输出1
      nextTick(() => {
        // 该微任务在reactivity change微任务之后
        console.log('it should be 2:', this.$refs.a.innerHTML);
      })
      // ! 需要注意nextTick本身就是一个微任务
      nextTick(() => {
        // reactivity change微任务
        // 此时相当于.then.then
        this.a = 3
        console.log('it should be 2:', this.$refs.a.innerHTML)
        Promise.resolve().then(() => {
          console.log('it should be 3:', this.$refs.a.innerHTML);
        })
      })
      Promise.resolve().then(() => {
        // 该微任务在reactivity change微任务之后；在this.a=3微任务之前
        console.log('it should be 2:', this.$refs.a.innerHTML);
      })
    }
  }
}
</script>
```
以上代码的输出顺序为：
* 可以将reactivity变化触发的DOM更新理解为一个promise微任务
* 过程为：reactivity obj change -> promise 【triggers】 execute -> render fn reRender -> A+B vNode diff -> patch to DOM
  * <i style="color: red;">TODO：confirm</i>

---

[1] [Automatic batching for fewer renders in React 18 #21](https://github.com/reactwg/react-18/discussions/21#)

[2] [Automatic batching](https://zhuanlan.zhihu.com/p/382216973)
