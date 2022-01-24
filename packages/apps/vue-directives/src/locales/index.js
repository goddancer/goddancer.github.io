import { createI18n } from 'vue-i18n'
import { LANG } from '@jico/common/consts'

let langMap = {
  'zh-hant': 'zh-TW',
  'zh-hans': 'zh-CN',
  en: 'en',
}
let i18nData = {}
let context = require.context('./', true, /^\S+\.json$/)
context.keys().forEach(_path => {
  const fileName = _path.replace('./', '')
  if (fileName.includes('en')) {
    i18nData['en'] = context(_path)
  } else if (fileName.includes('zh-CN')) {
    i18nData['zh-CN'] = context(_path)
  } else {
    i18nData['zh-TW'] = context(_path)
  }
})

const i18n = createI18n({
  legacy: false,
  locale: langMap[LANG],
  fallbackLocale: 'zh-CN',
  messages: i18nData,
})
export default i18n
