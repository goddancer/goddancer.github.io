<template>
  <router-view v-slot="{ Component }">
    <transition :name="transitionName">
      <component :is="Component" />
    </transition>
  </router-view>
  <van-loading v-show="isLoading" />
  <div class="no-contents" v-if="!isLoading && empty">
    <div class="tick">{{ t('common.noContents') }}</div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { provide, onMounted, toRefs, getCurrentInstance } from 'vue'
import { LANG } from '@jico/common/consts'
import { useLoading } from '@/hooks/common/use-loading'

export default {
  name: 'App',
  components: {},
  props: {},
  data() {
    return {
      transitionName: 'slide-left',
    }
  },
  setup() {
    const { t } = useI18n()
    const [isLoading] = useLoading()
    const { proxy } = getCurrentInstance()
    onMounted(() => {
      document.documentElement.setAttribute('data-lang', LANG)
    })

    provide('t', t)

    return {
      t,
      empty: false,
      isLoading,
    }
  },
  watch: {
    $route(to, from) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      this.transitionName = toDepth > fromDepth ? 'slide-left' : 'slide-right'
    },
  },
  computed: {},
}
</script>

<style lang="less">
#app {
  width: 375px;
  height: 100vh;
  margin: 0 auto;
}
.no-contents {
  width: 130px;
  height: 100px;
  position: absolute;
  top: -130px;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  background: url('./assets/no_contents.png') no-repeat center top / 100% 100%;
  .tick {
    line-height: 20px;
    font-size: 14px;
    color: var(--color-text60);
    text-align: center;
    font-weight: 400;
    margin-top: 110px;
  }
}
</style>
