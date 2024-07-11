/*
 * @Author: wangZhiyu <w3209605851@163.com>
 * @Date: 2024-07-09 13:55:13
 * @LastEditTime: 2024-07-09 13:57:22
 * @LastEditors: wangZhiyu <w3209605851@163.com>
 * @FilePath: \Vue3新手引导组件\Vue3-Tour\src\components\index.js
 * @Descripttion: 
 */
import tour from './tour/index.vue'

// 全局方法挂载
export default function mountComponents(app) {
  app.component('w-tour', tour)
}