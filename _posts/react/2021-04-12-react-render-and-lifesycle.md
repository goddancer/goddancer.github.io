---
layout: post
title: React渲染过程和生命周期的调用
categories: [React]
description: React渲染过程和生命周期的调用
keywords: react, getDerivedStateFromProps, render, componentDidMount, lifesycle
---

## React思想

```javascript
UI = fn(state)
```

![same-site]({{site.url}}/assets/images/react/lifesycle/01.png)

其中：
* state 负责计算状态变化 又称为Reconciler(因为会执行一个叫reconcile的diff算法)
* fn 负责将状态变化渲染在试图中 又称为Renderer

当我们调用`this.setState`时，reconciler会进行diff计算出状态变化，然后将变化commit提交给视图渲染：
* 所以负责`state reconciler`的工作阶段又称为**`Render`阶段**；
* 负责将状态变化渲染在视图中的`commit`工作阶段又称为**`Commit`阶段**(提交变化到UI)；
* **在Render阶段和Commit阶段会执行所有的生命周期函数**

## React生命周期函数

![same-site]({{site.url}}/assets/images/react/lifesycle/02.png)

如上图，React生命周期函数主要在两个阶段执行，分别为Render阶段，Commit阶段。

其中，标红的部分在React17中废除了，为什么呢？
* 因为不安全的使用习惯或者错误的理解，这三个方法总是导致问题，所以在React17打上了**UNSAFE_**前缀，并且在React18彻底废弃。
  * [React17**UNSAFE_**原因](https://zh-hans.reactjs.org/docs/react-component.html#legacy-lifecycle-methods)
  * [React18废弃原因](https://zh-hans.reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects)
    * 简单的说就是，因为React18支持了**concurrent**模式，render过程中的fiber任务是可以随时被高优先级的任务打断的，所以这些钩子如果包含副作用的话，就会被执行多次，因为被打断的任务重新执行，就会导致生命周期函数重新被调用；而副作用本身又很难检测到，所以干脆放弃了。

## React渲染过程

React执行渲染工作主要分为两个阶段：**Render阶段**和**Commit阶段**。
其中首次渲染和后续更新除了**调用的生命周期函数会有变化**，以及**需要旧的fiber树进行对比**以外，其他基本相同

### 首次渲染

![same-site]({{site.url}}/assets/images/react/lifesycle/03.png)

我们采用深度优先的先序遍历(根左右)算法，以上图为例：
* APP作为入口，首先我们从APP开始深度遍历，我们先解析APP创建fiber树(VNode)，执行`constructor`,`getDerivedFromProps/componentWillMount`、`render`三个函数
* 然后深度优先继续向下，我们找到子节点P1，然后调用三个函数
* 深度优先继续向下，我们找到P1的子节点C1，调用三个函数
* 接着C1没有子节点，我们找到C1的兄弟节点C2，调用三个函数
* 然后回到P1，找到P1的兄弟及诶单P2，调用三个函数，然后回到APP根节点
* 至此，Render阶段完成

![same-site]({{site.url}}/assets/images/react/lifesycle/04.png)

接下来是Commit阶段，首先我们将整个fiber树渲染到DOM中，我们会按照后序遍历(左右根)的方式执行子节点的生命周期：
* 首先执行C1的`componentDidMount`
* 然后C2，P1，P2，App

### 更新

首先我们需要知道，每次调用`this.setState`都会创建完整的fiber树，只有发生变化的节点，才会调用对应的生命周期函数。

![same-site]({{site.url}}/assets/images/react/lifesycle/05.png)

以上图为例，假设我们更新了C2节点的数据，将C2从蓝色变为绿色
1. 首先我们调用`this.setState`，将C2的state变更为绿色
2. 然后我们进入Render阶段
3. 我们采用深度优先的前序遍历算法，**创建完整的fiber树**
4. 我们使用reconcile(diff)算法，发现C2从蓝色变更为了绿色，我们标记这次变化，同时执行生命周期函数`getDerivedStateFromProps`；继续执行Render阶段，直到回到APP根节点，Render阶段完成
5. 进入Commit阶段
6. 执行步骤4中对应的视图变化，执行C2的生命周期函数`getSnapshotBeforeUpdate`,`componentDidUpdate`
7. 以上步骤完成，新创建的fiber树会替换之前旧的fiber树，等待下次调用`this.setState`再生成一棵新的fiber树

---

[1] [detecting-unexpected-side-effects](https://zh-hans.reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects)

[2] [legacy-lifecycle-methods](https://zh-hans.reactjs.org/docs/react-component.html#legacy-lifecycle-methods)
