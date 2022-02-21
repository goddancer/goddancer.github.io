---
layout: post
title: d3 basic charts
categories: [D3]
description: d3 basic charts
keywords: d3, charts
---

## basic charts

<iframe name="codemirror" font-size="14" src="{{ site.url }}/packages/apps/d3/lib/index.html"></iframe>

## try examples

### x轴柱状图

<iframe name="codemirror" font-size="14" src="{{ site.url }}/packages/apps/codemirror/lib/index.html">
function createSvg({ width = '100%', height = '100%', bg = 'transparent' } = {}) {
  d3.selectAll('div.section')
    .remove()
  const svg = d3.select('#console')
    .append('div')
    .attr('class', 'section')
    .style('background', bg)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
  return svg
}
// 水平x轴柱状图
function chart1() {
  const svg = createSvg()
  // 水平柱的长度
  const dataSet = [10, 30, 70, 20, 50, 60]
  const xScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, 300])
  const g = svg.append('g')
    .attr('transform', 'translate(10, 10)')  
  g.selectAll('rect')
    .data(dataSet)
    .enter()
    .append('rect')
    .attr('x', 0) // 矩形左上角x坐标
    .attr('y', (d, i) => i * 20) // 矩形左上角y坐标
    .attr('width', 0)
    .attr('height', 10)
    .attr('fill', 'blue')
    .transition()
    .duration(500)
    .delay((d, i) => i * 100)
    .attr('width', d => xScale(d))
  const xAxis = d3.axisBottom(xScale)
    .ticks(10)
  g.append('g')
    .attr('transform', `translate(0, ${20 * dataSet.length})`)
    .call(xAxis)
}
chart1()
</iframe>

### y轴柱状图

<iframe name="codemirror" font-size="14" src="{{ site.url }}/packages/apps/codemirror/lib/index.html">
function createSvg({ width = '100%', height = '100%', bg = 'transparent' } = {}) {
  d3.selectAll('div.section')
    .remove()
  const svg = d3.select('#console')
    .append('div')
    .attr('class', 'section')
    .style('background', bg)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
  return svg
}
function chart2() {
  const _config = {
    width: 400,
    height: 400,
    margin: {
      top: 10,
      right: 0,
      bottom: 20,
      left: 20,
    },
    gap: {
      xAxis: 20, // x轴刻度间距
      yAxis: 10, // y轴顶部的安全空间
      text: 5, // 文字距离柱状图间距
    },
    yAxisTop: 10,
  }
  const svg = createSvg(_config)
  // 创建根组，统一计算偏移
  const g1 = svg.append('g')
    .attr('transform', `translate(${_config.margin.left}, ${_config.margin.top})`)
  const dataSet = [10, 20, 30, 23, 13, 40, 27, 35, 20]
  // 创建坐标轴数据
  const xScale = d3.scaleBand()
    .domain(d3.range(dataSet.length))
    .rangeRound([0, _config.height - _config.margin.left - _config.margin.right]) // rangeRound的有效值取整，使数据更平滑
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataSet) + _config.yAxisTop]) // 顶部保留一定区域
    .range([_config.height - _config.margin.top - _config.margin.bottom, 0]) // 因为是y轴柱状图，使用反比例尺计算y坐标
  const xAxis = d3.axisBottom(xScale)
  const yAxis = d3.axisLeft(yScale)

  // 坐标轴分组
  g1.append('g')
    .attr('transform', `translate(0, ${_config.height - _config.margin.bottom - _config.margin.top})`)
    .call(xAxis)
  g1.append('g')
    .call(yAxis)
  
  // 柱状图分组
  const g2 = g1.append('g')
    .attr('transform', `translate(${_config.gap.xAxis / 2})`) // 整体计算偏移
  g2.selectAll('rect')
    .data(dataSet)
    .enter()
    .append('rect')
    .attr('x', (d, i) => xScale(i))
    // .attr('y', 0) // y轴坐标初始最小值开始动画
    .attr('y', yScale(yScale.domain()[0])) // yScale.domain()是一个范围数组，取左值(最小值)，在yScale反比例尺对应最大值，即y轴坐标视觉最小值开始动画
    .attr('width', xScale.step() - _config.gap.xAxis) // step会均分坐标轴空间，step - gap才是柱宽
    .attr('fill', 'blue')
    .attr('height', 0) // 高度从0开始动画
    .transition()
    .duration(600)
    .delay((d, i) => i * 100)
    .attr('y', d => yScale(d))
    .attr('height', d => _config.height - _config.margin.top - _config.margin.bottom - yScale(d))
  g2.selectAll('text')
    .data(dataSet)
    .enter()
    .append('text')
    .attr('x', (d, i) => xScale(i))
    .attr('y', d => yScale(d) - _config.gap.text)
    .attr('font-size', '0')
    .attr('opacity', 0)
    .transition()
    .duration(1000)
    .delay((d, i) => i * 100)
    .attr('font-size', '20')
    .attr('opacity', 1)
    .text(d => d)
  g2.on('click', e => {
    console.log('d3.select(this): ', d3.select(e.target).attr('fill', 'red'));
  })
}
chart2()
</iframe>

