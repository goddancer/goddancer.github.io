import { reactive, toRefs, ToRefs } from 'vue'

interface DATA_MODEL_PROPS {
  startClientX: number
  startClientY: number
  axis: null | 'x+' | 'x-' | 'y+' | 'y-'
}
const DATA_MODEL: DATA_MODEL_PROPS = {
  startClientX: 0,
  startClientY: 0,
  axis: null,
}
const useTouchSteps = (el: HTMLBaseElement, {
  handleTouchStart = (ev: TouchEvent, payload: ToRefs<DATA_MODEL_PROPS>) => {},
  handleTouchMove = (ev: TouchEvent, payload: ToRefs<DATA_MODEL_PROPS>) => {},
  handleTouchEnd = (ev: TouchEvent, payload: ToRefs<DATA_MODEL_PROPS>) => {},
}) => {
  if (!el) {
    throw new Error('[use-touch-steps]: no valid init el')
  }
  const _data = reactive(DATA_MODEL)
  const _touchStart = (ev: TouchEvent) => {
    const _touch = ev.touches[0] || ev.changedTouches[0]
    _data.startClientX = _touch.pageX
    _data.startClientY = _touch.pageY
    handleTouchStart(ev, toRefs(_data))
  }
  const _touchMove = (ev: TouchEvent) => {
    const _touch = ev.touches[0] || ev.changedTouches[0]

    if (!_data.axis) {
      const _diffY = _touch.clientY - _data.startClientY
      const _diffX = _touch.clientX - _data.startClientX
      if (Math.abs(_diffY) - Math.abs(_diffX) > 0) {
        _data.axis = _diffY > 0 ? 'y+' : 'y-'
      } else {
        _data.axis = _diffX > 0 ? 'x+' : 'x-'
      }
    }
    handleTouchMove(ev, toRefs(_data))
  }
  const _touchEnd = (ev: TouchEvent) => {
    _data.axis = null
    handleTouchEnd(ev, toRefs(_data))
  }
  const toggleListener = (isInit: boolean) => {
    const _eventHandler = isInit ? el.addEventListener : el.removeEventListener
    _eventHandler('touchstart', _touchStart, {
      passive: false,
    })
    _eventHandler('touchmove', _touchMove, {
      passive: false,
    })
    _eventHandler('touchend', _touchEnd, {
      passive: false,
    })
  }
  toggleListener(true)
  return {
    toggleListener,
    data: toRefs(_data),
  }
}

export {
  useTouchSteps,
}