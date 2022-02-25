<template>
  <div class="container">
    <button @click="togglePrevent">toggle prevent: {{ freezeStatus }}</button>
    <button @click="toggleFreeze">toggle freeze: {{ freezeStatus }}</button>
    <div class="outer-wrap" ref="scrollWrap">
      <div class="inner-wrap">
        <p v-for="item in 20">{{ item }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, inject, nextTick } from 'vue'
import { preventBodyScroll } from '@jico/common/scroll/preventScroll'
import FreezeScroll from '@jico/common/scroll/freezeScroll'

export default {
  name: 'FreezeScroll',
  data() {
    return {
    }
  },
  setup() {
    const t = inject('t')
    const preventStatus = ref(preventBodyScroll.preventStatus)
    const togglePrevent = () => {
      preventBodyScroll.preventStatus ? preventBodyScroll.disable() : preventBodyScroll.enable()
      freezeStatus.value = preventBodyScroll.preventStatus
    }

    const scrollWrap = ref(null)
    const freezeScroll = ref({})
    const freezeStatus = ref(false)
    nextTick(() => {
      freezeScroll.value = new FreezeScroll(scrollWrap.value)
      freezeStatus.value = freezeScroll.value.freezeStatus
    })
    
    const toggleFreeze = () => {
      freezeScroll.value.freezeStatus ? freezeScroll.value.disable() : freezeScroll.value.enable()
    }

    return {
      t,
      preventStatus,
      freezeStatus,
      scrollWrap,
      togglePrevent,
      toggleFreeze,
    }
  },
  methods: {
  },
}
</script>

<style lang="less">
.container {
  padding: 0 5px;
  font-size: 18px;
  overflow: hidden;
  .outer-wrap{
    width: 100%;
    height: 400px;
    background: #ccc;
    overflow: auto;
    .inner-wrap{
      width: 100%;
    }
    .inner-wrap p{
      border: 1px solid orange;
    }
  }
}
</style>
