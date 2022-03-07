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
    const onHi = () => {
      console.log('bundle ctx: ', ctx)
      eventEmitter.on('hi', function(payload) {
        console.log('callback this: ', this);
        console.log('callback payload: ', payload);
      }, ctx)
    }
    const offHi = () => {
      eventEmitter.off('hi')
    }
    const emitHi = () => {
      eventEmitter.emit('hi', ctx)
    }
    const onceHi = () => {
      eventEmitter.once('hi', function() {
        console.log('bundle ctx output once: ', this)
      }, ctx)
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
