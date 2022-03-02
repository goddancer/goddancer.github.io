<template>
  <div class="filter-list-container">
    <div class="mask" ref="filterMaskEl"></div>
    <div 
      class="filter-list-wrap"
      ref="filterList"
    >
      <div class="filter-bar clear">
        <div class="filter-items-left">名称</div>
        <div class="filter-items-right">
          <div 
            class="scrollx-wrap"
            ref="filterBarEl"
          >
            <div 
              class="scroll-item"
              v-for="item in filterBar"
            >
              <div class="text">{{ item.text }}</div>
              <div class="sort-icon"></div>
            </div>
          </div>
        </div>
      </div>

      <van-pull-refresh 
        v-model="pullLoading" 
        @refresh="onRefresh" 
        :disabled="data.pullRefreshDisabled"
      >
        <div class="filter-content" ref="filterContent">
          <div class="content-left">
            <van-list
              v-model:loading="data.loadMoreLoading"
              :finished="loadMoreFinished"
              @load="loadMore"
            >
              <div 
                class="left-item"
                v-for="item in filterData"
              >
                <slot name="content-left" :="{ item }">
                  <div class="title">腾讯控股</div>
                  <div class="code">00700</div>
                  <div class="icon"></div>
                </slot>
              </div>
            </van-list>
          </div>
          <div class="content-right">
            <div 
              class="scrollx-wrap"
              ref="scrollXContentEl"
            >
              <div 
                class="right-line-x"
                v-for="section in filterData"
                :style="{width: `${data.scrollXWidth}px`}"
              >
                <div 
                  class="right-item"
                  v-for="(item, index) in filterBar.length"
                >
                  <slot name="content-right" :="{ section }">
                    <div class="price-top">{{ section[`price${index + 1}`] }}</div>
                    <div class="price-bottom">{{ section[`price${index + 1}`] }}</div>
                  </slot>
                </div>
                <div class="fake-border-bottom"></div>
              </div>
            </div>
          </div>
          <div class="fake-right">
            <div 
              class="fake-boder-bottom"
              v-for="item in filterData"
            ></div>
          </div>
        </div>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { inject, ref, getCurrentInstance, onMounted, reactive, unref } from 'vue'
import { useTouchSteps } from '@/hooks/common/use-touch-steps'

let maskTimer = null
export default {
  name: 'FilterList',
  props: {
    filterBar: {
      type: Array,
      default: () => [],
    },
    filterData: {
      type: Array,
      default: () => [],
    },
    loadMore: {
      type: Function,
      default: () => {},
    },
    loadMoreFinished: {
      type: Boolean,
      default: false,
    },
    loadOffset: {
      type: Number,
      default: 300,
    },
    hackBounce: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      scrollLeft: 0,
      pullLoading: false,
      aixsXFlag: false,
      // ! 通过这种方式检测手势，仅使临界点行为触发mask，实测并不理想，因为在边界快速抖动的时候，获取不到scrollLeft值
    }
  },
  setup() {
    const t = inject('t')
    const filterList = ref(null)
    const filterContent = ref(null)
    const scrollXContentEl = ref(null)
    const filterBarEl = ref(null)
    const filterMaskEl = ref(null)
    const data = reactive({
      scrollXWidth: 300,
      pullRefreshDisabled: true,
      loadMoreLoading: false,
    })
    const { proxy } = getCurrentInstance()

    const updateLoadMoreStatus = status => {
      data.loadMoreLoading = status
    }
    onMounted(() => {
      setTimeout(() => {
        data.scrollXWidth = unref(scrollXContentEl).scrollWidth
      }, 1000)
      unref(filterContent).addEventListener('scroll', function() {
        data.pullRefreshDisabled = unref(filterContent).scrollTop > 0
      }, false)

      // 禁止filterBar引发的scroll行为
      unref(filterBarEl).addEventListener('touchmove', function(ev) {
        ev.preventDefault()
      }, {
        passive: false,
      })

      unref(scrollXContentEl).addEventListener('scroll', function() {
        proxy.scrollLeft = unref(scrollXContentEl).scrollLeft
        // filter-bar与content互相约束scrollLeft，达到最大效果的同步
        scrollXContentEl.value.scrollLeft = filterBarEl.value.scrollLeft = unref(scrollXContentEl).scrollLeft
      }, false)

      useTouchSteps(unref(filterList), {
        handleTouchStart() {
          proxy.toogleRootScroll(true)
        },
        handleTouchMove(ev, { axis }) {
          const caseRightEnd = unref(axis) === 'x-' && proxy.scrollLeft >= (unref(scrollXContentEl).scrollWidth - unref(scrollXContentEl).clientWidth)
          const caseLeftEnd = unref(axis) === 'x+' && proxy.scrollLeft <= 0
          if (['x+', 'x-'].includes(unref(axis))) {
            proxy.aixsXFlag = true
          } else {
            proxy.aixsXFlag = false
          }
          if (caseRightEnd || caseLeftEnd) {
            ev.preventDefault()
          }
        },
        handleTouchEnd() {
          if (proxy.hackBounce && proxy.aixsXFlag) {
            proxy.doHackBounce(unref(filterMaskEl))
          }
        },
      })
    })

    return {
      t,
      filterList,
      filterContent,
      scrollXContentEl,
      filterBarEl,
      filterMaskEl,
      data,
      updateLoadMoreStatus,
    }
  },
  computed: {
  },
  methods: {
    toogleRootScroll(freeze) {
      document.documentElement.style.overflow = freeze ? 'hidden' : 'auto'
    },
    doHackBounce(maskEl) {
      maskEl.style.display = 'block'
      clearTimeout(maskTimer)
      maskTimer = setTimeout(() => {
        this.toogleRootScroll(false)
        maskEl.style.display = 'none'
      }, 300)
    },
    onRefresh() {
      this.filterMaskEl.style.display = 'block'
      setTimeout(() => {
        this.filterMaskEl.style.display = 'none'
        this.pullLoading = false
      }, 3000)
    },
  },
  beforeUnmount() {
  },
  mounted() {},
}
</script>

