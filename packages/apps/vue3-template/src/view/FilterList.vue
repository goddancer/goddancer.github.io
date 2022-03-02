<template>
  <div class="vs-container">
    <van-cell center :title="`bounceHack: ${enableBounceHack}`">
      <template #right-icon>
        <van-switch v-model="enableBounceHack" size="24" />
      </template>
    </van-cell>
    <Filter 
      ref="filterX"
      :filter-bar="filterBar"
      :filter-data="filterData"
      :load-more="loadMore"
      :load-more-finished="loadMoreFinished"
      :hack-bounce="enableBounceHack"
    >
      <!-- <template #content-left="{ item }">
        <div>item:{{ item }}</div>
      </template>
      <template #content-right="{ item }">
        <div>it:{{ item }}</div>
      </template> -->
    </Filter>
  </div>
</template>

<script>
import { inject } from 'vue'
import Filter from '@/components/filter-list/Index.vue'

export default {
  name: 'FilterList',
  props: {},
  components: {
    Filter,
  },
  data() {
    return {
      filterBar: Array.from({length: 6}, _ => ({
        text: '价格',
        filter: true,
      })),
      filterData: Array.from({length: 15}, _ => ({
        name: '腾讯控股',
        code: '00700',
        price1: '20.000',
        price2: '21.000',
        price3: '22.000',
        price4: '23.000',
        price5: '24.000',
        price6: '25.000',
      })),
      loadMoreFinished: false,
      enableBounceHack: false,
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
    loadMore() {
      setTimeout(() => {
        this.filterData = this.filterData.concat(Array.from({length: 15}, _ => ({
          name: '腾讯控股',
          code: '00700',
          price1: '20.000',
          price2: '21.000',
          price3: '22.000',
          price4: '23.000',
          price5: '24.000',
          price6: '25.000',
        })))
        this.$refs['filterX'].updateLoadMoreStatus(false)
        // this.loadMoreFinished = true
      }, 3000)
    },
  },
  beforeUnmount() {
  },
  mounted() {
  },
}
</script>

<style lang="less">
.vs-container {
  // padding: 10px 5px 0;
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