### 比例弧型饼图

<iframe name="codemirror" font-size="14" src="{{ site.url }}/packages/apps/codemirror/lib/index.html">
function createSvg({ width = '100%', height = '100%', bg = 'transparent' } = {}) {
  d3.selectAll('div.section')
    .remove()
  const svg = d3.select('#console')
    .append('div')
    .attr('class', 'section')
    .style('background', bg)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
  return svg
}
function chart3() {
  const _config = {
    width: 400,
    height: 400,
    margin: {
      top: 100,
      right: 0,
      bottom: 20,
      left: 100,
    },
    gap: {
      xAxis: 20, // x轴刻度间距
      yAxis: 10, // y轴顶部的安全空间
      text: 5, // 文字距离柱状图间距
    },
    yAxisTop: 10,
    bg: 'rgba(25,29,34)',
  }
  const dataSet = [241293920, 995563500, 694776580, 637173340, 1157584880, 303447920]
  const color = ["#BA2828", "#F75050", "#FF9898", "#55DAAA", "#09986D", "#006646"]
  const svg = createSvg(_config)
  // 非线性颜色比例尺
  const colorScale = d3.scaleOrdinal()
    .domain(d3.range(dataSet.length))
    .range(color)
  // 弧型生成器
  const arc = d3.arc()
    .innerRadius(60 - 14) // 弧型内圈半径
    .outerRadius(60) // 弧型外圈半径
    .cornerRadius(0) // 弧型拐角半径
    .startAngle(d => Math.PI * 2 - d.startAngle) // 弧型起始弧度。这里结合饼图生成的弧度坐标信息使用
    .endAngle(d => Math.PI * 2 - d.endAngle) // 弧型结束弧度。这里结合饼图生成的弧度坐标信息使用
    .padAngle(Math.PI / 180) // 间隙对应弧度
  // 饼图生成器
  const pie = d3.pie()
    .sort(d => d.index) // 饼图对传入数据做默认排序，这里是使用传入数据的顺序
  // 做整体位置偏移计算
  const g1 = svg.append('g')
    .attr('transform', `translate(${_config.margin.left}, ${_config.margin.top})`)
  // 创建灰色底图
  const g2 = g1.append('g')
    .append('path')
    .attr('fill', '#3F4247')
    .attr('d', arc(pie([1])[0])) // pie([1])只有一个数据时为360度，全比例。pie([1])[0]返回饼图对应角度信息。arc计算弧度
  // 渲染数据图
  const g3 = g1.append('g')
    .selectAll('path')
    .data(pie(dataSet)) // pie(dataSet)根据数据生成饼图信息
    .enter()
    .append('path')
    .attr('d', d => arc(d)) // 根据饼图信息计算弧度信息
    .attr('fill', (d, i) => colorScale(i)) // 元素index映射非线性比例尺
  g1.append('text')
    .text('+10000')
    .attr('fill', '#F75050')
    .attr('text-anchor', 'middle') // 文本锚点定位
    .attr('font-size', '15px')
    .attr('y', 5)
  g1.append('text')
    .text('净流入')
    .attr('fill', d3.rgb(255, 255, 255, 0.5))
    .attr('text-anchor', 'middle')
    .attr('font-size', '10px')
    .attr('y', 20)
  
}
chart3()
</iframe>