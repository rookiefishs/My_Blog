/*
 * @Author: wangzhiyu <w19165802736@163.com>
 * @version: 1.1.1
 * @Date: 2023-11-22 09:56:16
 * @LastEditTime: 2023-12-04 13:56:35
 * @Descripttion: 全局components
 */
import DialogModal from './DialogModal/index.vue';
import Keyboard from './Keyboard/index.vue';

// 全局方法挂载
export function components(app) {
  app.component('Keyboard', Keyboard);
  app.component('DialogModal', DialogModal);
}
