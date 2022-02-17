import { createApp } from 'vue'
import '@jico/common/vw-rem'
import App from './App'
import router from '@/router'
import '@/styles/global'
import { Progress, Popover, Loading, Overlay } from 'vant'
import installDirectives from '@jico/common/vue-directives'
import i18n from '@/locales'

document.addEventListener('DOMContentLoaded', (event) => {
    alert('domloaded')
  });
// setTimeout(() => {
for (let i = 0; i < 10000; i++){
  for (let i = 0; i < 10000; i++){
    //
  }
}
  alert('in mainjs')
  const app = createApp(App)
app
  .use(router)
  .use(i18n)
  .use(Progress)
  .use(Popover)
  .use(Loading)
  .use(Overlay)
  .use(installDirectives)
  .mount('#app')
// }, 0)

