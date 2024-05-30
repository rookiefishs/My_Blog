import Router from 'vue-router'
import Vue from 'vue'
Vue.use(Router)
// 公共路由
export const constantRoutes = [
  {
    path: '/',
    name: 'index',
    component: () =>
      import('../views/index.vue')
  }
]

export default new Router({
  // mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
