export function debounce(func: any, wait: number, immediate: boolean) {
  let timeout: any
  return function debFn(...args: any) {
    // @ts-ignore
    let context = this
    let later = function laterFn() {
      timeout = null
      if (!immediate) {
        func.apply(context, args)
      }
    }
    let callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) {
      func.apply(context, args)
    }
  }
}
