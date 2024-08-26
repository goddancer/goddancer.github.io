---
layout: post
title: React magic - useEvent
categories: [React]
description: React magic - useEvent
keywords: useMemo, useCallback, useEvent
---
## 1、rxjs编程规范

1. 代表“流"的变量标识符，都是“$"符号结尾，这是RxJS编程中普遍使用的风格，被称为“芬兰式命名法"(Finnish Notation)
2. 函数式编程规范

* 声明式Declarative
* 纯函数Pure Function
* 数据比可变Immutability

3. 纯函数满足的条件

* 函数的执行过程完全由输入参数决定，不会受除参数之外的任何数据影响
* 函数不会修改任何外部状态，比如修改全局变量或传入的参数对象

## 2、rxjs基本概念

### 2.1、Observable和Observer

在rxjs中，Observable对象就是一个发布者，通过Observable对象的subscribe函数，可以把这个发布者和某个观察者Observer连接起来

* Observable就是可以被观察的对象，即可被观察者
* Observer就是观察者
* 链接两者的桥梁就是Observable对象的subscribe

![1709972282849]({{site.url}}/assets/images/rxjs/1709972282849.png)

rxjs中的数据流就是Observable对象，Observable实现了下面两种设计模式：

* 观察者模式 Observer Pattern
* 迭代器模式 Iterator Pattern

在rxjs中，作为迭代器的使用者，并不需要主动去从Observable中拉取数据，只要subscribe上Observable对象以后，自然能收到数据的推送，这是观察者模式和迭代器模式的组合

### 2.2、new Observable

* Observable对象必须要有一个next属性，用于接受推过来的数据
* 如果不主动调用complete，即使声明了complete函数，也收不到完结信号
* 一个Observable对象只有一种终结状态，要么完结complete，要么出错error，两个状态具有二一性，进入任何一个状态以后即终结，不会再调用next
* unsubscribe退订以后，Observer不再接收到被推送的数据，但是并不表示Observable终结，因为并没有调用complete，只不过再也不会调用next而已
  * Observable产生的事件，只有Observer通过subscribe订阅以后才会收到，在unsubscribe之后就不会再收到

```typescript
const source$ = new Observable((subscibe) => {
  subscibe.next(1)
  subscibe.next(2)
  // subscibe.complete()
})
const subscription = source$.subscribe({
  next(value) {
    console.log('value: ', value);
  },
  error(err) {
    console.log('err: ', err);
  },
  complete() {
    console.log('complete');  
  },
})
subscription.unsubscribe()
```

## 3、操作符Operators

### 3.1、操作符基本原则

每一个操作符都是一个函数，不管实现什么功能，都必须考虑下面的功能要点：

1. 返回一个全新的Observable对象
2. 对上游和下游的订阅及退订处理
3. 处理异常情况
4. 及时释放资源
   * 从DOM中订阅的事件，会在DOM添加事件处理函数，如果只添加而不删除，就会有内存泄漏的危险，所以在退订的时候需要同时释放事件处理函数

以map为例：

1. 每个操作符都是一个高阶函数，订阅上游传递来的observable，返回一个新的Observable对象
2. 在新的Observable函数中，通过project对每次订阅的value进行处理
3. 当不再需要从某个Observable对象获取数据的时候，就要退订这个Observable对象

```typescript
const rxMap = (project) => {
  return (observable) => new Observable((subscriber) => {
    const sub$ = observable.subscribe({
      next: (value) => subscriber.next(project(value)),
      error: (err) => subscriber.error(err),
      complete: () => subscriber.complete()
    })
    return {
      unsubscribe: () => {
        console.log('unsub');
        return sub$.unsubscribe()
      }
    }
  })
}
const source$ = of(1, 2, 3).pipe(rxMap(v => v * v))
source$.subscribe(v => {
  console.log('v: ', v);
})
```

### 3.2、数据流操作符

* 同步数据流：顺序无关，一次性吐出全部数据
* Cold Observable： 可以反复使用，每一个Observer都会重复吐出同样的数据
  * 执行完成以后，会自动执行unsubscribe
* Hot Observable：数据的产生不受rxjs控制

