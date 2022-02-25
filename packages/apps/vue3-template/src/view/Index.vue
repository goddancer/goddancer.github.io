<template>
  <div class="container">
    <div class="clear">
      <div 
        class="entry" 
        v-for="(item, index) in validPath"
        :key="index"
        @click="to(item.path)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
import { toRefs, inject, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { routes } from '@/router'

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
    const validPath = reactive(routes.filter(it => it.path !== '/'))

    return {
      t,
      to,
      validPath,
    }
  },
  methods: {
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
