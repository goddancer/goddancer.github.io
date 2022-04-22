---
layout: post
title: Vue3 reactivity
categories: [Hide, Vue]
description: Vue3响应式原理
keywords: vue3, reactivity
---

## 响应式基础-通过demo引入概念

![same-site]({{site.url}}/assets/images/vue3/reactivity/引入响应式demo.jpg)

只要我们可以保存总价的计算方式，在单价或者数量变更之后，就能够通过这个方法重新计算总价这个effect

我们通过三个钩子函数，实现这个响应更新过程：
1. track 保存effect副作用计算函数
2. effect 执行一次副作用计算函数，得到第一次总价计算结果
3. trigger 当单价或者数量变更以后，我们出发一次存储中的副作用计算函数，得到一个最新的结果

只要将上述过程自动化，就是reactivity

```jsx
// 通过Set存储effect
// 使用set的原因是因为set does not allow duplicate values, 它不会重复添加effect
let dep = new Set()

// 通过track方法收集effect
function track() {
  dep.add(effect)
}

// 通过trigger触发每个effect
function trigger() {
  dep.forEach(effect => effect())
}
```

![same-site]({{site.url}}/assets/images/vue3/reactivity/dep-and-depsmap.jpg)

* dep: a dependency which is a set of effects that should get re-run when value change.
  * dep的每个value都是需要执行的匿名函数
* depsMap: a map where we store the dependency object for each property.
  * 属性key依赖的具有set结构的effects集合

```jsx
const depsMap = new Map()

function track(key) {
  // get the dep for this property(price, quantity..)
  let dep = depsMap.get(key)
  if (!dep) {
    // no dep yet, so let's create one
    depsMap.set(key, (dep = new Set()))
  }
  // add this effect
  // since it's a set, it won't add the effect again if it alreay exists
  dep.add(effect)
}

function trigger(key) {
  // get the dep fot this key
  let dep = depsMap.get(key)
  if (dep) {
    // if it exists, run each effect
    dep.forEach(effect => {
      effect()
    })
  }
}
```

![same-site]({{site.url}}/assets/images/vue3/reactivity/01.jpg)

* dep：set结构，记录每个key对应的effect
  * 通过记录其副作用，相当于记录了值的变化方式，当值重新发生变化时，只需要再次激活一次这个effect，即可得到最新的值
  * 这里之所以用set结构，是因为当重复add相同的effect时，不会生效
* depsMap: 单个reactive对象，map数据结构。
  * key为单个reactive对象的每个key，value为key对应的effect dep地址
  * 一个reactive对象，就是一个depsMap
  * 一个承载了单个对象各个key和其对应的effect的，只是为了索引每个key对应的effect
  * Map的键和值可以是任意类型数据
* targetMap: 存储多个reactive对象的WeakMap
  * 因为一个reactive对象就是一个depsMap，当有多个reactive对象时，我们需要额外的map存储多个对象的track追踪关系，所以有了targetMap
  * 它的key为每个reactive对象，value为depsMap地址
  * WeakMap只能以对象做key(和Map类似，实际上是以key的内存地址为键，只要内存地址不同，就视为两个键)，值可以是任意类型
  * WeakMap不会计入引用，即不会阻止GC进行垃圾回收

![dep depsMap三者关系]({{site.url}}/assets/images/vue3/reactivity/02.jpg)

引入targetMap以后，此时我们的track函数和trigger函数如图三所示：

![dep depsMap三者关系]({{site.url}}/assets/images/vue3/reactivity/03.jpg)

* **需要注意，此时track函数和effect在同一个作用域，所以暂时还没有effect是如何获取的疑问**

回顾整个数据结构，如图4所示：

![dep depsMap三者关系]({{site.url}}/assets/images/vue3/reactivity/04.jpg)

截止目前为止，我们可以追踪依赖，存储effect以在适当时机做数据更新，但是我们还没办法让effect自动重新运行，课程二

## 课程二

![dep depsMap三者关系]({{site.url}}/assets/images/vue3/reactivity/05.jpg)

目前我们还是通过手动的方式track和trigger，那么如何自动收集依赖和触发effect呢？

我们可以考虑数据set和get时进行处理：
* GET时，我们track单个reactive对象和需要读取的property
* SET时，我们比较数据，如果发生变化，那么我们trigger单个reactive对象对应property下存储的effect，重新计算即可