| 操作符           | 功能                                          | 范例        | 备注                                                                                        |
| ---------------- | --------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------- |
| of               | 根据有限的数据产生同步数据流                  | of(1,2,3)   | * 同步数据流<br />* Cold Observable<br />* 单次数据流完成以后即调用complete<br />* 主动退订 |
| range            | 产生一个数据范围内的数据                      | rang(1, 10) | * 行为同上                                                                                  |
| generate         | 以循环的方式产生数据                          |             | * 行为同上<br />* 类似于for循环                                                             |
| repeat           | 重复产生数据流中的数据                        |             | * 行为同上                                                                                  |
| repeatWhen       | 同上                                          |             | * 行为同上                                                                                  |
| empty            | 产生空数据流                                  |             | * 行为同上                                                                                  |
| throw            | 产生直接出错的数据流                          |             | * 行为同上                                                                                  |
| never            | 产生永不完结的数据流                          |             | * 行为同上                                                                                  |
| interval         | 间隔给定时间持续产生数据                      |             | * 不会主动退订<br />* Cold Observable                                                       |
| timer            | 同上                                          |             |                                                                                             |
| from             | 从任何可iterator的数据产生数据流，包括Promise |             |                                                                                             |
| fromEvent        | 从外部事件产生数据流，如DOM事件               |             |                                                                                             |
| fromEventPattern | 同上                                          |             |                                                                                             |
| ajax             | 从AJAX请求结果产生数据流                      |             |                                                                                             |
| defer            | 延迟产生数据流                                |             |                                                                                             |
|                  |                                               |             |                                                                                             |

#### 3.2.1、of

* 产生同步数据流
* Cold Observable，可以重复调用，行为不变
* 数据流完成以后即调用complete

```typescript
const source$ = of(1, 2, 3)
// 1 2 3 complete1
source$.subscribe({
  next(value) {
    console.log('value: ', value);
  },
  complete() {
    console.log('complete1');
  },
})
// 1 2 3 complete2
source$.subscribe({
  next(value) {
    console.log('value: ', value);
  },
  complete() {
    console.log('complete2');
  },
})
```

#### 3.2.2、range

* 行为同of

```typescript
const source$ = range(1, 3)
// 1 2 3 complete1
source$.subscribe({
  next(value) {
    console.log('value: ', value);
  },
  complete() {
    console.log('complete1');
  },
})
// 1 2 3 complete2
source$.subscribe({
  next(value) {
    console.log('value: ', value);
  },
  complete() {
    console.log('complete2');
  },
})
```

#### 3.3.3、generate

* 相当于js中的for循环构造
* generate(initialState, condition, iterate, resultSelector?))
  * resultSelector可选
* 第一个参数为值，其余参数应保持为纯函数

```typescript
const source$ = generate(0, val => val < 3, v => v + 1, v => v * v)
// 0 1 4 compete1
const sub$ = source$.subscribe({
  next(value) {
    console.log('value: ', value);
  },
  complete() {
    console.log('complete1');
  },
})
sub$.add(() => {
  console.log('execute before unsubscribe');
})
// 0 1 4 compete2
source$.subscribe({
  next(value) {
    console.log('value: ', value);
  },
  complete() {
    console.log('complete2');
  },
})
```

#### 3.3.4、repeat & repeatWhen

* repeat只有收到单个Observable对象的complete事件以后，才会进行下一次的重新订阅repeat
  * 如果上游的Observable永不完结，则永远不会发生repeat

```typescript
const source$ = of(1).pipe(repeat(2))
const sub$ = source$.subscribe({
  next(value) {
    console.log('value: ', value);
  },
  complete() {
    console.log('complete1');
  },
})
sub$.add(() => {
  console.log('execute before unsubscribe');
})
source$.subscribe({
  next(value) {
    console.log('value: ', value);
  },
  complete() {
    console.log('complete2');
  },
})

// repeatWhen
const source$ = of('Repeat message')
const documentClick$ = fromEvent(document, 'click')
const result$ = source$.pipe(repeatWhen(() => documentClick$))
result$.subscribe(data => console.log(data))
```

#### 3.3.5、三个极简的操作符：EMPTY、NEVER、throwError

* 为了方便定位问题发生的调用栈，throwError需要返回一个可以抛出异常的函数
  * 如果需要提前记录异常的调用栈信息，可以声明一个提前定义的异常常量
* error与complete具有二一性，但是unsubscribe依然会执行

```typescript
// const source$ = EMPTY
// const source$ = NEVER
const source$ = throwError(() => new Error('123'))
const sub$ = source$.subscribe({
  next(value) {
    console.log('value: ', value);
  },
  error(err) {
    console.log(err);
  },
  complete() {
    console.log('complete1');
  },
})
sub$.add(() => {
  console.log('execute before unsubscribe');
})
source$.subscribe({
  next(value) {
    console.log('value: ', value);
  },
  error(err) {
    console.log(err);
  },
  complete() {
    console.log('complete2');
  },
})
```

#### 3.3.6、interval和timer：定时产生数据

* timer是interval的超集，完全可以用timer替代interval
  * 从效果上 `interval(1000)`等价于 `timer(1000, 1000) `
* timer还支持传入一个时间对象，用于定时返回

```typescript
const interval$ = interval(1000)
const timer$ = timer(new Date(Date.now() + 2000))
const sub1$ = interval$.subscribe(v => {
  console.log('v: ', v);
})
timer$.subscribe(v => {
  console.log('v: ', v);
  sub1$.unsubscribe()
})
// 0 1 0
```

