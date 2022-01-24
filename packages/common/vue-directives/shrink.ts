import { DirectiveBinding } from 'vue'
import { LANG } from '../consts'

const SAFE_FONT_SIZE = 8
const shrinkFontSize = (el: HTMLElement): void => {
  const _fontSize = window.getComputedStyle(el).fontSize
  let _fontSizeNum = parseInt(_fontSize)
  el.style.whiteSpace = 'nowrap'
  for (
    let i = 0, throshold = Math.ceil(parseInt(_fontSize) - SAFE_FONT_SIZE);
    i < throshold;
    i++
  ) {
    if (el.scrollWidth > el.clientWidth) {
      el.style.fontSize = `${_fontSizeNum - 1}px`
      _fontSizeNum -= 1
    } else {
      break
    }
  }
  el.scrollWidth > el.clientWidth && (el.style.whiteSpace = 'pre-wrap')
}
export default {
  name: 'shrink',
  directive: {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
      const { value, modifiers } = binding
      if (
        (value && Array.isArray(value) && value.includes(LANG)) ||
        modifiers[LANG] || (!value && !Object.keys(modifiers).length)
      ) {
        setTimeout(() => {
          shrinkFontSize(el)
        }, 0)
      }
    },
  },
}
