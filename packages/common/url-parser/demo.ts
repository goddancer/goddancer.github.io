import { URL_FILEDS, PARSED_URL_OBJ } from './const'
import { URL_FILEDS_TYPE, parsedObjProps } from './type'

class UrlParams {
  private __params__ = Object.create(null)
  private findPercentSign = /%(?![0-9a-fA-F]{2})/g
  private plusReg = /\+/g
  private find = /[!'\(\)~]|%20|%00/g
  private replaceMap = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00'
  }
  // private params: Record<string, string> = {}

  constructor(query: string = '?b=2&b=3&theme=1&lang=en') {
    // this.params = this.toJSON(this.paramStr)
    this.parse((query || '').trim())
  }

  static isURLSearchParamsSupport() {
    if (URLSearchParams && Object.prototype.toString.call(URLSearchParams) === '[object Function]' && new URLSearchParams('q=%2B').get('q') === '+') {
      return true
    }
    return false
  }

  parse(query: string | Array<Array<string>> | Record<string, string>) {
    switch (true) {
      case !query:
        break
      case typeof query === 'string':
        if ((query as string).charAt(0) === '?') {
          query = (query as string).slice(0)
        }
        (query as string).split('&').forEach(pair => {
          const index = pair.indexOf('=')
          if (index > -1) {
            this.appendTo(this.decode(pair.slice(0, index)), this.decode(pair.slice(index + 1)))
          } else if (pair.length) {
            this.appendTo(this.decode(pair), '')
          }
        })
        break
      case Array.isArray(query):
        (query as Array<Array<string>>).forEach(([key, value]) => {
          this.appendTo(key, value)
        })
        break
      case 'forEach' in (query as any):
        // @ts-ignore
        query.forEach((value, key) => this.appendTo(key, value))
        break
      default:
        for (let key in (query as Record<string, string>)) {
          this.appendTo(key, (query as Record<string, string>)[key])
        }
    }
  }

  set(key: string, value: string) {
    this.__params__[key] = [value]
  }
  
  /* 追加参数，允许key相同参数存在 */
  appendTo(key: string, value: string | Array<string>): void {
    const str = Array.isArray(value) ? value.join(',') : value
    this.__params__[key] ? this.__params__[key].push(str) : this.__params__[key] = [str]
  }

  append(key: string, value: string | Array<string>) {
    this.appendTo(key, value)
  }

  delete(key: string) {
    delete this.__params__[key]
  }

  get(key: string) {
    return this.__params__[key] ? this.__params__[key][0] : null
  }

  getAll(key: string) {
    return this.__params__[key] ? this.__params__[key].slice(0): []
  }

  toJSON() {
    return this.__params__
  }

  toString() {
    return Object.keys(this.__params__).reduce((a, key) => {
      const encodeKey = this.encode(key)
      a.concat(this.__params__[key].map((v: string) => {
        return `${encodeKey}=${this.encode(v)}`
      }))
      return a
    }, [])
  }

  sort() {
    Object.keys(this.__params__).sort().forEach(key => {
      const _value = this.getAll(key)
      this.delete(key)
      this.append(key, _value)
    })
  }

  decode(str: string) {
    return decodeURIComponent(str.replace(this.findPercentSign, '%25').replace(this.plusReg, ' '))
  }

  encode(str: string) {
    return encodeURIComponent(str).replace(this.find, this.replacer)
  }

  replacer(key: string) {
    // @ts-ignore
    return this.replaceMap[key]
  }
  
  /* 设置参数，相同参数会被替换 */
  // set(): void {}
  
  /* deletes the given parameter */
  // delete(): boolean { }

  /* returns the first value associated to the given parameter */
  // get(name: string): string | null { }
  
  /* Returns all the values association with a given search parameter  */
  // getAll(name: string): Array<string> { }
  
  /* Returns a Boolean indicating if such a search parameter exists */
  // has(name: string): boolean { }
  
  /* nomarlize the parameters */
  // sort(): void { }
  
  /*  */
  // toString(): string { }
  
  /* toJSON */
  // toJSON(queryStr: string): Record<string, string> {
  //   return {}
  // }
}
class UrlParser {
  private _urlMap = PARSED_URL_OBJ

  constructor(url: string, config: any) {
    this._urlMap = UrlParser.parse(url)
  }

  get urlMap() {
    return this._urlMap
  }

  static parse(url: string): parsedObjProps {
    const temp = PARSED_URL_OBJ
    if (url) {
      const _el = document.createElement('a')
      _el.href = url
      URL_FILEDS.forEach(key => {
        // @ts-ignore
        temp[key] = _el[key]
      })
    }
    return temp as parsedObjProps
  }
}
const a = new UrlParser('https://m-qa.youyu.cn/c/super/hybrid/market-scan/?theme=1&lang=en#/?a=1&b=2', {})
const temp1 = new URL('https://m-qa.youyu.cn/c/super/hybrid/market-scan/?b=2&b=3&theme=1&lang=en#/?c=0&a=1&b=2')
temp1.searchParams.sort()
console.log(temp1.searchParams.get('b'))
// console.log(a.urlMap)