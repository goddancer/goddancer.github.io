export function getElement(expr) {
  return typeof expr === 'string' ? document.querySelector(expr) : expr
}

export function getComputedStyle(el, key) {
  var computedStyle = window.getComputedStyle(el)
  return computedStyle[key] || ''
}

// Easing Equations (c) 2003 Robert Penner, all rights reserved.
// Open source under the BSD License.
export function easeOutCubic(pos) {
  return Math.pow(pos - 1, 3) + 1
}

export function easeInOutCubic(pos) {
  if ((pos /= 0.5) < 1) {
    return 0.5 * Math.pow(pos, 3)
  }
  return 0.5 * (Math.pow(pos - 2, 3) + 2)
}

export function visibilityChange(hanlder) {
  let bowhidden =
    'hidden' in document
      ? 'hidden'
      : 'webkithidden' in document
        ? 'webkithidden'
        : 'mozhidden' in document
          ? 'mozhidden'
          : null
  let vibchage = 'visibilitychange' || 'webkitvisibilitychange' || 'mozvisibilitychange'
  document.addEventListener(vibchage, function() {
    /*ie10+  moz  webkit  默认*/
    if (!document[bowhidden]) {
      /*false*/
      hanlder(true)
    } else {
      /*true*/
      hanlder(false)
    }
  })
}

export function bodyModal() {
  let scrollTop
  return {
    /**
     * 方法解除屏幕锁定，并且屏幕不会滚动到最上部分
     */
    static() {
      if (document.body.style.position === 'fixed') {
        document.body.style.position = 'static'
        // scrollTop lost after set position:fixed, restore it back.
        if (document.scrollingElement) {
          document.scrollingElement.scrollTop = scrollTop
        } else {
          document.body.scrollTop = scrollTop
        }
      }
    },
    /**
     * 方法回锁死屏幕，禁止屏幕上下滑动
     */
    fixed() {
      console.log('---------')
      scrollTop = document.scrollingElement
        ? document.scrollingElement.scrollTop
        : document.body.scrollTop
      document.body.style.position = 'fixed'
      document.body.style.top = -scrollTop + 'px'
    },
  }
}
