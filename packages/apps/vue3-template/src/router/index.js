import { createRouter, createWebHashHistory } from 'vue-router'

const hashRouter = createWebHashHistory()
const Index = () => import(/* webpackChunkName: "Index" */ '../view/Index.vue')
const Directives = () => import(/* webpackChunkName: "Directives" */ '../view/Directives.vue')
const FreezeScroll = () => import(/* webpackChunkName: "FreezeScroll" */ '../view/FreezeScroll.vue')
const BetterScroll = () => import(/* webpackChunkName: "BetterScroll" */ '../view/BetterScroll.vue')
const routes = [
  {
    path: '/',
    component: Index,
    name: 'Index',
  },
  {
    path: '/directives',
    component: Directives,
    name: 'Directives',
  },
  {
    path: '/freeze-scroll',
    component: FreezeScroll,
    name: 'FreezeScroll',
  },
  {
    path: '/better-scroll',
    component: BetterScroll,
    name: 'BetterScroll',
  },
]
const router = createRouter({
  history: hashRouter,
  routes,
})
export default router