<style lang="less">
.filter-list-container {
  user-select: none;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none;
  .van-list__loading{
    width: 100vw;
  }
  .mask{
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.1);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    display: none;
  }
  .filter-list-wrap{
    .filter-bar{
      border-bottom: 1px solid rgba(0,0,0,0.10);
      padding-left: 15px;
      .filter-items-left{
        width: 135px;
        height: 36px;
        line-height: 36px;
        font-size: 14px;
        color: #909090;
        font-weight: 400;
        float: left;
      }
      .filter-items-right{
        overflow: hidden;
        width: calc(100vw - 150px - 15px);
        .scrollx-wrap{
          overflow: auto;
          display: flex;
          &::-webkit-scrollbar {
            display: none;
          }
          .scroll-item{
            min-width: 75px;
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
      &::-webkit-scrollbar {
        display: none;
      }
      .content-left{
        position: absolute;
        top: 0;
        left: 0;
        width: 150px;
        .left-item{
          height: 50px;
          line-height: 50px;
          width: 135px;
          font-size: 15px;
          color: #333333;
          font-weight: 500;
          position: relative;
          margin-left: 15px;
          border-bottom: 1px solid rgba(0,0,0,0.10);
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          .title{
            width: 100%;
            height: 21px;
            line-height: 21px;
          }
          .code{
            height: 14px;
            line-height: 14px;
            font-size: 12px;
            color: #6D6D6D;
            font-weight: 400;
            margin-top: 4px;
          }
          .icon{
            width: 12px;
            height: 10px;
            background: url('../../assets/market_hk.png') no-repeat center top / 100% 100%;
            position: absolute;
            left: -14px;
            top: 4px;
          }
        }
      }
      .content-right{
        padding-left: 150px;
        overflow: hidden;
        width: calc(100vw - 150px - 15px);
        .scrollx-wrap{
          overflow-x: auto;
          &::-webkit-scrollbar {
            display: none;
          }
          .right-line-x{
            display: flex;
            border-bottom: 1px solid rgba(0,0,0,0.10);
            .right-item{
              flex: 1;
              min-width: 75px;
              height: 50px;
              line-height: 50px;
              font-size: 15px;
              color: #333333;
              text-align: right;
              font-weight: 500;
              overflow: hidden;
              .price-top{
                height: 21px;
                line-height: 21px;
                font-size: 15px;
                color: #333333;
                text-align: right;
                font-weight: 500;
              }
              .price-bottom{
                height: 14px;
                line-height: 14px;
                font-size: 12px;
                color: #333333;
                text-align: right;
                font-weight: 500;
                margin-top: 4px;
              }
            }
          }
        }
      }
      .fake-right{
        width: 15px;
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
        .fake-boder-bottom{
          height: 50px;
          line-height: 50px;
          min-height: 50px;
          max-height: 50px;
          border-bottom: 1px solid rgba(0,0,0,0.10);
        }
      }
    }
  }
}
</style>
