/*
 * @Author: wangzhiyu <w19165802736@163.com>
 * @Date: 2023-12-15 11:06:08
 * @LastEditTime: 2025-03-27 16:19:57
 * @Descripttion: 路由配置页
 */
import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: '/',
    redirect: '/home',
    hide: true,
    meta: { title: '根路径', hide: true },
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home'),
      }
    ],
  },
];

const router = createRouter({
  base: '/dist',
  //history模式：createWebHistory , hash模式：createWebHashHistory
  history: createWebHashHistory(),
  routes,
});

export default router;
