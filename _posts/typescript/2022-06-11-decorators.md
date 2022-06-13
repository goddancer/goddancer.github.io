---
layout: post
title: typescript decorators
categories: [Typescript]
description: typescript decorators
keywords: decorators
---

## 装饰器和继承的区别

### 继承-拿来就用

父类有一个功能，比如实现了一辆车，子类通过继承则可以使用这辆车，注意这里是使用，而不是获得(继承)。为什么这么说呢？
* 因为在JS传统继承的实现中，其实并没有真正的继承概念，而是通过一个叫做原型链引用的方式可以使用父类原型的方法，子类只是通过一个原型链指针可以使用父类开放的方法
  * 真正的继承应该是获得，具有安全的操作边界，即子类如果想对这辆车进行改造，不会对父类这辆车产生影响
* 假如父类更改了自己的方法，即使子类已经实例化完成，从父类继承的方法依然会发生变化，导致意外的污染
* 也是因为这个原因更推荐函数式的编程思维？

思考如下代码：
<iframe name="codemirror" font-size="14" src="{{ site.url }}/public/codemirror/index.html">
class A {
  name = 'nameA'
  constructor(name) {
    this.name = name
  }
  static fnA() {
    console.log('this is fnA')
  }
  fnA1() {
    console.log('this is fnA1')
  }
}
class B extends A {
  nameB = 'nameB'
  nameB1 = 'nameB1'
  constructor(name) {
    super(name)
  }
}
let b = new B('hola')
console.log('it should be [this is fnA1]', b.fnA1())
A.prototype.fnA1 = function () {
  console.log('fnA1 has changed!')
}
console.log('it should be [fnA1 has changed]', b.fnA1())
</iframe>

### 装饰-获得能力

我们通过装饰的方式进行修改自身，间接扩展了能力，类似于另一种方式的继承。
* 但是一般的装饰器操作不会有明显的副作用
还是以上面的例子，我们想拥有一辆车，我们通过装饰器，给我们一辆车即可，装饰器不会发生引用副作用的变更，我们获得这辆车以后，对车进行修改一般也没有问题

## 装饰器语法糖

我们通过`@`调用方法的形式调用装饰器，实际是一个语法糖，JS会把装饰器修饰的类或函数等主体作为参数传递进去；通过高阶函数其实是类似的效果。

参考如下等价实现代码：
```ts
const classDecorator: any = (args: string): ClassDecorator => (target: Function) => {
  console.log('args: ', args);
  target.prototype.fn = () => {
    return 'this is fn'
  }
}

@classDecorator('payload argumentsA')
class A {
  public fn() { }
}
let a = new A()
console.log('it should be [this is fn]:', a.fn())

class B { }
classDecorator('payload argumentsB')(B)
let b = new B()
console.log('it should be [this is fn]', (b as any).fn())
```

## 装饰器类型

装饰器通过使用用途的不同，一般分为几种装饰器，如：
* 类装饰器
* 属性装饰器
* 方法装饰器
* 访问器装饰器
* 参数装饰器

同一种装饰器一般也分为：
* 带参数装饰器
* 不带参数装饰器

其中，带参数装饰器可以简单的理解为**一个柯里化的不带参数装饰器**的实现

### 类装饰器

**类装饰器只有一个参数，即类本身**

* @parameters：
  1. `target`: 类的构造器
* @return：
  * 如果类装饰器返回了一个值，这个值将被用来代替原有的类构造器的声明
* **类装饰器适合用于继承一个现有类并添加一些属性和方法**

```ts
// 实现一：不接受参数的类装饰器
const classDecorator: ClassDecorator = (target: Function) => {
  target.prototype.fn = () => {
    return 'this is fn'
  }
}

@classDecorator
class A {
  public fn() {}
}
let a = new A()
console.log('it should be [this is fn]:', a.fn())

@classDecorator
class B {}
let b = new B()
console.log('it should be [this is fn]', (b as any).fn())
A.prototype.fn = function () {
  return 'this is new fn'
}
// 可以看到类装饰器在使得类获得能力的同时，一定程度避免了原型污染
console.log('it should be [this is fn]', (<any>b).fn())

//实现二：接受参数的类装饰器
const classDecorator: any = (args: string): ClassDecorator => (target: Function) => {
  console.log('args: ', args);
  target.prototype.fn = () => {
    return 'this is fn'
  }
}

@classDecorator('payload arguments')
class A {
  public fn() {}
}
let a = new A()
console.log('it should be [this is fn]:', a.fn())

@classDecorator
class B { }
let b = new B()
console.log('it should be [this is fn]', (b as any).fn())
A.prototype.fn = function () {
  return 'this is new fn'
}
console.log('it should be [this is fn]', (<any>b).fn())
```

**我们没有使用继承，避免了原型污染，但依然实现了类似继承的原型属性添加**

### 属性装饰器

