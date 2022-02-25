<template>
  <div class="vs-container">
    <Filter></Filter>
  </div>
</template>

<script>
import { inject } from 'vue'
import Filter from '@/components/filter-list/Index.vue'

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
  components: {
    Filter,
  },
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
  computed: {
  },
  methods: {
  },
  beforeUnmount() {
  },
  mounted() {
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
