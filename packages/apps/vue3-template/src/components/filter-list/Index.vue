<template>
  <div class="filter-list-container">
    <div 
      class="filter-list-wrap"
      @touchstart="hlTouchStart"
      @touchmove="hlTouchMove"
      @touchend="hlTouchEnd"
    >
      <div class="filter-bar clear">
        <div class="filter-items-left">名称</div>
        <div class="filter-items-right">
          <div 
            class="scrollx-wrap"
            ref="filter-bar-right"
          >
            <div 
              class="scroll-item"
              v-for="item in 6"
            >
              <div class="text">价格</div>
              <div class="sort-icon"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="filter-content">
        <div class="content-left">
          <div 
            class="left-item"
            v-for="item in 20"
          >123123123</div>
        </div>
        <div class="content-right">
          <div 
            class="scrollx-wrap"
            ref="scrollx-wrap"
          >
            <div 
              class="right-line-x"
              v-for="item in 20"
            >
              <div 
                class="right-item"
                v-for="item in 6"
              >222.00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { inject } from 'vue'
import PreventScroll from '@jico/common/scroll/preventScroll'

export default {
  name: 'FilterList',
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
      scrollLeft: 0,
      startClientX: 0,
      startClientY: 0,
      axis: null,
    }
  },
  setup() {
    const t = inject('t')

    return {
      t,
    }
  },
  computed: {
  },
  methods: {
    hlTouchStart(ev) {
      const touch = ev.touches[0] || ev.changedTouches[0]
      this.startClientX = touch.pageX
      console.log('touch.pageX: ', touch.pageX);
      this.startClientY = touch.pageY
    },
    hlTouchMove(ev) {
      const contentRightEl = this.$refs['scrollx-wrap']
      let touch = ev.touches[0] || ev.changedTouches[0]

      if (!this.axis) {
        const _diffY = touch.clientY - this.startClientY
        const _diffX = touch.clientX - this.startClientX
        if (Math.abs(_diffY) - Math.abs(_diffX) > 0) {
          this.axis = _diffY > 0 ? 'y+' : 'y-'
        } else {
          this.axis = _diffX > 0 ? 'x+' : 'x-'
        }
        /* this.axis =
          Math.abs(touch.clientY - this.startClientY) -
            Math.abs(touch.clientX - this.startClientX) >
          0
            ? 'y'
            : 'x' */
        
        console.log('this.axis: ', this.axis);
      }
      const caseRightEnd = this.axis === 'x-' && this.scrollLeft >= (contentRightEl.scrollWidth - contentRightEl.clientWidth)
      const caseLeftEnd = this.axis === 'x+' && this.scrollLeft <= 0
      if (caseRightEnd || caseLeftEnd) {
        console.log(123)
        ev.preventDefault()
      }
    },
    hlTouchEnd() {
      this.axis = null
    },
  },
  beforeUnmount() {
  },
  mounted() {
    const contentRightEl = this.$refs['scrollx-wrap']
    const filterBarRightEl = this.$refs['filter-bar-right']
    const _this = this
    const freeze = new PreventScroll(contentRightEl)
    contentRightEl.addEventListener('scroll', function(ev){
      ev.preventDefault()
      const _scrollLeft = contentRightEl.scrollLeft
      _this.scrollLeft = _scrollLeft
      // console.log('_scrollLeft: ', _scrollLeft);
      contentRightEl.scrollLeft = filterBarRightEl.scrollLeft = contentRightEl.scrollLeft
      // if (_this.axis === 'x' && _this.scrollLeft >= (contentRightEl.scrollWidth - contentRightEl.clientWidth)) {
      //   freeze.enable()
      // }
    }, false)
    // contentRightEl.addEventListener('touchend', function(ev) {
    //   setTimeout(() => {
    //     freeze.disable()
    //   }, 1000)
    // }, false)
  },
}
</script>

<style lang="less">
.filter-list-container {
  .filter-list-wrap{
    .filter-bar{
      .filter-items-left{
        width: 150px;
        height: 36px;
        line-height: 36px;
        font-size: 14px;
        color: #909090;
        font-weight: 400;
        float: left;
      }
      .filter-items-right{
        overflow: hidden;
        .scrollx-wrap{
          overflow: auto;
          display: flex;
          .scroll-item{
            min-width: 75px;
            border-right: 1px solid #ccc;
            text-align: right;
            .text{
              height: 36px;
              line-height: 36px;
              display: inline-block;
              font-size: 14px;
              color: #909090;
              font-weight: 400;
              margin-right: 2px;
            }
            .sort-icon{
              display: inline-block;
              width: 10px;
              height: 20px;
              background: url('../../assets/sort_default.png') no-repeat center top / 100% 100%;
              position: relative;
              top: 4px;
            }
          }
        }
      }
    }

    .filter-content{
      position: relative;
      height: 400px;
      overflow: auto;
      .content-left{
        position: absolute;
        top: 0;
        left: 0;
        width: 150px;
        border-right: 1px solid #ccc;
        .left-item{
          height: 50px;
          line-height: 50px;
          width: 135px;
          font-size: 15px;
          color: #333333;
          font-weight: 500;
        }
      }
      .content-right{
        padding-left: 150px;
        overflow: hidden;
        .scrollx-wrap{
          overflow-x: auto;
          .right-line-x{
            display: flex;
            border-bottom: 1px solid #ccc;
            .right-item{
              min-width: 75px;
              height: 50px;
              line-height: 50px;
              font-size: 15px;
              color: #333333;
              text-align: right;
              font-weight: 500;
              border-right: 1px solid #ccc;
              overflow: hidden;
            }
          }
        }
      }
    }
  }
}
</style>
