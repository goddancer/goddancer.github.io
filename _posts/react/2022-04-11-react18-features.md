---
layout: post
title: react18 new features
categories: [React]
description: react18 new features
keywords: createRoot, automatic batching, concurrent, useTransition, suspense
--- 

## 简介

> react18现有的所有新特性和未来可能的许多变化，都离不开concurrent并发渲染模式

> react的并发渲染并不是真正的多线程并发模式，而是使用类似于eventloop的时间切片模式，每个task都可以在运行和暂停两个状态之间切换

![same-site]({{site.url}}/assets/images/blog/react-concurrent.png)

### 汇总

1. Concurrent Mode：渲染模型的变化
2. Automatic Batching：自动批量更新state变化，减少渲染次数
3. Transition：指定渲染优先级
  * `const [isPending, startTransition] = useTransition()`[code sandbox](https://codesandbox.io/s/react18-usetransition-e70vf5)
  * `const deferredValue = useDeferredValue(value)`[code sandbox](https://codesandbox.io/s/usedeferredvalue-0v5u0h)
4. Suspense：更方便的组织并行请求和loading状态的代码


## 如何升级

```jsx
const container = document.getElementById('app')

// react17 and b4
import { render } from 'react-dom'

render(<App />, container)

// react18
import { createRoot } from 'react-dom/client'

const root = createRoot(container)
root.render(<App />)
```

## 重要特性

### 1.Automatic Batching

> 自动批量更新state，减少渲染次数；在之前的版本中，react只能处理在react event handler中的state batching，在浏览器事件如`Promise`、`setTimeout`、`native event handlers`等事件中，均无法batching，每一次状态变更，必然触发一次render。

```jsx
// b4
setTimeout(() => {
  setCount(c => c + 1)
  setFlag(f => !f)
  // react will render twice, once for each state update(no batching)
})

// after：updates inside of timeouts, promises, native event handlers
// or other event are batched
setTimeout(()  => {
  setCount(c => c + 1)
  setFlag(f => !f)
  // react will only re-render once at the end(that's batching)
}, 0)
```

#### disable Automatic Batching(Not recommended)

```jsx
import { flushSync } from 'react-dom'

function handlerClick() {
  flushSync(() => {
    setCount(c => c + 1)
  })
  // react has updated the DON by now
  flushSync(() => {
    setFlag(f => !f)
  })
  // react has updated the DON by now
}
```

### 2.[Transitions](https://zh-hans.reactjs.org/docs/hooks-reference.html#usetransition)

* hooks：`useTransition`
* class：`startTransition`

#### 原理

在某些场景下，渲染可以分类为**高优先级**和**低优先级**，如搜索功能，输入区域为高优先级，需要实时更新显示为用户当前正在输入的内容；下方搜索结果的展示，则允许有延迟或者误差，全看如何处理：
1. 在`startTransition`之前，我们通过`debouce`或者`throttle`约束搜索结果请求响应的频率，减少无效渲染导致的闪烁以及卡顿，在`react18`中，**相当于`react`内置了类似的解决方案**
2. ***为什么说全看如何处理***，因为通过`startTransition`包裹的部分，被react认定为低优先级渲染，需要通过`isPending`来给这部分延迟更新的`DOM`做一个`fallback`方案，否则看起来的效果会比使用`startTransition`优化之前更卡顿，**正确理解很关键**
3. 额外需要注意的是，在渲染强度不高的场景下，`isPending`看起来会没有效果，因为渲染开销并不大

#### 核心代码

```jsx
import React, { useState, useTransition } from "react";

export function FilterList({ names }) {
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState("");

  const [isPending, startTransition] = useTransition();

  const changeHandler = ({ target: { value } }) => {
    setQuery(value);
    startTransition(() => setHighlight(value));
  };

  return (
    <div>
      <input onChange={changeHandler} value={query} type="text" />
      {isPending
        ? "loading..."
        : names.map((name, i) => (
            <ListItem key={i} name={name} highlight={highlight} />
          ))}
    </div>
  );
}

function ListItem({ name, highlight }) {
  const index = name.toLowerCase().indexOf(highlight.toLowerCase());
  if (!highlight) {
    return <div>{name}</div>;
  }
  if (highlight && index !== -1) {
    return (
      <div>
        {name.slice(0, index)}
        <span className="highlight">
          {name.slice(index, index + highlight.length)}
        </span>
        {name.slice(index + highlight.length)}
      </div>
    );
  }
  return undefined;
}
```

#### 运行demo查看效果

* [withTransition](https://codesandbox.io/s/react18-usetransition-e70vf5)
* [withoutTransition](https://codesandbox.io/s/react18-no-usetransition-bg2b2i)

### 3.fetch as you render([Suspense](https://zh-hans.reactjs.org/docs/react-api.html#suspense))

#### 场景

设想一个场景，我们渲染一个组件A，依赖两个API获取数据(非强制依赖关系，任意一个完成即可开始渲染工作)，一般的写法 

```jsx
// fetch A then render
// fetch B then render
```

但是这样有一个问题，就是A或者B完成以后，一定会触发渲染，在渲染完成之前，另一个响应如果完成，并不能立即进行渲染更新，必须等待前一个渲染完成以后才行，造成了渲染性能浪费

那我们很容易想到，可以通过A+B并发的形式，等待A和B数据全部获取到以后，再进行渲染工作。

```jsx
// fetch A+B
Promise.all([A, B]).then(data => handleWithData(data))
```

但是这样会有另外的问题，假如任意一个接口响应卡慢，就会导致迟迟无法更新DOM渲染，十分影响体验。<small>*这里有兴趣的话，我们可以实现一个promise.alldeal方法，一次将所有传入的请求分别包装成单个promise请求，每个完成以后，都自动执行callback，有失败的，则返回对应list(包含唯一id、请求函数、绑定作用域的回调函数等信息)*</small>

react18之前，react是单向渲染流程，即渲染一旦启动，无法暂停，在当前渲染完成之前，无法做接下来的渲染工作；但是引入concurrent并发渲染模式以后，这将不是一个问题。


react支持以下两种渲染方式：
1. fetch then render: 获取到数据以后再渲染
2. fetch as you render: 边渲染边获取数据

#### 原理

1. 启动`suspense`会根据条件渲染所有组件或其fallback
2. 在条件没有发成或数据没有加载完成时，会先渲染fallback指定的组件
3. 一旦有数据加载成功，react会向上寻找最近的`suspense`组件，解除pending状态

但是要真实达到这个效果，react需要知道当前`suspense`包裹的数据是否加载完成，如何知道呢？

这对三方请求的API提出了要求，在数据未加载完成时，需要通过throw promise的方式，将这个pending状态的请求抛出，react会catch这个请求，设置一个当前`suspense`的pending状态，显示fallback的内容，一旦请求完成，react解除pending状态，触发重新渲染即可，通过以上的方式，达到了fetch as you render的并发渲染状态

```jsx
function Component() {
  if (data) {
    return <div>{data.message}</div>
  }
  throw promise
  // react will catch this, find the closest 'suspense' component
}

ReactDOM.createRoot(rootEl).render(
  <Suspense fallback={'loading..'}>
    <Component />
  </Suspense>
)
```

#### react18解决方案

```jsx
const resource = fetchProfileData()

function ProfilePage() {
  return (
    // 两个suspense包裹的内容会同时加载
    <Suspense fallback={<h1>loading profile...</h1>}>
      <ProfileDetails />
      <Suspense fallback={<h1>loading posts...</h1>}>
        <ProfileTimeline />
      </Suspense>
    </Suspense>
  )
}
function ProfileDetails() {
  const user = resource.user.read()
  return <h1>{user.name}</h1>
}
function ProfileTimeline() {
  const posts = resource.posts.read()
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  )
}
```

### 4. [useDeferredValue](https://zh-hans.reactjs.org/docs/hooks-reference.html#usedeferredvalue)

* 通过声明defer，react会优先处理紧急更新，声明defer的值在紧急更新完成之前会先使用旧的值，在紧急更新完成以后，转而进行该部分非紧急更新
* 和通过debounce、throttle进行defer update原理类似，但是：
  1. defer部分的更新是暂停的，不会触发该部分内容的回退
  2. 和debounce、throttle通过僵硬的一个固定time进行优化相比，react可以在其他工作完成以后，立即进行这部分更新，从时机上，更优化

```jsx
function Typeahead() {
  const query = useSearchQuery('');
  const deferredQuery = useDeferredValue(query);

  // Memoizing tells React to only re-render when deferredQuery changes,
  // not when query changes.
  const suggestions = useMemo(() =>
    <SearchSuggestions query={deferredQuery} />,
    [deferredQuery]
  );

  return (
    <>
      <SearchInput query={query} />
      <Suspense fallback="Loading results...">
        {suggestions}
      </Suspense>
    </>
  );
}
```

---

[1] [react-v18](https://zh-hans.reactjs.org/blog/2022/03/29/react-v18.html)