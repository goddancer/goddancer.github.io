<template>
  <div class="container">
    <div class="virtual-scroll-wrap">
      <VScroll
        unit="px"
        :height="400"
        :itemHeight="35"
        :items="vsData"
      >
        <template #item="{ index, scrollTopItemsNum }">
          <div class="vs-item">
            {{ vsData[index + scrollTopItemsNum] }}
          </div>
        </template>
        <template #top="{ scrollTop }">
          <div class="fixed">scrollTop:{{ scrollTop }}</div>
        </template>
      </VScroll>
    </div>
  </div>
</template>

<script>
import { ref, inject, reactive, nextTick } from 'vue'
import VScroll from '@/components/virtual-scroll/VScroll.vue'

export default {
  name: 'VirtualScroll',
  props: {},
  components: {
    VScroll,
  },
  data() {
    return {}
  },
  setup() {
    const t = inject('t')
    // {length: 200}，伪数组：拥有一个 length 属性和若干索引属性的任意对象，这里的若干索引均是undefined
    const vsData = reactive(Array.from({
      length: 100,
    }, (_, index) => index))

    return {
      t,
      vsData,
    }
  },
  computed: {},
  methods: {},
  mounted() {},
}
</script>

<style lang="less">
.container {
  padding: 10px 5px 0;
  font-size: 18px;
  overflow: hidden;
  .virtual-scroll-wrap{
    .fixed{
      position: fixed;
      top: 10px;
      left: 0;
      z-index: 9;
    }
    .vs-item{
      height: 35px;
      line-height: 35px;
      border-bottom: 1px solid #ccc;
      text-align: center;
    }
  }
}
</style>
