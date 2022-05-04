---
layout: post
title: React Q&A
categories: [React]
description: React Q&A
keywords: react, Q&A
---

## React Q&A

### React fiber与堆栈存储

我们知道，JS执行内存分为栈内存Stack和堆内存Heap。其中：
* 栈Stack：存储临时变量与指针，变量用完即回收，相对于Heap来说，读取速度更快
* 堆Heap：一般存储可以反复利用的对象数据，不会随着方法的结束而销毁，因为这个对象可能会被其他变量引用

> **那为什么要使用Fiber架构呢？**
>* JS的执行栈是由引擎管理的，执行栈一旦开始，就会一直执行，直到执行栈清空，无法按需中止。
>* React16之前，React会递归调用所有Component，当页面复杂时，这个调用栈会很深，导致单位PFS时间内不足以清空执行栈，让渡控制权给到浏览器进行绘制渲染，导致UI卡顿。
>* 所以，Raect需要引入一种模式，使得执行模型可控。Fiber就是用JS实现的执行模型，可以理解为React管理的调用栈

> **React Fiber是如何模拟执行栈的呢？**
> * 首先我们需要知道，执行栈主要存储当前执行单元上下文环境，包含：临时变量(局部变量)、函数调用返回指针、当前函数、调用参数等上下文信息
> * Fiber通过链表模拟。每一个链表包含：[React构造函数源码](https://github.com/facebook/react/blob/c1d3f7f1a97adad9441287a92dcd4ac5d2478c38/packages/react-reconciler/src/ReactFiber.js#L251)
    * this.return 返回指针(父组件)
    * this.child 子节点
    * this.sibling 同级节点
> 通过以上三个指针，就能实现complier阶段的深度优先遍历
> * Fiber与普通JS调用栈的区别：普通JS栈帧执行完以后，调用函数指针返回后即销毁；Fiber在渲染结束以后会继续存在，保存组件的实例信息，如State等
> * Fiber是使用JS实现的，意味着Fiber的底层仍然是JS调用栈
  ***这里先做一个猜测，Fiber的每个单元是通过JS栈来调用执行的，但是整个Fiber的完整链表树的数据是存储在Heap中的，也就是说Fiber子单元执行结束以后，会将计算结果和state存储到Heap中，然后抉择让渡控制权，在下一个eventloop中，继续执行Fiber子单元，直至Fiber根左右深度遍历完成返回至ROOT，此时Complier完成，开始执行左右根的Commit阶段***

> **进一步理解链表数据结构**
>
> *Nothing in Fiber uses the normal JS stack. Meaning it does use the stack but it can be compiled into a flat function if needed. Calling other functions is fine - the only limitation is that they can't be recursive.*[原文](https://github.com/facebook/react/issues/7942)
>
> Fiber虽然是用了栈，但并不是传统的栈使用方式，它可以被编译成一个扁平函数，在这个结构里，它不能递归，但是可以调用其他函数。
> **这很符合链表的结构：
1、我们不能递归，但是可以通过next和return双向遍历；
2、我们在execute阶段使用了栈，但是计算结果被存储在value(*this.memoizedState|this.stateNode*)中，并没有消失；**

### 为什么不使用Generator来实现协作调度？

**generator函数也能够主动让出程序控制权(generator函数本质就是协程)，理论上也能实现Concurrent Rendering**，为什么React不使用generator实现Fiber呢？

>主要有两个原因：
>* 每个可暂停的函数需要被包裹在generator函数中，如果React全面使用generator，那么存量的代码有很大的工作量，同时，generator函数对于运行时的是比较大的，存在性能问题
>* **最大的问题是，我们知道React有很多的记忆状态值`memoization`，设想我们需要在多个时间切片内执行如下的方法，在generator函数执行之初，我们传递了依赖的参数`a,b,c`，假如A已经执行完成，我们在下一个时间切片中执行B之前，我们的依赖参数b已经被更新，我们是无法做到既复用上一个依赖函数x的结果，同时又能更新B函数的参数的，因为整个generator函数已经基于初始参数建立**

```js
function* doWork(a, b, c) {
  var x = doExpensiveWorkA(a);
  yield;
  var y = x + doExpensiveWorkB(b);
  yield;
  var z = y + doExpensiveWorkC(c);
  return z;
}
```

> **可能对于问题2会有疑惑，既然React有`memoization`状态值，在调用B之前，我们为什么无法更新B的依赖(设想B的依赖值可以在B函数内部inject)？**
> 这里的问题是React并没有机会在这里注入`memoization`状态值，也无法通过using parent context and keys更新依赖值，唯一可行的方法可能是将这些状态值提升到全局作用域，但是这会有一个问题就是缓存问题，值一直在基于状态的变化而更新，假如函数被暂停，值发生了更新，我们已经失去了之前的状态，没有任何缓存可言，问题被复杂化
> 所以合适的方法依然是，我们通过闭包去将状态值传递保存到fiber中，让fiber自身去存储状态值与上下文依赖

### Fiber为什么使用链表数据结构

在理解上面的几个问题以后，可能这个问题的答案也就呼之欲出：
* **一句话就是：为了可中断、重连的遍历Fiber树。**
* Stack栈的临时内容，在单个Fiber帧中执行完毕以后，即会清空，所以我们不能将全部的内容都依托于栈，这是传统React的解决方式，函数内部的执行过程中，我们正常借助于栈进行计算返回，但是返回值以及关键上下文信息，我们存储到了单个Fiber闭包函数中，每个Fiber包含三个关键的指针`返回值：return；子节点：child；兄弟节点：sibiling`

### React为什么不使用Web Workers多线程而是要使用时间切片模拟并发？

首先，我们知道JS基于DOM Commit确定性的考虑，在Web Workers中是无法访问DOM以及提交DOM的。
除此之外，还有一些其他JS的特性问题导致不适合：
* 首先JS的prototype原型是共享的且可变的，在线程间调用的同一个原型如果发生了变化，可能会导致额外的问题；出于这个原因，需要在模块之前重复加载和初始化模块，这个是浪费性能的
* 同时，线程协同是，垃圾回收必须是线程安全的，这将导致垃圾回收效率降低
* 代码库之间的边界很难控制，会引入不必要的摩擦
* 线程之间可能需要依赖复制，会引入额外的开销和性能降低

### 如何判断当前是否有高优先级任务

可以参考[understanding-react]({% link _posts/react/2021-04-13-understanding-react.md %})并发让渡这一节
* `navigator.scheduling.isInputPending()`facebook提出，浏览器逐渐支持，目前兼容不好
* 除了上面这个方法之外，目前并没有其他的浏览器原生支持的高优先级任务检测API
* 但是我们可以换个思路，我们自己声明高优先级任务
  * `useDefferedValue`
  * `useTransition`
* 同时结合React的`5ms`让渡机制，定时让渡控制权；高优先级任务提前让渡控制权

### 浏览器在一帧内需要做哪些事情 / requestIdleCallback执行时机？

* 处理用户事件输入
* JS执行
* requestAnimation调用
* 布局layout
* 绘制paint

requestIdleCallback会在单个eventloop以内，当以上内容执行完成以后开始执行；若已经没有剩余时间，requestIdleCallback还有第二个参数`timeout`，用于指定最晚执行时间，此时浏览器会打乱执行顺序，强制执行这个回调函数。
[requestIdleCallback兼容性并不好](https://caniuse.com/?search=requestIdleCallback)

### React设定的事件执行优先级

[源码](https://github.com/facebook/react/blob/c1d3f7f1a97adad9441287a92dcd4ac5d2478c38/packages/scheduler/src/Scheduler.js#L194)

时间将要超时也不意味着必须要执行，因为事件会按照对用户侧体验的优先级进行排序：
* `ImmediatePriority = 1`：最高优先级，这个优先级的任务应该立即执行且不应该被中断
* `UserBlockingPriority = 2`：用户交互结果任务，需要即时得到反馈
* `NormalPriority = 3`：不需要用户立刻感受到变化的任务，一般优先级，比如网络请求
* `LowPriority = 4`：低优先级，这个优先级的任务可以被延后，但最终也需要执行
* `IdlePriority = 5`：空闲任务，只有当空闲下来时才去处理的任务，可以被无限期延后执行

### 什么是高阶函数HOC

**High Order Component: 接受一个组件参数，返回一个包装过的组件；HOC一般不具有任何副作用。**

一个最简单的高阶函数demo
```js
function fnA(name) {
  console.log('this is A')
}
function fnB(name) {
  console.log('this is B')
}
function HOCWrap(component) {
  return tempFn = () => {
    const words = sessionStorage.getItem('words')
    return component(words)
  }
}
const wrappedFnA = HOCWrap(fnA)
const wrappedFnB = HOCWrap(fnB)
```

### 高阶组件有哪些类型？怎么写一个高阶组件？

* 普通函数类型
* 装饰器类型
* 多个高阶组件的组合

```tsx
// 装饰器类型
// src/hoc/index.tsx
// decorator HOC
interface Props {
  name: string
}
export const decoratorWithNameHeight = (height?: number) => {
  return (WrapperedComponent: any) => {
    return class extends Component<Props, state> {
      public state = {
        name: 'jico'
      }

      componentWillMount() {
        let userName = localStorage.getItem('userName')
        this.setState({
          name: userName || ''
        })
      }

      render() {
        return (
          <div>
            <WrapperedComponent name={this.state.name} {...this.props} />
            <p>height is: { height || 0 }</p>
          </div>
        )
      }
    }
  }
}

// src/components/index.tsx
interface AppProps {
  name?: string
}
@decoratorWithNameHeight(180)
class App extebds Component<AppProps, any> {
  render() {
    return <div>the name is: { this.props.name }</div>
  }
}
```

```tsx
// 多个装饰器的组合
// hoc decoratorWithWidth
export const decoratorWithWidth = (width?: number) => {
  return (WrapperedComponent: any) => {
    return  class extends Component<any, any> {
      render() {
        return (
          <div>
            <WrapperedComponent {...this.props} />
            <p>the width is: { width || 0 }</p>
          </div>
        )
      }
    }
  }
}

// src/components/index.tsx
interface AppProps {
  name?: string
}
@decoratorWithWidth(200)
@decoratorWithNameHeight(180)
class App extebds Component<AppProps, any> {
  render() {
    return <div>the name is: { this.props.name }</div>
  }
}
```


### 高阶组件在技术层面上能用来做什么？

* 属性代理
  * 操作props
  * 操作组件实例
* 继承/属性劫持

```tsx
// 操作组件实例
export const refHoc = () => {
  return (WrapperedComponent: any) => {
    return calss extends Component<any, any> {
      ref: any = null

      componentDidMount() {
        // 打印组件实例的state属性
        console.log(this.ref.state)
      }

      render() {
        return (
          <div>
            <WrapperedComponent {...this.props} ref={(instance: any) => this.ref = instance} />
          </div>
        )
      }
    }
  }
}
```

```tsx
// 继承/属性劫持HOC
export function ProxyHoc<T extends {new (...args: any[]): any}>(component: T) {
  return class extends component {
    handleClick = () => {
      console.log(this.handleClick)
      super.handleClick()
      console.log('handleClick was proxied')
    }

    render() {
      const parent = super.render()
      return React.cloneElement(parent, {
        onClick: this.handleClick
      })
    }
  }
}

// App
@ProxyHoc()
class App extends Component<any, any> {
  state = {
    num: 1
  }
  handleClick = () =>  {
    this.setState({
      num: this.num + 1
    })
  }

  render() {
    return (
      <div onClick={this.handleClick}>{this.state.num}</div>
    )
  }
}
```

### 什么是React Hooks？有什么优势？

可以在不写class组件的情况下，使用state和其他react特性

*为什么不写class，转而使用hooks写法？*

* class的缺点：
  1. 组件间的状态逻辑很难复用
    * 组件之间如果有state的逻辑是相似的，基本上是通过高阶组件来解决
  2. 复杂业务的有状态组件会越来越复杂
    * 这里和Vue2有点类似，逻辑整理始终都是一个问题，一大堆逻辑都卸载Class或者Vue SFC中，导致上下横跳，很难抽离管理
  3. eventListener监听和定时器的操作，被分散在多个区域
    * 我们一般在Mounted进行addEventListener和setTimeout等操作，同时在对应的unMount进行清理，这就导致关联逻辑分离维护的问题
  4. this指向问题
    * 我们需要在合适的位置进行手动绑定this或者采用箭头函数的写法
    * 如果在子函数上不恰当的函数绑定，会导致子函数无法被缓存，频繁渲染

```tsx
class App extends React.Component<props, state> {
  constructor(props) {
    super(props)
    this.state = {
      num: 1,
      title: 'label',
    }
    this.handleClick2 = this.handleClick1.bind(this)
  }

  handleClick1() {
    this.setState({
      num: this.state.num + 1
    })
  }

  handleClick3 = () => {
    this.setState({
      num: this.state.num + 1
    })
  }

  render() {
    return (
      <div>
        /* bind每次返回一个全新的function，导致子组件会被重复渲染 */
        <ChildCompoent onClick={this.handleClick1.bind(this)} />
        /* this指向正常，因为手动绑定了this */
        <ChildCompoent onClick={this.handleClick2} />
        /* 和调用bind绑定类似，箭头函数每次返回一个全新的函数，导致渲染开销 */
        <ChildCompoent onClick={() => this.handleClick1()} />
        /* 箭头函数的this在声明时即会绑定上下文，所以这里表现正常 */
        <ChildCompoent onClick={this.handleClick3} />
      </div>
    )
  }
}
```

### Hooks的优点

* 利于业务逻辑的封装和拆分，可以非常自由的组合各种自定义hooks
* 可以在无需修改组件结构的情况下，复用状态逻辑(不需要像class组件一样，使用HOC进行复用)
* 定时器、事件监听等都被聚合到一块代码下(比如我们可以在useEffect返回函数中声明解绑或者清除副作用的函数)

### Hooks的使用注意事项

* 只能在函数内部分最外层调用hook，不要在循环、条件判断或者子函数中调用
* 只能在React函数组件中调用Hook，不要在其他的js函数里调用

### 手写实现useState

```tsx
import React from 'react'
import ReactDom from 'react-dom'

function Counter() {
  const [count, setCount] = useState(0)
  const [name, setName]  = useState('jico')

  const handleCount = () => {
    setCount(count + 1)
  }
  const handleName = () => {
    setName(name + '!')
  }
  return (
    <div>
      <div>count: {count}</div>
      <button onClick={handleCount}>countAdd</button>
      <div>name: {name}</div>
      <button onClick={handleName}>nameAdd</button>
    </div>
  )
}
let stateArr: any[] = []
let cursor = 0
function useState<T>(initialState: T): [T, (newState: T) => void] {
  const currentCursor = cursor
  stateArray[currentCursor] = stateArray[currentCursor] || initialState

  function setState(newState: T) {
    stateArray[currentCursor] = newState
    render()
  }
  ++cursor
  return [stateArray[currentCursor], setState]
}

export function render() {
  ReactDom.render(
    <React.StrictMode>
      <Counter />
    </React.StrictMode>,
    document.getElementById('root')
  )
  cursor = 0
}
``` 

### 手写useEffect

```tsx
import React from 'react'
import ReactDom from 'react-dom'

function Counter() {
  // 清除游标
  effectCursor = 0
  const [count, setCount] = useState(0)
  const [name, setName]  = useState('jico')

  const handleCount = () => {
    setCount(count + 1)
  }
  const handleName = () => {
    setName(name + '!')
  }
  useEffect(() => {
    console.log('count changed', count)
  }, [count])
  useEffect(() => {
    console.log('name changed', name)
  }, [name])

  return (
    <div>
      <div>count: {count}</div>
      <button onClick={handleCount}>countAdd</button>
      <div>name: {name}</div>
      <button onClick={handleName}>nameAdd</button>
    </div>
  )
}

// effect的依赖本身是一个数组，所以这里是一个游标索引的二维数组
const allDeps: Array<any[] | undefined> = []
let effectCursor: number = 0
function useEffect(callback: () => void, depArray?: any[]) {
  // 如果没有声明依赖，则每次渲染都执行
  if (!depArray) {
    callback()
    allDeps[effectCursor] = depArray
    effectCursor++
    return
  }
  const deps = allDeps[effectCursor]
  const hasChanged = deps 
    ? depArray.some((el, i) => el !== deps[i]) 
    : true
  if (hasChanged) {
    callback()
    allDeps[effectCursor] = depArray
  }
}

export function render() {
  ReactDom.render(
    <React.StrictMode>
      <Counter />
    </React.StrictMode>,
    document.getElementById('root')
  )
}
```






```js
```

```js
```

---

[1] [Fiber Principles: Contributing To Fiber](https://github.com/facebook/react/issues/7942)
[2] [[译] React 为何要使用链表遍历 Fiber 树](https://github.com/ddzy/react-reading-sources/issues/18)
