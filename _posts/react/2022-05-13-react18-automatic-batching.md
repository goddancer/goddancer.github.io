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

## batching core logic

### microtask

[源码](https://github.com/facebook/react/blob/main/packages/react-dom/src/client/ReactDOMHostConfig.js#L392)

```jsx
export const scheduleMicrotask: any =
  typeof queueMicrotask === 'function'
    ? queueMicrotask
    : typeof localPromise !== 'undefined'
    ? callback =>
        localPromise
          .resolve(null)
          .then(callback)
          .catch(handleErrorInNextTick)
    : scheduleTimeout; // TODO: Determine the best fallback here.
```

可以看到：
* React在执行调度队列的同步任务时，也是采用微任务延迟的方案

### schedule queue

```tsx
// Use this function to schedule a task for a root. There's only one task per
// root; if a task was already scheduled, we'll check to make sure the priority
// of the existing task is the same as the priority of the next level that the
// root has work on. This function is called on every update, and right before
// exiting a task.
function ensureRootIsScheduled(root: FiberRoot, currentTime: number) {
  const existingCallbackNode = root.callbackNode;

  // Check if any lanes are being starved by other work. If so, mark them as
  // expired so we know to work on those next.
  markStarvedLanesAsExpired(root, currentTime);

  // Determine the next lanes to work on, and their priority.
  const nextLanes = getNextLanes(
    root,
    root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes,
  );

  if (nextLanes === NoLanes) {
    // Special case: There's nothing to work on.
    if (existingCallbackNode !== null) {
      cancelCallback(existingCallbackNode);
    }
    root.callbackNode = null;
    root.callbackPriority = NoLane;
    return;
  }

  // We use the highest priority lane to represent the priority of the callback.
  const newCallbackPriority = getHighestPriorityLane(nextLanes);

  // Check if there's an existing task. We may be able to reuse it.
  const existingCallbackPriority = root.callbackPriority;
  if (
    existingCallbackPriority === newCallbackPriority &&
    // Special case related to `act`. If the currently scheduled task is a
    // Scheduler task, rather than an `act` task, cancel it and re-scheduled
    // on the `act` queue.
    !(
      __DEV__ &&
      ReactCurrentActQueue.current !== null &&
      existingCallbackNode !== fakeActCallbackNode
    )
  ) {
    if (__DEV__) {
      // If we're going to re-use an existing task, it needs to exist.
      // Assume that discrete update microtasks are non-cancellable and null.
      // TODO: Temporary until we confirm this warning is not fired.
      if (
        existingCallbackNode == null &&
        existingCallbackPriority !== SyncLane
      ) {
        console.error(
          'Expected scheduled callback to exist. This error is likely caused by a bug in React. Please file an issue.',
        );
      }
    }
    // The priority hasn't changed. We can reuse the existing task. Exit.
    return;
  }

  if (existingCallbackNode != null) {
    // Cancel the existing callback. We'll schedule a new one below.
    cancelCallback(existingCallbackNode);
  }

  // Schedule a new callback.
  let newCallbackNode;
  if (newCallbackPriority === SyncLane) {
    // Special case: Sync React callbacks are scheduled on a special
    // internal queue
    if (root.tag === LegacyRoot) {
      if (__DEV__ && ReactCurrentActQueue.isBatchingLegacy !== null) {
        ReactCurrentActQueue.didScheduleLegacyUpdate = true;
      }
      scheduleLegacySyncCallback(performSyncWorkOnRoot.bind(null, root));
    } else {
      scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root));
    }
    if (supportsMicrotasks) {
      // Flush the queue in a microtask.
      if (__DEV__ && ReactCurrentActQueue.current !== null) {
        // Inside `act`, use our internal `act` queue so that these get flushed
        // at the end of the current scope even when using the sync version
        // of `act`.
        ReactCurrentActQueue.current.push(flushSyncCallbacks);
      } else {
        scheduleMicrotask(() => {
          // In Safari, appending an iframe forces microtasks to run.
          // https://github.com/facebook/react/issues/22459
          // We don't support running callbacks in the middle of render
          // or commit so we need to check against that.
          if (
            (executionContext & (RenderContext | CommitContext)) ===
            NoContext
          ) {
            // Note that this would still prematurely flush the callbacks
            // if this happens outside render or commit phase (e.g. in an event).
            flushSyncCallbacks();
          }
        });
      }
    } else {
      // Flush the queue in an Immediate task.
      scheduleCallback(ImmediateSchedulerPriority, flushSyncCallbacks);
    }
    newCallbackNode = null;
  } else {
    let schedulerPriorityLevel;
    switch (lanesToEventPriority(nextLanes)) {
      case DiscreteEventPriority:
        schedulerPriorityLevel = ImmediateSchedulerPriority;
        break;
      case ContinuousEventPriority:
        schedulerPriorityLevel = UserBlockingSchedulerPriority;
        break;
      case DefaultEventPriority:
        schedulerPriorityLevel = NormalSchedulerPriority;
        break;
      case IdleEventPriority:
        schedulerPriorityLevel = IdleSchedulerPriority;
        break;
      default:
        schedulerPriorityLevel = NormalSchedulerPriority;
        break;
    }
    newCallbackNode = scheduleCallback(
      schedulerPriorityLevel,
      performConcurrentWorkOnRoot.bind(null, root),
    );
  }

  root.callbackPriority = newCallbackPriority;
  root.callbackNode = newCallbackNode;
}

export function scheduleSyncCallback(callback: SchedulerCallback) {
  // Push this callback into an internal queue. We'll flush these either in
  // the next tick, or earlier if something calls `flushSyncCallbackQueue`.
  if (syncQueue === null) {
    syncQueue = [callback];
  } else {
    // Push onto existing queue. Don't need to schedule a callback because
    // we already scheduled one when we created the queue.
    syncQueue.push(callback);
  }
}
```

上述代码大致的含义就是：
* **「调度流程」的作用就是：选出这些update中优先级最高的那个，以该优先级进入更新流程。**
* 调度流程大概是：
  1. 获取当前所有update优先级中最高的优先级
  2. 将步骤1的优先级作为本次调度的优先级
  3. 看是否已经存在一个调度queue
  4. 如果已经存在调度，且和当前要调度的优先级一致，则return
  5. 不一致的话就进入调度流程，创建新的调度queue
* **调度的最终目的是在一定时间后执行performConcurrentWorkOnRoot，正式进入更新流程**

### 汇总

首先视图更新可以分两种思路，同步更新和异步更新：
* 同步更新
  * 阻塞任务队列，当应用复杂或者联动层级嵌套过深时，页面响应卡顿、掉帧
* 异步更新
  * 异步则存在竞争态问题，哪次更新先响应到视图，需要想办法界定
  * 中间态问题，因为两次更新是一个单纯的异步操作，所以有可能先完成的更新页面为状态A，另一个更新为状态B。理想状态下，我们只希望一次更新达到预期，不存在中间态

React处理思路：
* 每个fiber节点发生setState状态变化，产生一个update事件

> 回到最初的问题
* 旧版本React在react事件中表现为异步更新，是因为做了基于作用域提升的上下文存储，合并了不必要的重复更新
* 但是因为浏览器事件等宏任务事件、promise微任务事件执行延迟，顶层提升的上下文已经失去执行栈状态，所以没办法合并<b style="color: red;">TODO: confirm</b>

## 对比Vue

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

### vue3更新调度实现

[源码](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/scheduler.ts#L84)

```tsx
export function queueJob(job: SchedulerJob) {
  // the dedupe search uses the startIndex argument of Array.includes()
  // by default the search index includes the current job that is being run
  // so it cannot recursively trigger itself again.
  // if the job is a watch() callback, the search will start with a +1 index to
  // allow it recursively trigger itself - it is the user's responsibility to
  // ensure it doesn't end up in an infinite loop.
  if (
    (!queue.length ||
      !queue.includes(
        job,
        isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex
      )) &&
    job !== currentPreFlushParentJob
  ) {
    if (job.id == null) {
      queue.push(job)
    } else {
      queue.splice(findInsertionIndex(job.id), 0, job)
    }
    queueFlush()
  }
}

const resolvedPromise = /*#__PURE__*/ Promise.resolve() as Promise<any>
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true
    currentFlushPromise = resolvedPromise.then(flushJobs)
  }
}
```

可以看到Vue更新和React思想类似，**都是尽量复用当前调度queue，做批量更新**，不同点是：
* React使用优先级调度queue，根据优先级决定调度顺序
* Vue则是判断当前任务id是否已存在于调度queue，没有的话直接推入；存在的话，进行插入更新
* 同时，**两者都是通过微任务实现批处理**

这里有一点有意思的是：
* Vue直接通过`resolvedPromise.then(flushJobs)`进行的微任务处理，所以如果直接在源码中搜索`nextTick`是检索不到这块逻辑的
* 根本原因是因为需要使得`nextTick`响应发生在`flushJobs`之后，也就是调度先刷新，可能是基于实际生产场景中的使用考虑，因为用户一般会在`nextTick`获取已经更新的最新DOM实例
* 可以看如下源码，`nextTick`在存在`currentFlushPromise`时，会直接`then`复用

```tsx
export function nextTick<T = void>(
  this: T,
  fn?: (this: T) => void
): Promise<void> {
  const p = currentFlushPromise || resolvedPromise
  return fn ? p.then(this ? fn.bind(this) : fn) : p
}
```

---

[1] [Automatic batching for fewer renders in React 18 #21](https://github.com/reactwg/react-18/discussions/21#)

[2] [Automatic batching](https://zhuanlan.zhihu.com/p/382216973)
