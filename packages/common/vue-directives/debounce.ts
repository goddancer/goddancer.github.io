import { DirectiveBinding, VNode } from 'vue'
import { debounce } from '../utils/debounce'

interface _HTMLElement extends HTMLElement {
  __bindKey__: any
}
export default {
  name: 'debounce',
  directive: {
    beforeMount(el: _HTMLElement, binding: DirectiveBinding, vNode: VNode) {
      const { value, modifiers } = binding
      const { time, immediate } = vNode.props || {}
      if (
        !value ||
        Object.prototype.toString.call(value) !== '[object Function]'
      ) {
        throw new Error('[v-debounce] value is wrong, should be function instead!')
      }
      let debounceTime =
        time ??
        Object.keys(modifiers).reduce((a, c) => {
          if (/^\d+$/.test(c) && +c > a) {
            a = +c
          }
          return a
        }, 0)
      const immediateRun =
        immediate ?? Object.keys(modifiers).includes('immediate')
      const debounceFn = debounce(value, +debounceTime, !!immediateRun)
      el.__bindKey__ = debounceFn
      el.addEventListener('click', debounceFn)
    },
    beforeUnmount(el: _HTMLElement) {
      if (el.__bindKey__) {
        el.removeEventListener('click', el.__bindKey__)
        delete el.__bindKey__
      }
    },
  },
}