* @parameters：
  1. `target`：**对于静态(static声明)成员来说是类的构造器，对于实例(public声明)成员来说是类的原型链**
    * 这里简单解释一下，对于static声明的静态成员来说，因为静态属性是通过构造器实现的，静态属性的调用不依赖于实例化过程，可以直接通过构造器调用，所以对于静态成员来说，taget即class constructor
    * 对于public(默认)声明的成员来说，因为成员的调用访问必须经历实例化过程绑定到原型以后，才能调用，所以对于public实例成员来说，返回的target即class的原型链
  2. `propertyKey`：属性的名称
* @return:
  * 返回的结果将被忽略

属性监听器：

```ts
function isValidKey(key: string | number | symbol, object: Object): key is keyof typeof object {
  return key in object
}
function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
const observable: any = (args: string): PropertyDecorator => (target: Object, key: string | symbol) => {
  let fnName = `on${capitalizeFirstLetter(String(key))}Change` as string
    ; (target as Record<string, any>)[fnName] = function (callback: (prev: any, next: any) => void) {
      let preValue = (this as Record<string | symbol, any>)[key]
      Object.defineProperty(this, key, {
        set(newValue) {
          callback(preValue, newValue)
          preValue = newValue
        }
      })
    }
}

class A {
  @observable('payload argumentsA')
  public name: string = 'public name!'

  @observable('payload argumentsB')
  static name1: string = 'static name!'

  public fn() { }
}
let a = new A();
(<any>a).onNameChange((pre: any, next: any) => console.log(`pre: ${pre}, next: ${next}`));
a.name = 'public name changed!';
(<any>A).onName1Change((pre: any, next: any) => console.log(`pre: ${pre}, next: ${next}`));
A.name1 = 'public name changed!'
```

### 方法装饰器

* @parameters：
  1. `target`: 对于静态(static)成员来说是类的构造器，对于实例成员(public)来说是类的原型链
  2. `propertyKey`：属性的名称
  3. `descriptor`：属性的[描述器](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)
* @return：
  * 如果返回了值，则会被用来替代属性的描述器

方法装饰器不同于属性装饰器的地方在于`descriptor`参数。通过这个参数我们可以修改原本的方法实现，比如可以采用HOC的方式，添加一下注入的逻辑。

`logger`功能实现：

```ts
const logger: MethodDecorator = <T>(target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>): void | TypedPropertyDescriptor<T> => {
  const originalFn = descriptor.value as T as unknown as Function
    ; (<any>descriptor.value) = function (...args: any) {
      console.log(`[${String(key)}]params:`, args)
      const result = originalFn.call(this, ...args)
      console.log(`[${String(key)}]result:`, result)
      return result
    }
}

class A {
  @logger
  public add(x: number, y: number): number {
    return x + y
  }

  @logger
  static decrese(x: number, y: number): number {
    return x - y
  }
}
let a = new A();
console.log('it should be [3]:', a.add(1, 2))
console.log('it should be [1]:', A.decrese(2, 1))
```

### 访问装饰器

访问器装饰器和方法装饰器接受的参数很类似，总体是一致的，只有`descriptor`的key有区别：

方法装饰器的描述key为：
* value
* wroteable
* enumerable
* configurable

访问装饰器的描述key为：
* get
* set
* enumerable
* configurable

```ts
const freeze: MethodDecorator = <T>(target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>) => {
  const originalSet = descriptor.set
  descriptor.set = function (value: any) {
    console.log(`new value is: <${value}> and ignored!`);
    return originalSet?.call(this, (this as Record<string | symbol, any>)[key])
  }
}

class A {
  private _name: string = 'jico'

  @freeze
  set name(value: string) {
    this._name = value
  }
  get name(): string {
    return this._name
  }
}
let a = new A();
console.log('it should be [jico]:', a.name);
a.name = 'hola'
console.log('it should be [jico]:', a.name);
```

### 参数装饰器

* @parameters：
  1. `target`：对于静态成员(static)来说是类构造器，对于实例成员(public)来说是类的原型链
  2. `propertyKey`：属性的名称(**注意是方法的名称，不是参数的的名称**)
  3. `parameterIndex`：参数在arguments的位置下标
* @return
  * 返回的值将被忽  

**单独的参数装饰器能做的事情有限，一般用来记录其他装饰器需要使用到的信息**

一个不生效的例子：

```ts
const arg = (strKey: string): ParameterDecorator => (target: Object, key: string | symbol, index: number) => {
  const descriptor = Object.getOwnPropertyDescriptor(target, key)
  const originalFn = descriptor?.value;
  // 改写的方法并未执行
  ; (descriptor as Record<string | symbol, any>).value = function (...args: any) {
    console.log('args: ', args);
    args[index] = (globalReq as Record<string | symbol, any>)[strKey]
    return originalFn.apply(this, args)
  }
}

const globalReq = {
  lang: 'zh-hans'
}
class A {
  fn(@arg('lang') lang: string) {
    return lang
  }
}
let a = new A();
console.log('it should be [zh-hans] but result is [test]:', a.fn('test'));
```

## 装饰器叠加

## 装饰器执行顺序

---

[1] [TypeScript装饰器完全指南](https://saul-mirone.github.io/zh-hans/a-complete-guide-to-typescript-decorator/)
