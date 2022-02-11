
type ENV = 'dev' | 'local' | 'qa' | 'stage' | 'live' | 'dr'
interface GLOBAL_API {
  env?: ENV
}
declare global {
  interface Window {
    GLOBAL_API?: GLOBAL_API
  }
}

export type RegMap = Partial<Record<ENV, RegExp>>
interface AutoAdaptConfig {
  currentEnv: ENV | string
  domainPostfix: string
  regMap: RegMap
  getBaseBySubdomain?: (subdomain: string) => string
}
type AutoAdaptConfigPartial = Partial<AutoAdaptConfig>
interface AutoAdaptPluginsItem {
  <T>(arg: T): T
}
export interface AutoAdaptPayload {
  config: AutoAdaptConfigPartial
  plugins?: Array<AutoAdaptPluginsItem>
}

class AutoAdapt {
  private config: AutoAdaptConfig = {
    currentEnv: 'live',
    domainPostfix: '.goddancer.com',
    regMap: {
      dev: /local\.goddancer\.com$/,
      local: /localhost:(\d)$/,
      qa: /-qa(\d)?\.goddacner\.com$/,
      stage: /-stage\.goddacner\.com$/,
      live: /\.goddacner\.com$/,
    },
  }
  constructor(private payload?: AutoAdaptPayload) {
    this.config = Object.assign(this.config, this.payload?.config)
    this.config.getBaseBySubdomain = payload?.config?.getBaseBySubdomain
  }

  get Env() {
    return this.config.currentEnv
  }

  private preInit() {
    if (typeof window === 'undefined') {
      return {
        abortInit: true
      }
    }
    window.GLOBAL_API = window.GLOBAL_API || {}
    if (window.GLOBAL_API.env) {
      console.warn && console.warn(`[AutoAdapt]: current GLOBAL_API.env is ${window.GLOBAL_API.env}, beware that autoAdapt will correct GLOBAL_API env!`)
      this.detectEnv(this.config.regMap)
      return {
        abortInit: true
      }
    }
    window.GLOBAL_API.env = this.config.currentEnv as ENV
    return {
      abortInit: false
    }
  }

  init() {
    const { abortInit } = this.preInit()
    if (abortInit) {
      return
    }
    this.payload?.plugins?.length && this.withPlugins(this.payload.plugins)
    this.detectEnv(this.config.regMap)
    this.showEnv()
  }

  private detectEnv(regMap: RegMap) {
    for (let env in regMap) {
      if (regMap.hasOwnProperty(env)) {
        // @ts-ignore
        let result = location.hostname.match(regMap[env])
        if (result) {
          window.GLOBAL_API?.env && (window.GLOBAL_API.env = env as ENV)
          Object.assign(this.config, {
            domainPostfix: result[0],
            currentEnv: env
          })
          break
        }
      }
    }
  }

  getBaseBySubdomain(subdomain: string) {
    const configSubdomainFn = this.config?.getBaseBySubdomain
    if (configSubdomainFn) {
      return configSubdomainFn.call(this.config, subdomain)
    }
    if (subdomain) {
      let _subdomain = subdomain
      if (subdomain === 'market' || subdomain === 'wapi') {
        _subdomain = this.config.currentEnv === 'dev' ? 'wapi' : 'market'
      }
      return `${location.protocol}//${_subdomain}${this.config.domainPostfix}/`
    }
    return `${location.protocol}//${location.host}/`
  }

  private showEnv() {
    if (this.config.currentEnv !== 'live') {
      let div = document.createElement('div')

      div.id = 'env-notifier'
      div.innerHTML = `${this.config.currentEnv}环境`
      div.style.cssText = `font-size: 20px;position:fixed;z-index:99999;right:10px;top:10px;border:2px solid #333;border-radius:5px;padding:4px;background:#ccc;color:#000;opacity:0.2;word-wrap:break-word;word-break:break-all;`
      div.onclick = function () {
        document.body.removeChild(div)
      }
      setTimeout(() => {
        document.body.appendChild(div)
      }, 0)
    }
  }

  private withPlugins(plugins: Array<AutoAdaptPluginsItem>) {
    this.config = plugins.reduce((a, c) => {
      const returnValue = (c || (() => {})).call(this, this.config)
      return Object.assign(a, returnValue)
    }, this.config)
  }
}
export default AutoAdapt
