const getElCss = el => {
  let style = el && el.style,
    val

  if (style) {
    if (document.defaultView && document.defaultView.getComputedStyle) {
      val = document.defaultView.getComputedStyle(el, '')
    } else if (el.currentStyle) {
      val = el.currentStyle
    }

    return val
  }
  return ''
}

const getScrollingElement = () => {
  const IE11OrLess = !!navigator.userAgent.match(
    /(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i
  )

  if (IE11OrLess) {
    return document.documentElement
  } else {
    return document.scrollingElement
  }
}

const getParentAutoScrollElement = (el, axis = 'y', includeSelf = true) => {
  if (!el || !el.getBoundingClientRect) {
    return getScrollingElement()
  }

  let elem = el
  let gotSelf = false
  do {
    if (elem.clientWidth < elem.scrollWidth || elem.clientHeight < elem.scrollHeight) {
      let elemCSS = getElCss(elem)
      if (
        axis === 'x' &&
        (elem.clientWidth < elem.scrollWidth &&
          (elemCSS.overflowX === 'auto' || elemCSS.overflowX === 'scroll'))
      ) {
        if (!elem.getBoundingClientRect || elem === document.body) {
          return getScrollingElement()
        }

        if (gotSelf || includeSelf) {
          return elem
        }
        gotSelf = true
      } else if (
        axis === 'y' &&
        (elem.clientHeight < elem.scrollHeight &&
          (elemCSS.overflowY === 'auto' || elemCSS.overflowY === 'scroll'))
      ) {
        if (!elem.getBoundingClientRect || elem === document.body) {
          return getScrollingElement()
        }

        if (gotSelf || includeSelf) {
          return elem
        }
        gotSelf = true
      }
    }
  } while ((elem = elem.parentNode))

  return getScrollingElement()
}

export default getParentAutoScrollElement
export { getElCss, getScrollingElement }
