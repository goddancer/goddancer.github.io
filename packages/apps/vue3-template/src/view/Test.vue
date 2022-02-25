<template>
  <div class="container">
    test
  </div>
</template>

<script>
import { ref, inject, nextTick } from 'vue'

export default {
  name: 'Test',
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
    deepClone() {
      const a = {
        a1: {
          b1: 1,
          b2: {
            c1: 2,
            c2: {
              d1: null,
            },
          },
        },
        a2: 3,
      }
    },
  },
  mounted() {
    this.deepClone()
  },
}
</script>

<style lang="less">
.container {
  padding: 10px 5px 0;
  font-size: 18px;
  overflow: hidden;
}
</style>
