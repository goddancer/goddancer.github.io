import text from './test.text'
import './styles'
import '@jico/common/vw-rem'
import * as d3 from 'd3'
import '@/styles'

// /* window.onload = function () {
//   document.body.innerHTML += text
// } */
// // d3.arc()
// // const pie = d3.pie().sort(d => d.index)
// // pie([182844520, 497672420, 170121740, 199862320, 536627200, 94160500])
// // console.log('pie: ', pie);
// // d3.select('body').remove()
// const svg = d3.select('#app')
//   .append('svg')
//   .attr('width', '100%')
//   .attr('height', '100%')

// var marge = {top:60,bottom:60,left:60,right:60}
// var dataset = [ 2.5 , 2.1 , 1.7 , 1.3 , 0.9 ];  

// var scaleLinear = d3.scaleLinear()
//   .domain([0,d3.max(dataset)])
//   .range([0,250]);
  
// var g = svg.append("g")
//   .attr("transform","translate("+marge.top+","+marge.left+")");

// var rectHeight = 30;

// g.selectAll("rect")
//   .data(dataset)
//   .enter()
//   .append("rect")
//   .attr("x",20)
//   .attr("y",function(d,i){
//     return i*rectHeight;
//   })
//   .attr("width",function(d){
//     return scaleLinear(d);
//   })
//   .attr("height",rectHeight-5)
//   .attr("fill","blue");
  
// //为坐标轴定义一个线性比例尺
// var xScale = d3.scaleLinear()
//   .domain([0,d3.max(dataset)])
//   .range([0,250]);
// //定义一个坐标轴
// var xAxis = d3.axisBottom(xScale)//定义一个axis，由bottom可知，是朝下的
//   .ticks(7);//设置刻度数目
// g.append("g")
//   .attr("transform","translate("+20+","+(dataset.length*rectHeight)+")")
//   .call(xAxis);
// /* const dataset = [36, 250, 211, 172, 133, 94, 85, 76]
// const color = ["red", "blue", "black", "green", 'orange']
// const index = color.map((_, i) => i)
// const scaleLinear = d3.scaleOrdinal()
//   .domain(index)
//   .range(color)
//   console.log('scaleLinear: ', scaleLinear(100));

// svg
//   .append('g')
//   .attr('transform', 'translate(10, 10)')
//   .selectAll('rect')
//   .data(dataset)
//   .enter()
//   .append('rect')
//   .attr('x', 10)
//   .attr('y', (d, i) => i * 10)
//   .attr('width', d => d)
//   .attr('height', 5)
//   .attr('fill', d => scaleLinear(d % color.length)) */
// /* const dataSet = [12, 33, 11, 34, 78, 54, 23, 42, 9, 44]
// const xIndex = dataSet.map((_, i) => i * 30)
// const xScale = d3.scaleLinear()
//   .domain([0, d3.max(dataSet)])
//   .range([0, 300])
// const xScaleIndex = d3.scaleOrdinal()
//   .domain(dataSet)
//   .range(xIndex)
// const yScale = d3.scaleLinear()
//   .domain([0, d3.max(dataSet)])
//   .range([0, 100])
// const xAxis = d3.axisBottom(xScale)
//   .ticks(10)
// const g = svg.append('g')
//   .attr('transform', `translate(10, 210)`)
//   .call(xAxis) */
// /* g.append('g')
//   .attr('transform', 'translate(10, 0)')
//   .selectAll('line')
//   .data(dataSet)
//   .enter()
//   .append('line')
//   .attr('stroke', 'blue')
//   .attr('stroke-width', '5')
//   .attr('x1', d => {
//     console.log('xScale(d): ', xScaleIndex(d));
//     return xScaleIndex(d)
//   })
//   .attr('y1', 200)
//   .attr('x2', d => xScaleIndex(d))
//   .attr('y2', d => yScale(d + 5)) */
function createSvg({ width = '100%', height = '100%', bg = 'transparent' } = {}) {
  const svg = d3.select('#app')
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
  const svg = createSvg({
    width: _config.width,
    height: _config.height,
  })
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
  const colorScale = d3.scaleOrdinal()
    .domain(d3.range(dataSet.length))
    .range(color) // 生成离散色彩
  const svg = createSvg(_config)
  
  const arc = d3.arc() // 弧形生成器
    .innerRadius(60 - 14) // 设置内半径
    .outerRadius(60) // 设置外半径
    .cornerRadius(0) // 设置拐角半径
    .startAngle(d => Math.PI * 2 - d.startAngle)
    .endAngle(d => Math.PI * 2 - d.endAngle)
    .padAngle(0.01)
  
  const pie = d3.pie()
    .sort(d => d.index)
  console.log('pie: ', pie(dataSet));

  svg.append('g')
    .attr('transform', `translate(${_config.margin.left}, ${_config.margin.top})`).append('g')
    .append('path')
    .attr('fill', '#3F4247')
    .attr('d', arc(pie([1])[0]))
  const g = svg.append('g')
    .attr('transform', `translate(${_config.margin.left}, ${_config.margin.top})`)
  const gs = g.selectAll('path')
    .data(pie(dataSet))
    .enter()
    .append('path')
    .attr('d', d => arc(d))
    .attr('fill', (d, i) => colorScale(i))
}
// chart1()
// chart2()
chart3()