class FreezeScroll {
  private _scrollTop = 0
  private _originalStyles: string | null = ''
  private _el: HTMLElement
  private _freezeStatus = false

  constructor(el: HTMLElement = document.body) {
    this._el = el
  }

  private _resetStyles() {
    if (this._originalStyles) {
      this._el.setAttribute('style', this._originalStyles)
    } else {
      this._el.removeAttribute('style')
    }
  }

  get freezeStatus() {
    return this._freezeStatus
  }
  
  enable() {
    this._originalStyles = this._el.getAttribute('style')
    // this._scrollTop = this._el.scrollTop
    this._el.style.position = 'fixed'
    this._el.style.overflow = 'hidden'
    this._freezeStatus = true
  }

  disable() {
    this._resetStyles()
    this._freezeStatus = false
  }
}
// export const freezeBodyScroll = new FreezeScroll()
export default FreezeScroll