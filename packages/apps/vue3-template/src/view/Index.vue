<template>
  <div class="container">
    <div class="clear">
      <div class="entry" @click="to('directives')">v-directives</div>
      <div class="entry" @click="to('freeze-scroll')">FreezeScroll</div>
    </div>
  </div>
</template>

<script>
import { toRefs, inject } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Index',
  data() {
    return {
    }
  },
  setup() {
    const t = inject('t')
    const router = useRouter()
    const to = (path) => {
      router.push(path)
    } 

    return {
      t,
      to,
    }
  },
  methods: {
    routerGo(path) {
    },
  },
}
</script>

<style lang="less">
.container{
  padding: 0 5px;
  font-size: 18px;
  overflow: hidden;
  .entry{
    padding: 2px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-right: 5px;
    margin-bottom: 5px;
    float: left;
    &:nth-last-child(1) {
      margin-right: 0;
    }
  }
}
</style>