所以我们就变成了如何GET和SET：
* 在Vue2中，我们通过ES5的Object.defineProperty去拦截
* 在Vue3中，我们可以通过ES6 Reflect和ES6 Proxy代理

![dep depsMap三者关系]({{site.url}}/assets/images/vue3/reactivity/06.jpg)

我们有三种方式去获取一个对象的某个属性值，但是Reflect有额外的超能力，会在下面继续说明

![dep depsMap三者关系]({{site.url}}/assets/images/vue3/reactivity/07.jpg)

我们通过Proxy去代理一个值时，可以传入一个handler进行get｜set逻辑代理，此时最好就需要使用reflect进行操作，**因为reflect可以支持一个额外的receiver参数，做this绑定**
* receiver保证了当我们对象有继承自其他对象的值或者函数时，this指针能正确的指向使用的对象，这将避免一些我们在vue2中有的响应式警告

![dep depsMap三者关系]({{site.url}}/assets/images/vue3/reactivity/08.jpg)

结合set函数handler的demo如上

![dep depsMap三者关系]({{site.url}}/assets/images/vue3/reactivity/09.jpg)

我们将handler部分抽出来进行单独封装，返回一个Proxyed对象，**这就是reactive composition！！**

![dep depsMap三者关系]({{site.url}}/assets/images/vue3/reactivity/10.jpg)

结合我们之前的代码demo，现在track和trigger应该如何结合到proxy封装里呢？如上所示
需要注意:
* 这里的track(target, key)相当于track(product, 'quantity')
* 这里的trigger(target, key)相当于trigger(product, 'quantity')

![dep depsMap三者关系]({{site.url}}/assets/images/vue3/reactivity/11.jpg)

所以，包含自动化track和trigger的最终demo如上，
* 在读取(get)product.price时，我们track(product, 'price')；同理，track(product, 'quantity')
* ***模版解析时我们保存这个effect仅dep？***
* 当给track的属性进行赋值时，我们trigger：
  * 从targetMap中找到reactive对象product对应的depsMap
  * 从depsMap中根据quantity找到dep set
  * 遍历dep set，执行所有关联effct，从而完成模版数据更新

## lesson3

![dep depsMap三者关系]({{site.url}}/assets/images/vue3/reactivity/12.jpg)

只要我们尝试从reactive obj获取property，就会调用track，即使这个行为并不在effect中，这显然不是我们想要的，所以继续优化

![dep depsMap三者关系]({{site.url}}/assets/images/vue3/reactivity/13.jpg)

我们将effect这个匿名副作用函数传入一个封装函数中，这样我们不再需要显示声明执行副作用函数；同时，我们也有办法保存这个effect dep。***话说这个是不是和react的useEffect有点像***

**回到之前尚未解决的问题疑问中：track函数中的effect怎么保存，调用呢？**答案是：我们使用activeEffect去更新track

![dep depsMap三者关系]({{site.url}}/assets/images/vue3/reactivity/14.jpg)

作为对照，这个是之前的track函数

![dep depsMap三者关系]({{site.url}}/assets/images/vue3/reactivity/15.jpg)

我们在只有显示声明effect为activeEffect时，才去进行依赖收集

![dep depsMap三者关系]({{site.url}}/assets/images/vue3/reactivity/16.jpg)

让我们通过上面这个例子，结合一个场景进行思考，上面的例子可以正常工作，有几个原因：
* 我们将effect做了隐式收集track，这使得当自变量price或者quantity更新时，我们能够trigger所有相关的effect dep
* 我们effect中total和salePrice的计算，只涉及到自变量price和quantity
  * 假如我们计算total时，不再使用price * quantity两个自变量的方式，而是使用salePrice * quantity这种因变量*自变量的方式，就会出现问题
  * 因为在这个demo中，salePrice并不是reactive的，这里为什么这么说，解释一下：
    * 当price自变量更新时，salePrice作为因变量且做了effect依赖收集，是可以正常更新的
    * 但是当我们只更新了price，却想要获取最新的total时，问题出现了，因为salePrice并不是自变量，并不能使得total收集effect，进而当salePrice更新时主动更新total

![dep depsMap三者关系]({{site.url}}/assets/images/vue3/reactivity/17.jpg)

如何解决上面这个问题呢？答案是**ref**

