---
layout: post
title: FilterList和IOS debounce恩怨情仇
categories: [Javascript]
description: FilterList和IOS debounce恩怨情仇
keywords: debounce, IOS, filter-list
---

## 问题原因

> FilterList需要解决的核心问题在于，IOS发生边界滚动`debounc`e行为时，尝试获取`scrollLeft`等滚动值**会有延迟**，同时在频繁快速触发`debounc`e行为时，**无法获取**到`scrollLeft`等滚动值

***我们知道通过重写滚动，达到完全模拟滚动的效果一定能解决这个问题，但是我们还是希望能享受原生丝滑的滚动效果，没有丝毫延迟，有没有可能？**

### `filterBar`固定

固定`filterBar`有两种方式：
1. 在达到临界条件时，将列表的第一项`fixed`，同时通过margin或者padding撑开上顶部
2. `filterBar`单独抽离进行`fixed`定位，和滚动列表区域隔离开

方式1会有以下致命问题：
* 因为**`filterBar`需要被固定的第一项元素在`filterBar` wrap中，又`bounce`是基于当前有可滚动内容的盒子的容器边界**，所以会发生一个诡异的现象，即边界无限高层级的`bounce`层覆盖容器内`fixed`定位的第一个元素的情况。总是被短暂覆盖，导致闪烁。
* **当`fixed`定位元素的祖先容器**存在滚动行为时，在快速滑动时会导致`fixed`定位丢失，发生跟随移动的问题。可通过**[1]**进行一定程度hack优化。

方式2**因为`fixed`定位的`filterBar`和可能发生`bounce`的内容承载盒子相互隔离**，所以不会存在这个问题。

## 问题处理

主要分X、Y轴两个场景进行考虑

### 以X轴场景为例，Y轴类似

#### 1. X轴无需滑动，Y轴内容需要滑动，`filterBar`固定

此场景比较简单，适合小体量的简单列表；分离`filterBar`和`content`区域进行布局即可

#### 2. X轴无需滑动，Y轴需要滑动，`filterBar`不需要固定

鸡肋场景，一体化布局即可

#### 3. X轴需要滑动，Y轴需要滑动，`filterBar`固定

* `filterBar`和`content`区域分离布局，使`content`基于Y轴的原生滚动不会在`debounc`e发生时影响`fixed`定位和高层级覆盖问题
* `content`X轴滚动内容，监听滚动事件，和`filterBar`做滚动同步，这里的同步需要使用A=B=`scrollLeft`的形式，使`filterBar`和`content`X之间互相约束，尽可能的同步移动
* `filterBar`的滚动行为需要屏蔽掉，不然就需要考虑事件的动态绑定，因为同时绑定两个区域的滚动，且采用A=B=`scrollLeft`的形式，会导致多重赋值，发生视图抖动
* X轴临界`debounc`e场景的处理：
  * 在X轴边界发生`debounc`e时，因为存在`debounc`e特性导致的位移获取延迟甚至获取不到的问题，会导致`filterBar`位移同步脱节
  * 解决这个问题需要增加手势操作，识别用户X+ X- Y+ Y-四个方向，同时配合`scrollLeft`和`scrollWidth`和`clientWidth`之间的关系，检测是否到达边界
  * 当到达边界以后，配合eventListener的passive特性，进行event.preventDefault()操作，屏蔽手势
  * 但使用这个方法仍不是最佳效果，因为在边界发生`debounc`e的瞬间，是无法通过eventListener强制中断的，或者说，也没办法在发生`debounc`e的瞬间即拿到scroll相关值，所以会发生细微的抖动，详细可以看demo效果，不过此效果也还可以了
* 进一步优化用户疯狂在边界触发`debounc`e的行为：
  * 疯狂触发`debounc`e需要用户频繁的发生touch三部曲事件，可以在`touchend`发生时，激活一个`fixed`定位的高层级蒙板，阻断用户和真实滚动元素的交互，使频繁的`debounc`e无法发生
  * 亲测`debounc`e的效果结束大概在300ms以内，所以这样处理的代价是，需要屏蔽300ms手势，也即用户想在300ms内重复操作滚动成为了不可能

### 模拟滚动

1. 可以通过使用`betterScroll`完全模拟X轴的滚动，组内亲测效果可以，只是X轴的滑动变得不丝滑。也难免，通过`translate`计算手势位移的方式，是很耗费性能的。

## demo

[手机模式预览，IOS真机最佳]({{site.url}}/public/vue3-case/index.html#/filter-list)

---

[1] []()
