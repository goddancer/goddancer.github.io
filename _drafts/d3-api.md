---
layout: post
title: d3 basic api
categories: [D3]
description: d3 basic api
keywords: d3, chart, svg
---
## 理解`update`|`enter`|`exit`

* `update`: 当对应的元素数量正好和需要绑定的数据数量一致时。此时直接操作即可，后面可以直接跟`text`、`style`等操作

```javascript
```
* `enter`: 当对应的元素数量不足时，此时需要添加元素，使数据和元素数量相等。后面一般需要跟`append`操作

```javascript
// svg内无rect元素
svg
  .selectAll('rect')
  .data([1, 2, 3, 4])
  .enter()
  .append('rect') // 补充rect元素数量
  .attr('x', 10)
  .attr('y', (d, i) => i * 10)
  .attr('width', d=> d)
  .attr('height', 5)
  .attr('fill', 'blue')
```

* `exit`: 当元素数量过多时，此时需要移除元素，使数据和元素数量一致。后面一般需要跟`remove`操作

```javascript
// svg存在多个rect
svg.selectAll('rect')
  .data([1, 2, 3, 4])
  .attr('x', 10)
  .attr('y', (d, i) => i * 10)
  .attr('width', d=> d)
  .attr('height', 5)
  .attr('fill', 'blue')
  .exit()
  .remove()
```
## 比例尺

### 线性比例尺

```javascript
// 通过线性比例尺计算百分比柱状图
const dataset = [250, 210, 170, 130, 90]
const scaleLinear = d3.scaleLinear()
  .domain([0, d3.max(dataset)])
  .range([0, 100])
const svg = d3.select('#app')
  .append('svg')
  .attr('width', '100%')
  .attr('height', '100%')
svg
  .append('g')
  .attr('transform', 'translate(10, 10)')
  .selectAll('rect')
  .data(dataset)
  .enter()
  .append('rect') // 补充rect元素数量
  .attr('x', 10)
  .attr('y', (d, i) => i * 10)
  .attr('width', d => {
    console.log('d: ', scaleLinear(d));
    return scaleLinear(d)
  })
  .attr('height', 5)
  .attr('fill', 'blue')
```

### 序列比例尺

> 适合定义域和值域一一对应，不存在线性关系的场景

```javascript
// 根据余数决定颜色值，也即data本身循环color的结果
const dataset = [36, 250, 211, 172, 133, 94, 85, 76]
const color = ["red", "blue", "black", "green", 'orange']
const index = color.map((_, i) => i)
const scaleLinear = d3.scaleOrdinal()
  .domain(index)
  .range(color)
  console.log('scaleLinear: ', scaleLinear(100));
const svg = d3.select('#app')
  .append('svg')
  .attr('width', '100%')
  .attr('height', '100%')
svg
  .append('g')
  .attr('transform', 'translate(10, 10)')
  .selectAll('rect')
  .data(dataset)
  .enter()
  .append('rect')
  .attr('x', 10)
  .attr('y', (d, i) => i * 10)
  .attr('width', d => d)
  .attr('height', 5)
  .attr('fill', d => scaleLinear(d % color.length))
```
### 比例尺`range`和`rangeRound`的区别

`range`会根据domain进行精确映射，这往往会得到一个精度位数很长的小数，在设备显示可能会有锯齿
`rangeRound`会将所有输出的scale值映射至最近的非0有效整数值(0.023301 => 0.02)

```javascript
d3.range([10, 20, 30, 23, 13, 40, 27, 35, 20]) // [0, 1, 2, 3, 4, 5, 6, 7, 8]
```

```javascript
```

## 添加动画

> 动画很简单，只需要定义关键帧(初始、结束)的状态，然后进行过渡即可。

```javascript
.transition() // 声明动画开始
.duration(600) // 定义元素动画时常
.delay((d, i) => i * 100) // 每个元素逐渐动画，否则整体动画
```

## `arc`弧形生成器

> `Math.PI`为弧度`180deg`.[推导过程](../../../math/2021-02-11-radian.md)

`startAngle`: 弧度以12点钟为0度方向，顺时针为正

```javascript
```

```javascript

```
```javascript

```

```javascript

```

--

[1] [d3 API](https://github.com/xswei/d3js_doc/blob/master/API_Reference/API.md)
[2] [d3入门教程](https://juejin.cn/post/6982089492991574047#heading-24)