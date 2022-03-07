<template>
  <div class="container">
    <van-button type="primary" plain @click="onHi">on hi</van-button>
    <van-button type="primary" plain @click="offHi">off hi</van-button>
    <van-button type="primary" plain @click="emitHi">emit hi</van-button>
    <van-button type="primary" plain @click="onceHi">once hi</van-button>
  </div>
</template>

<script>
import { ref, inject, reactive, nextTick } from 'vue'
import { eventEmitter } from '@jico/common/eventEmitter'

export default {
  name: 'EventEmitter',
  props: {},
  components: {
  },
  data() {
    return {}
  },
  setup() {
    const t = inject('t')
    const ctx = reactive({
      name: 'jico',
      word: 'hola',
    })
    // * 这里不能使用arrow-function，因为arrow-function的this会在编译时绑定
    // * 这里需要单独定义onHiFn，使引用地址相同，负责无法正常去重
    const onHiFn = function(payload) {
      console.log('callback this: ', this);
      console.log('callback payload: ', payload);
    }
    const onHi = () => {
      console.log('bundle ctx: ', ctx)
      eventEmitter.on('hi', onHiFn, ctx)
    }
    const offHi = () => {
      eventEmitter.off('hi')
    }
    const emitHi = () => {
      eventEmitter.emit('hi', ctx)
    }
    const onceFn = function() {
      console.log('bundle ctx output once: ', this)
    }
    const onceHi = () => {
      eventEmitter.once('hi', onceFn, ctx)
    }

    return {
      t,
      onHi,
      offHi,
      emitHi,
      onceHi,
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
}
</style>
