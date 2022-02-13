---
layout: post
title: svg基本元素
categories: [svg]
description: svg基本元素
keywords: svg
---

## 基本原则

> svg文件全局有效的规则是“后来居上”，越后面的元素越可见。

可以理解为，svg就是一块声明区域的画布上，一系列元素的堆叠，都是基于绝对坐标的位置排列，则后面的元素或覆盖在前面的元素上。

> SVG和Canvas的坐标系统以左上角为坐标起点，x轴正向向右，y轴正向向下。

## 基本属性

### `stroke`

* `stroke`: 线条颜色
* `stroke-width`: 线条宽度
* `stoke-opacity`: 线条透明度
* ``: 
* ``: 
* ``: 
* ``: 

### `fill` 

* `fill`: 填充颜色
* `fill-opacity`: 填充色透明度
* ``: 
* ``: 
* ``: 
* ``: 
* ``: 
* ``: 
* ``: 
* ``: 
* ``: 
* ``: 

## 基本图形

<iframe name="codemirror" font-size="14" src="{{ site.url }}/packages/apps/codemirror/lib/index.html">
document.querySelector('#app').innerHTML = `
  <svg width="400" height="400" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="30" height="30" stroke="blue" fill="transparent" stroke-width="5" />
    <rect x="50" y="10" rx="10" ry="10" width="30" height="30" stroke="red" fill="transparent" stroke-width="5" />
    <rect x="90" y="10" rx="5" ry="10" width="30" height="30" stroke="red" fill="transparent" stroke-width="5" />
    <rect x="130" y="10" rx="10" ry="5" width="30" height="30" stroke="red" fill="transparent" stroke-width="5" />

    <circle cx="30" cy="70" r="20" stroke="red" stroke-width="5" fill="transparent" />

    <ellipse cx="80" cy="70" rx="20" ry="10" stroke="red" stroke-width="5" fill="transparent" />
    <ellipse cx="120" cy="70" rx="10" ry="20" stroke="red" stroke-width="5" fill="transparent" />

    <line x1="10" y1="100" x2="150" y2="120" stroke="orange" stroke-width="5" fill="transparent" />
    <polyline points="10 160, 20 155, 30 180, 40 150, 100 150" stroke="red" stroke-width="5" fill="transparent" />
    <polyline points="50 200, 80 240, 20 240, 50 200" stroke="red" stroke-width="3" fill="transparent" />

    <polyline points="50 250, 80 290, 20 290" stroke="green" stroke-width="5" fill="transparent" />
    <polygon points="120 250, 150 290, 90 290" stroke="green" stroke-width="5" fill="transparent" />
    <polyline points="190 250, 220 290, 160 290, 190 250" stroke="green" stroke-width="5" fill="transparent" />
  </svg>
`
</iframe>

### 线

* 【1】：
  * 80 * 80，xy坐标为矩形左上角基准坐标
  * width沿X轴方向；height沿Y轴方向
  * stroke绘制有点意思，会占用边线和内部盒模型各一半，相当于一半是border，也即设置stroke会导致外延1/2。此时矩形实际为90 * 90
  * 最后一个path的X为180，stoke-width=5，外延=2.5；第一个rect的X为185，减去180再减去前面path的外延2.5，再减去第一个ract的外延4/2=2，实际间隙为0.5
* 【2】：
  * 1
<iframe name="codemirror" font-size="14" src="{{ site.url }}/packages/apps/codemirror/lib/index.html">
document.querySelector('#app').innerHTML = `
  <svg width="400" height="200" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <!-- 【1】 -->
    <rect x="185" y="10" width="80" height="80" fill="orange" stroke="red" stroke-width="4" />
    <path d="M10 10, H90, V90, H10, V10" stroke="red" stroke-width="5" fill="transparent" />
    <path d="M100 10, H180, V90, H100, V10, Z" stroke="red" stroke-width="5" fill="transparent" />
  </svg>
`
</iframe>

### 矩形

<iframe name="codemirror" font-size="14" src="{{ site.url }}/packages/apps/codemirror/lib/index.html">
</iframe>

### 圆 & 椭圆

<iframe name="codemirror" font-size="14" src="{{ site.url }}/packages/apps/codemirror/lib/index.html">
</iframe>

![default_grid]({{site.url}}/assets/images/blog/canvas_default_grid.png)

> polyline折线和polygon多边形很像，但是polygon会进行自动闭合，且启动闭合点光滑，不会像polyline一样有豁口。

> path，d属性值是一个“命令+参数”的序列。其中命令有大小写字母的区别，大写表示绝对定位(x y)；小写表示相对定位(从上一个点开始的相对位置，dx dy)

* M：移动到点位。Mx y ｜ mdx dy
* L：Line to画线。Lx y | ldx dy
* H：绘制水平线，到标记位置，因为是直线，所以只有一个参数。Hx | hdx
* V：绘制垂直线，到标记位置，因为是直线，所以只有一个参数。Vy | vdy
* Z：闭合路径命令，从当前点画一条直线到路径的起点。Z不区分大小写，常被放到path的最后。**没有闭合的路径会有豁口**。
* C：三次贝塞尔曲线。Mx y, Cx1 y1, x2 y2, x3, y3 | cx1 y1, x2 y2, x3, y3
* S：二次贝塞尔曲线。S x2 y2, x y (or s dx2 dy2, dx dy)
[如果S命令跟在一个C或S命令后面，则它的第一个控制点会被假设成前一个命令曲线的第二个控制点的中心对称点。如果S命令单独使用，前面没有C或S命令，那当前点将作为第一个控制点。](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths)
* Q：二次贝塞尔曲线。只需要一个控制点来确定起点和终点的斜率。d="M10 80 Q 95 10 180 80"
* T：二次贝塞尔曲线快速演唱命令T。会自动推断延长曲线的控制点，只需要一个终点声明即可。d="M10 80 Q 52.5 10, 95 80 T 180 80"
* A：弧型，参考上面mozilla的svg教程。

> g,组合对象的容器，添加到g元素上的变换会应用到所有自元素身上；添加到g元素的属性会被所有自元素继承。





