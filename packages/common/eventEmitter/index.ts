interface EventsItem {
  cb: VoidFunction,
  ctx: any,
}
interface Events {
  [key: string]: Array<EventsItem>
}
class EventEmitter {
  private events: Events = {}

  on(type: string, listener: VoidFunction, context: any = null) {
    this.events[type] = this.events[type] || []
    this.events[type].push({
      cb: listener,
      ctx: context,
    })
  }

  off(type: string, listener?: VoidFunction) {
    this.events[type] = this.events[type] || []
    if (listener) {
      this.events[type] = this.events[type].filter(({ cb }) => cb !== listener)
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

  once(type: string, listener: VoidFunction, context: any = null) {
    const callback = (...args: any) => {
      this.off(type, callback)
      listener.apply(context, args)
    }
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