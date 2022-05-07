---
layout: post
title: Vue keep-alive原理
categories: [Vue]
description: Vue keep-alive原理
keywords: vue2, vue3, vue, keey-alive
---

## keep-alive思维纵览

* keep-alive是一个内置组件，同时也是一个抽象组件，在Vue2中，以`abstract: true`标识。
  * 它不会创建真实DOM元素
  * 在组件间建立父子关系时，它会被忽略
* 缓存规则：
  * include包含且exclude不包含
* 缓存的核心原理，在组件内部：
  * 通过`cache`缓存匹配组件的VNode数据
    * 需要注意VNode中包含DOM数据，会比较占用内存空间，所以需要通过max参数控制缓存的实例数量
  * 通过`keys`缓存匹配组件的`vnode.key || vnode.type`
* 生命周期，因为已经缓存，不再是创建销毁：
  * 当组件在keep-alive内切换时，子组件的`mounted`和`unmounted`钩子不会被调用
  * 取而代之的是`activated`和`deactivated`钩子
    * 这两个生命周期的hook，通过调用`registerKeepAliveHook`注入到对应子组件实例的生命周期中

### 缓存声明

```tsx
type CacheKey = string | number | symbol | ConcreteComponent
type Cache = Map<CacheKey, VNode>
type Keys = Set<CacheKey>

const cache: Cache = new Map()
const keys: Keys = new Set()
```

### 参数控制

* `include`：只有名称匹配的组件才会被缓存
* `exclude`：任何名称匹配的组件都不会被缓存
* `max`：最多可以缓存多少组件实例
  * 因为缓存的本质是存储了VNode对象，VNode本身包含了DOM信息，会占用一定的内存，我们通过这个参数进行缓存数量控制，达到内存使用限制的效果

```tsx
type MatchPattern = string | RegExp | (string | RegExp)[]

export interface KeepAliveProps {
  include?: MatchPattern
  exclude?: MatchPattern
  max?: number | string
}
```

### `activated`和`deactivated`生命周期hook注入

需要注意的是：
* **这两个生命周期hook的注入动作是在keep-alive内进行的**
* **hook被注入到了实例的生命周期中，也就是说，在设计上允许每个实例的生命周期有所不同**

```tsx
export function onActivated(
  hook: Function,
  target?: ComponentInternalInstance | null
) {
  registerKeepAliveHook(hook, LifecycleHooks.ACTIVATED, target)
}

export function onDeactivated(
  hook: Function,
  target?: ComponentInternalInstance | null
) {
  registerKeepAliveHook(hook, LifecycleHooks.DEACTIVATED, target)
}
```

### max实例控制

```tsx
const { cache, keys } = this
const key: ?string = vnode.key == null
  // same constructor may get registered as different local components
  // so cid alone is not enough (#3269)
  ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
  : vnode.key
if (cache[key]) {
  vnode.componentInstance = cache[key].componentInstance
  // make current key freshest
  remove(keys, key)
  keys.push(key)
} else {
  cache[key] = vnode
  keys.push(key)
  // prune oldest entry
  if (this.max && keys.length > parseInt(this.max)) {
    pruneCacheEntry(cache, keys[0], keys, this._vnode)
  }
}
```

这一点比较有意思，在Vue2中，是通过数组对`vnode.key`进行管理的：
* 每次激活缓存时，将key先删除，然后推倒数组的末尾
* 通过这样的操作，当缓存的VNode实例数量超过max时，将较旧的`vnode.key`删除

```tsx
if (cachedVNode) {
  // copy over mounted state
  vnode.el = cachedVNode.el
  vnode.component = cachedVNode.component
  if (vnode.transition) {
    // recursively update transition hooks on subTree
    setTransitionHooks(vnode, vnode.transition!)
  }
  // avoid vnode being mounted as fresh
  vnode.shapeFlag |= ShapeFlags.COMPONENT_KEPT_ALIVE
  // make this key the freshest
  keys.delete(key)
  keys.add(key)
} else {
  keys.add(key)
  // prune oldest entry
  if (max && keys.size > parseInt(max as string, 10)) {
    pruneCacheEntry(keys.values().next().value)
  }
}
```

在Vue3中，通过一个特殊的Map数据结构进行管理，[详细参考]({% link _posts/javascript/2021-05-01-js-q-and-a.md %})
* 因为Map是iterator可迭代的，我们知道`[Symbol.iterator]`迭代器本身其实就是一个函数，返回一个具有next属性的对象，其中next为一个方法，调用会返回当前迭代的状态，包含`{value: value, done: boolean}`
* 所以这里的`keys.values().next().value`其实就是返回Map的第一个value
* 结合到max管理这里，因为每次其实是删除一个key，再添加一个key，因为Map是按照key插入的顺序进行管理的，所以只需要删除第一个value即可，第一个即最旧的一个

---

[1] [Vue3 keep-alive 源码](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/components/KeepAlive.ts#L48)

[2] [Vue技术揭秘](https://ustbhuangyi.github.io/vue-analysis/v2/extend/keep-alive.html#%E5%86%85%E7%BD%AE%E7%BB%84%E4%BB%B6)
