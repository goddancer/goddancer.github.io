<template>
  <div class="container">
    <p>1、v-shrink.lang | v-shrink="[lang]"</p>
    <div>这是一大段文字，用于对比v-shrink效果，安全字号8px。</div>
    <div v-shrink.zh-hans>这是一大段文字，用于对比v-shrink效果，安全字号8px。</div>
    <hr>
    <p>2、v-debounce.300.immediate</p>
    <button v-debounce.500.immediate="vDebounceFn">[set]v-debounce.500.immediate</button>
    <button v-debounce.300="vDebounceFn">[set]v-debounce.300</button>
    <button v-debounce="vDebounceFn" time="1000">[set]v-debounce|time="1000"</button>
    <button v-debounce.500="resetDebounce" immediate="true" v-shrink>[reset]v-debounce.500|immediate="true"</button>
    <ul>
      <li v-for="item in debounceData">{{ item }}</li>
    </ul>
    <hr>
  </div>
</template>

<script>
import { toRefs, inject } from 'vue'

export default {
  name: 'Directives',
  data() {
    return {
      debounceData: [],
    }
  },
  setup() {
    const t = inject('t')

    return {
      t,
    }
  },
  methods: {
    vDebounceFn() {
      this.debounceData.push('[v-denounce]')
    },
    resetDebounce() {
      this.debounceData = []
    }
  },
}
</script>

<style lang="less">
.container {
  padding: 0 5px;
  font-size: 18px;
  overflow: hidden;
}
</style>
