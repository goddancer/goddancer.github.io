interface Listener extends VoidFunction {
  _original?: VoidFunction | number,
}
interface EventsItem {
  cb: Listener,
  ctx: any,
}
interface Events {
  [key: string]: Array<EventsItem>
}
class EventEmitter {
  private events: Events = {}

  checkExist(type: string, listener: Listener, context: any = null): boolean {
    this.events[type] = this.events[type] || []
    return this.events[type].findIndex(it => (it.cb === listener || (listener._original && it.cb._original === listener._original)) && it.ctx === context) > -1
  }

  on(type: string, listener: Listener, context: any = null) {
    this.events[type] = this.events[type] || []
    if (this.checkExist(type, listener, context)) {
      console?.warn(`[EventEmitter $on]: Repeat statement width type [${type}] and listener and context`)
      return
    }
    this.events[type].push({
      cb: listener,
      ctx: context,
    })
  }

  /* 根据listener解绑；若未传，则根据type解绑全部 */
  off(type: string, listener?: Listener) {
    this.events[type] = this.events[type] || []
    if (listener) {
      this.events[type] = this.events[type].filter(({ cb }) => (cb !== listener || (listener._original && cb._original !== listener._original)))
    } else {
      this.events[type] = []
    }
  }

  emit(type: string, ...payload: any) {
    this.events[type] = this.events[type] || []
    this.events[type].map(({ cb, ctx }) => {
      cb.apply(ctx, payload)
    })
  }

  once(type: string, listener: Listener, context: any = null) {
    const callback = (...args: any) => {
      this.off(type, listener)
      listener.apply(context, args)
    }
    // callback每次都不一样，所以要使用__original保存源进行对比，否则无法checkExist
    // 和addEventListener类似，相同type的function需要共享一个引用地址，负责无法去重，可能导致相同行为的函数多次注册
    callback._original = listener

    this.on(type, callback)
  }

  clear() {
    this.events = {}
  }
}
const eventEmitter = new EventEmitter()
export default EventEmitter
export {
  eventEmitter,
}