import { createRouter, createWebHashHistory } from 'vue-router'

const hashRouter = createWebHashHistory()
const Index = () => import(/* webpackChunkName: "Index" */ '../view/Index.vue')
const routes = [
  {
    path: '/',
    component: Index,
    name: 'Index',
  },
]
const router = createRouter({
  history: hashRouter,
  routes,
})
export default router