![dep depsMap三者关系]({{site.url}}/assets/images/vue3/reactivity/18.jpg)

我们通过ref声明一个reactive的因变量，将变量结果保存到value中，**在进一步变更demo之前，我们先要知道怎么实现ref**

![dep depsMap三者关系]({{site.url}}/assets/images/vue3/reactivity/19.jpg)

第一种方式，我们通过reactive声明一个具有value属性的reactive obj，这对于demo来说是有效的，但却并不是vue3的实现方式，**为什么呢？**

> see question and answer 4.


![dep depsMap三者关系]({{site.url}}/assets/images/vue3/reactivity/20.jpg)

第二种方式，使用原生对象访问器或者计算属性，如上所示。那我们怎样通过Object Accessors来实现ref呢

![dep depsMap三者关系]({{site.url}}/assets/images/vue3/reactivity/21.jpg)

原理比较简单，实现如上。***但是ref这里有一个疑问，track时怎么收集effect呢？***

* 应该是通过同作用域，我们在effect里面保存了effect，然后通过activeEffect变量提升了effect，然后收集到track里面

![dep depsMap三者关系]({{site.url}}/assets/images/vue3/reactivity/22.jpg)

再回到例子，有了因变量依赖收集，此时一切表现起来比较正常了

## lesson4

回到上节课最后的例子，我们还在使用ref和effect处理因变量，但是这个形式和vue3中的computed计算属性已经很像了，我们看下computed的实现和解决了什么问题，在上一个课程我们还有一个因为，即ref中的effect具体是怎么收集的

![dep depsMap三者关系]({{site.url}}/assets/images/vue3/reactivity/23.jpg)

使用计算属性以后，看起来会是上面的形式，那么如何实现compunted呢

![dep depsMap三者关系]({{site.url}}/assets/images/vue3/reactivity/24.jpg)

computed实现如上，我们通过ref的方式声明存储因变量，同时使用activeEffect做effect提升，在ref中track effect，然后返回一个result。**至此，因变量也可以reactive了，并且我们算是一定程度上印证了上一节课我们提出的effect track疑问。**

![dep depsMap三者关系]({{site.url}}/assets/images/vue3/reactivity/25.jpg)

这里顺带解释了一下为什么在vue2中，我们一旦声明了reactive对象，再动态添加属性就会失去reactive，必须通过`Vue.set(obj, key, value)`的方式进行动态属性添加：
* 在Vue2中，事通过Object.defineproperty进行属性拦截的，用这个API就意味着，我们只能在单个属性下面添加getter和setter，这样是不灵活的，首先性能就会有问题，其次也是很关键的，无法动态检测到新的属性值，因为已经错过了初始化
* 在Vue3中，就不会有这个问题，我们通过proxy代理的方式，将getter和setter提升到reactive obj的顶级，只需要一次监听即可，性能更优，且可以动态监听新属性

还有其他什么好处呢？**参考Q&A 5.**

![dep depsMap三者关系]({{site.url}}/assets/images/vue3/reactivity/26.jpg)
![dep depsMap三者关系]({{site.url}}/assets/images/vue3/reactivity/27.jpg)
![dep depsMap三者关系]({{site.url}}/assets/images/vue3/reactivity/28.jpg)

我们将自己实现的响应式部分去掉，使用vue3的响应式代码，demo依旧运转正常，好像顶多能说明思想契合吧...

![dep depsMap三者关系]({{site.url}}/assets/images/vue3/reactivity/29.jpg)

我们如何阅读源码呢，这里是一份指引：
* effect.ts 定义了effect、track、trigger方法
* baseHandlers.ts 定义了proxy handlers(**get** and **set**)
  * 这里的get和set会调用effect中的track(record)和trigger
* reactive.ts 定义了基于ES6 proxy的reactive对象
  * reactive的proxy会通过handler的get和set方法，track和trigger
* ref.ts 通过Object原生计算属性的方式定义了reactive **ref**erence
  * ref也会调用track和trigger
* computed.ts 通过effect定义了computed方法，返回了一个类似ref的对象
  * vue3中并不是使用原生Object accessors，而是使用effect实现的computed

## lesson5 Q&A with Evan

### 1. In Vue2 Reactivity we used **depend** and **notify** for recording and playing back effects, and in Vue3 we use **track** and **trigger**, why the change?

