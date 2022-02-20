/*
  1. 只在移动端有效，针对的是touchmove事件，滚轮wheel、mousewheel事件未做处理
  2. 只有支持设置eventListener options.passive的设备才支持
  3. 当el为Window、Document、Document.body时，passive在主流浏览器中默认为true，为了优化滚动性能。也就是说，当不支持passive时，可以降级到不监听window、boyd、document的事件即可
 */
class PreventScroll {
  private _dataAttrKey = 'data-prevent-scroll'
  private _passiveSupported = false
  private _preventStatus: boolean = false
  private _el: HTMLElement | Element
  private _checkPassive(): void {
    const _this = this
    try {
      window.addEventListener('__passive_check__' as keyof WindowEventMap, null as unknown as EventListenerOrEventListenerObject , Object.create({
        get passive() {
          _this._passiveSupported = true
          return true
        },
        once: true,
      }))
    } catch (ignore) {
      // ignore
    }
  }
  private _catchViewScrolling(catchMove: boolean): void {
    if (catchMove) {
      this._el.addEventListener('touchmove', this._preventScrolling, this._passiveSupported ? { passive: false } : false)
    } else {
      this._el.removeEventListener('touchmove', this._preventScrolling, this._passiveSupported ? { passive: false } as EventListenerOptions : false)
    }
  }
  private _preventScrolling(e: Event): void {
    e.preventDefault()
  }

  constructor(el: HTMLElement | Element = document.body) {
    this._checkPassive()
    if (!this._passiveSupported && ['[object HTMLBodyElement]', '[object HTMLDocument]', '[object Window]'].includes(Object.prototype.toString.call(el))) {
      console?.warn(`[preventScroll]: take no effect cause passive is not supported!`)
    }
    this._el = el
  }

  get canPrevent(): boolean {
    return this._passiveSupported
  }

  get preventStatus(): boolean {
    return this._preventStatus
  }

  enable(): void {
    this._el.setAttribute(this._dataAttrKey, 'true')
    this._catchViewScrolling(true)
    this._preventStatus = true
  }

  disable(): void {
    this._el.removeAttribute(this._dataAttrKey)
    this._catchViewScrolling(false)
    this._preventStatus = false
  }
}
export const preventBodyScroll = new PreventScroll()
export default PreventScroll