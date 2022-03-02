/* import text from './test.text'
import './styles'

window.onload = function () {
  document.body.innerHTML += text
} */

import { createApp } from 'vue'
import '@jico/common/vw-rem'
import App from './App'
import router from '@/router'
import '@/styles/global'
import { Progress, Popover, Loading, Overlay, PullRefresh, List, Switch, Cell } from 'vant'
import installDirectives from '@jico/common/vue-directives'
import i18n from '@/locales'

const app = createApp(App)
app
  .use(router)
  .use(i18n)
  .use(Progress)
  .use(Popover)
  .use(Loading)
  .use(Overlay)
  .use(PullRefresh)
  .use(List)
  .use(Switch)
  .use(Cell)
  .use(installDirectives)
  .mount('#app')
