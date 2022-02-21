<template>
  <div class="container">
    <div class="outer-wrap">
      <div class="inner-wrap">
        <div class="content-left">
          <div v-for="item in 20">{{ item }}</div>
        </div>
        <div class="content-right">
          <div class="content">
            <div class="right-item" v-for="item in 20">
              <div class="text">{{ item }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, inject, nextTick } from 'vue'
import BScroll from 'better-scroll'

export default {
  name: 'Index',
  data() {
    return {
    }
  },
  setup() {
    const t = inject('t')

    return {
      t,
    }
  },
  methods: {
    sumInfinity(...nums) {
      let total = nums.reduce((a, c) => a + c, 0)
      this.valueOf = () => total
      return sumInfinity
    },
  },
  mounted() {
    const bs1 = new BScroll('.outer-wrap', {
      scrollY: true,
      probeType: 3,
    })
    bs1.on('scrollStart', (position) => {
      console.log(1)
    })
    const bs2 = new BScroll('.content-right', {
      scrollX: true,
    })
    bs2.on('scrollStart', (position) => {
      console.log(2)
    })
  },
}
</script>

<style lang="less">
.container {
  padding: 10px 5px 0;
  font-size: 18px;
  overflow: hidden;
  .outer-wrap{
    overflow: hidden;
    width: 100%;
    height: 400px;
    border: 1px solid red;
    position: relative;
    .inner-wrap{
      // width: 600px;
      height: auto;
      .content-left{
        width: 150px;
        border: 1px solid blue;
        position: absolute;
        top: 0;
        left: 0;
        background: #ccc;
        z-index: 9;
      }
      .content-right{
        width: 100%;
        border: 1px solid orange;
        overflow: hidden;
        .content{
          width: 600px;
          .right-item{
            border-bottom: 1px solid #ccc;
            .text{
              margin-left: 160px;
            }
          }
        }
      }
    }
  }
}
</style>
