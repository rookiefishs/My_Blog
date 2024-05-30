/*
 * @Author: wangzhiyu <w19165802736@163.com>
 * @version: 1.1.1
 * @Date: 2023-11-22 09:56:16
 * @LastEditTime: 2024-04-02 14:36:49
 * @Descripttion: 全局components
 */
import DialogModal from './DialogModal/index.vue';

// 全局方法挂载
export function components(app) {
  app.component('DialogModal', DialogModal);
}