#### 3.3.7、from：可以把一切转化为Observable

* 任何iterable的对象，如arguments、array-like、generator函数等，都可以转化
* Promise也可以转化，直接取出值返回，类似于await
  * 但是需要注意，如果有Promise的reject，则会直接抛出错误
  * 因为error和complete具有二一性，所以也不会调用complete

```typescript

const source1$ = from([1, 2, 3])
source1$.subscribe(v => {
  console.log('v: ', v); // 同步数据流：1 2 3
})
const source2$ = from('abc')
source2$.subscribe(v => {
  console.log('v: ', v); // 同步数据流：a b c
})
const source3$ = from(of('q', 'w', 'e'))
source3$.subscribe(v => {
  console.log('v: ', v); // 同步数据流：q w e
})
const source4$ = from(Promise.resolve('fullfilled'))
source4$.subscribe(v => {
  console.log('v: ', v);
})
const source5$ = from(Promise.all([Promise.resolve('fullfilled1'), Promise.resolve('fullfilled2')]))
source5$.subscribe(v => {
  console.log('v: ', v); // ['fullfilled1', 'fullfilled2']
})
const source6$ = from(Promise.all([Promise.resolve('fullfilled'), Promise.reject('rejected')]))
source6$.subscribe({
  next(value) {
    console.log('value: ', value);
  },
  error(err) {
    console.log('err: ', err); // err:  rejected
  },
  complete() {
      console.log('completed');
  },
})
```

#### 3.3.8、fromEvent：将事件转化为Observable

* 任何DOM事件、自定义事件、EventEmitter事件，都可以转化

```typescript
const source1$ = fromEvent(document.querySelector('body'), 'click')
source1$.subscribe(({clientX}) => {
  console.log('clientX: ', clientX);
})
// 创建一个可冒泡、不可取消的自定义test事件
const diyEvent = new Event('test', { bubbles: true, cancelable: false })
const source2$ = fromEvent(document.querySelector('body'), 'test')
source2$.subscribe((v) => {
  console.log('v.type: ', v.type); // test
})
document.body.dispatchEvent(diyEvent)
```

#### 3.3.9、fromEventPattern是fromEvent的自定义灵活形式

* fromEventPattern接受两个函数参数，分别是订阅addHandler和退订removeHandler函数，具体的行为可以自定义，很灵活
* 但是自定义的handler只能触发Observable的next方法，无法触发error和complete

```typescript
const diyEvent = new Event('test', { bubbles: true, cancelable: false })
const addHandler = (handler) => document.body.addEventListener('test', handler)
const removeHandler = (handler) => document.body.removeEventListener('test', handler)
const source$ = fromEventPattern(addHandler, removeHandler)
const sub$ = source$.subscribe({
  next(value) {
    console.log('v.type: ', value.type); // test
  },
  error(err) {
    console.log('err: ', err); // will never execute
  },
  complete() {
    console.log('completed'); // will never execute
  },
})
document.body.dispatchEvent(diyEvent)
sub$.unsubscribe() // will remove handler
document.body.dispatchEvent(diyEvent)
```

#### 3.3.10、

```typescript
const dragUtil$ = (selector) => {
  const mouseDown$ = fromEvent(selector, 'mousedown');
  const mouseUp$ = fromEvent(selector, 'mouseup');
  const mouseOut$ = fromEvent(selector, 'mouseout');
  const mouseMove$ = fromEvent(selector, 'mousemove');
  const drag$ = mouseDown$.pipe(concatMap((startEvent) => {
    const initialLeft = box.offsetLeft;
    const initialTop = box.offsetTop;
    const stop$ = merge(mouseUp$, mouseOut$)

    return mouseMove$.pipe(takeUntil(stop$)).pipe(throttleTime(10)).pipe(map((moveEvent) => {
      return {
        x: moveEvent.x - startEvent.x + initialLeft,
        y: moveEvent.y - startEvent.y + initialTop,
      };
    }))
  }))

  return drag$
}
setTimeout(() => {
  const box = document.querySelector('#box');
  const drag$ = dragUtil$(box)
  drag$.subscribe(event => {
    box.style.left = event.x + 'px';
    box.style.top = event.y + 'px';
  });
}, 1000)
```

---

* [RxJs在React中的实践](https://zhuanlan.zhihu.com/p/358645442)
  * https://juejin.cn/post/6910943445569765384
* mobx：
  * https://zhuanlan.zhihu.com/p/114292057
  * https://zh.mobx.js.org/observable-state.html
  * https://cn.mobx.js.org/intro/concepts.html
* DiDi-logicFlow：
  * https://github.com/didi/LogicFlow
  * https://juejin.cn/post/7213547986483380282
  * https://i.xiaojukeji.com/way/article/11457020?lang=zh-CN

---
