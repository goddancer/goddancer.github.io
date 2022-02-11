---
layout: post
title: svg
categories: [svg]
description: svg
keywords: svg
---

> svg文件全局有效的规则是“后来居上”，越后面的元素越可见。

可以理解为，svg就是一块声明区域的画布上，一系列元素的堆叠，都是基于绝对坐标的位置排列，则后面的元素或覆盖在前面的元素上。

> SVG和Canvas的坐标系统以左上角为坐标起点，x轴正向向右，y轴正向向下。

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