> 
* Vue2是通过实例的方式存储依赖和通知依赖的；在Vue3中，并没有依赖dep类了，depend和notify被抽离到track和trigger中；
* 其实就是依赖通知和依赖收集触发的区别，思想行为语义化；

### 2. In Vue2 Reactivity **Dep** is a **class** with **subscribers**, and in Vue3 **dep** is simply a **Set**, Why the change?

![dep depsMap三者关系]({{site.url}}/assets/images/vue3/reactivity/30.jpg)

> 
* 在Vue2中有一个Dep类，如上图，存储了所有发布订阅的关系，称之为depend，放在一起的原因是因为这样更容易思考依赖关系
* 我们已经将depend和notify思想语义化重构为track和trigger了，剩下的部分其实就是一个依赖关系集合(一个Set集合)，那么也就不再需要单独的class来存储具体的依赖关系了；
* 或者可以说，依赖关系其实就是一个Set集合，我们只是把这部分Set拿出来而已；
* 还有一个考虑是因为Set相较于class的性能更好一点

### 3. How did you end up with this solution in Vue3 for storing effects?

![dep depsMap三者关系]({{site.url}}/assets/images/vue3/reactivity/31.jpg)

> 
* 在Vue2中，我们通过ES5 getter和setter转换，当你遍历对象上的键时，用forEach方法，你自然会有一个小闭包来存储属性关联的Dep，所以不需要像Vue3这样搞；
* 在Vue3中，因为我们通过Proxy进行对象代理，并没有闭包来为每个属性存储关联依赖项，**所以当我们需要始终能找到一个目标对象和一个该对象上的键所对应的依赖实例时，就需要一个额外的对应关系来存储，我们将这个依赖用两个不同等级的嵌套关系来存储**
* targetMap其实就是proxy的参数target

### 4. Why use Object Accessors with ref?

![dep depsMap三者关系]({{site.url}}/assets/images/vue3/reactivity/32.jpg)

> 
* 我们设定的ref只有一个返回值，就是值value本身，那如果使用reactive去承载的话，意味着我们可以往里面添加其他的属性，这违背了ref的目的；
* 从设计上来说，ref只能用作包装一个内部的值(因变量)使用，而不是一个一般的响应式对象；
* 同时，我们也实现了isRef check，返回的ref object实际上有一些特殊的东西，让我们知道这是一个ref而不是一个reactive objcet；
* 最后就是性能问题，reactive相较于ref承载的事情很多(比如检查对应的响应式副本等等)，不够纯粹；

### 5. Using Reflect & Proxy in Vue3 allows us to add properties later that we want to be reactive, but what other benefits does this give us?

> 
* 当使用proxy代理时，响应式代理本身会变成懒加载，和Vue2的实现不同的是，如果使用getter、setter，我们需要在reactive obj声明之初就遍历每个属性，给其添加各自的getter和setter；Vue3就不再需要，因为代理行为本身被提升到一个更高层级，也就是说代理行为只有真实发生访问的时候，才会确立，这本身就是比较大的性能优化，假如我们有很大量的的分页响应式数据，我们只需要关心首屏用到的数据即可，对程序启动性能也很优化

## 一起读源码

### 为什么要用nextTick

* 我们一旦更新了reactive的值，就会触发effect，假如在同一时间同时更新了几个值，那每次更新都触发effect是低效的，所以我们家一个延迟，nextTick就是做这个事情

* track：设置或者初始化targetMap、depsMap，装入effect
  * tragetMap：存储一个个reactive对象，key为reactive对象地址/name；value为reactive对象的depsMap
  * depsMap：存储单个reactive对象的各个属性对应的depsMap地址。key为属性名称，value为deps set地址
  * dep：每个reactive属性对应的effect dep
* trigger：触发单个属性对应的所有effect，执行一次

**react是一个纯运行时的解决方案，所以才会有一大堆需要优化的内容。**感觉像一次次打补丁？

## 为什么要使用reflect

因为reflect可以接受一个额外的参数，receiver，保证了当我们的对象有继承自其他对象的值或者函数时，this指针能正确的指向使用的对象。这将避免一些我们在vue2中有的响应式警告

---

[1] [Vue3 Reactivity](https://www.vuemastery.com/courses/vue-3-reactivity/vue3-reactivity)

[2] [bilibili](https://www.bilibili.com/video/BV1SZ4y1x7a9?p=6&spm_id_from=pageDriver)
