<template>
  <div class="vs-container">
    <div 
      class="vs-out-wrap"
      :style="{height: `${height}${unit}`}"
      ref="vs-wrap"
    >
      <div 
        class="vs-inner-wrap"
        :style="{height: `${items.length * itemHeight}${unit}`}"
      >
        <slot name="top" :="{ scrollTop }"></slot>
        <div  
          class="vs-item-wrap"
          v-for="(item, index) in viewItemNum"
          :style="{top: computeItemTop(index)}"
        >
          <slot name="item" :="{ scrollTop, index, scrollTopItemsNum }"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { inject } from 'vue'

export default {
  name: 'VScroll',
  props: {
    unit: {
      type: String,
      default: 'px',
    },
    height: {
      type: Number,
      default: 300,
    },
    itemHeight: {
      type: Number,
      default: 35,
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      scrollTop: 0,
      scrollTopItemsNum: 0,
    }
  },
  setup() {
    const t = inject('t')

    return {
      t,
    }
  },
  computed: {
    viewItemNum() {
      return Math.ceil(this.height / this.itemHeight)
    },
  },
  methods: {
    computeItemTop(index) {
      if (this.scrollTop >= 0) {
        return `${(index + this.scrollTopItemsNum) * this.itemHeight}${this.unit}`
      }
      return `${(index) * this.itemHeight}${this.unit}`
    },
    handleScroll(scrollEl) {
      const _scrollTop = Math.min(Math.abs(scrollEl.scrollTop), this.items.length * this.itemHeight - this.height)
      // 原生scroll会在边界出现负数，负数会导致定位元素的抖动
      // 不要采用直接赋值scrollTop的方式，首先IOS原生滑动同步位移存在延迟，会导致元素脱离预定位置；其次体验不够丝滑，应该尽可能的让应用原生的滑动计算元素位置
      this.scrollTop = scrollEl.scrollTop
      // 当滑动超过单个元素高度时，给虚拟列表统一重新计算高度，使得在单位元素高度范围内的滑动仍然是原生般丝滑
      // * 随着滚动距离超过 itemHeight 定义值，baseTopIndex 被重新计算，导致对应区域visual DOM重新渲染，进而导致页面重绘重排，元素定位值重新计算=》最终导致了在页面上顶部向下拉动，最多拉动 itemHeight 的距离即会重置(频繁操作更会发生闪烁)，从而无法向下继续拉动
      if (this.scrollTop >= 0) {
        this.scrollTopItemsNum = Math.floor(_scrollTop / this.itemHeight)
      } else {
        this.scrollTopItemsNum = 0
      }
    },
    toggleRootFixed(setFixed = true) {
      if (setFixed) {
        document.documentElement.style.overflow = 'hidden'
      } else {
        document.documentElement.style.overflow = 'auto'
      }
    },
    toggleInit(isInit = true) {
      const scrollEl = this.$refs['vs-wrap']
      if (isInit) {
        scrollEl.addEventListener('scroll', () => this.handleScroll(scrollEl), false)
        scrollEl.addEventListener('touchstart', () => this.toggleRootFixed(isInit), false)
        scrollEl.addEventListener('touchend', () => this.toggleRootFixed(!isInit), false)
      } else {
        scrollEl.removeEventListener('scroll', () => this.handleScroll(scrollEl), false)
        scrollEl.removeEventListener('touchstart', () => this.toggleRootFixed(isInit), false)
        scrollEl.removeEventListener('touchend', () => this.toggleRootFixed(!isInit), false)
      }
    },
  },
  beforeUnmount() {
    this.toggleInit(false)
  },
  mounted() {
    this.toggleInit(true)
  },
}
</script>

<style lang="less">
.vs-container {
  padding: 10px 5px 0;
  font-size: 18px;
  overflow: hidden;
  .vs-out-wrap{
    width: 100%;
    height: 400px;
    border: 1px solid orange;
    overflow: auto;
    .vs-inner-wrap{
      height: 1000px;
      position: relative;
      background-color: cornflowerblue;
      .vs-item-wrap{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
      }
    }
  }
}
</style>
