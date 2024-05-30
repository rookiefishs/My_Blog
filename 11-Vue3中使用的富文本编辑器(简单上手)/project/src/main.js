/*
 * @Author: wangzhiyu <w19165802736@163.com>
 * @version: 1.0.0
 * @Date: 2023-12-15 11:04:25
 * @LastEditTime: 2024-04-01 19:53:18
 * @Descripttion: 项目入口
 */
import './style.css';
import App from './App.vue';
import { createApp } from 'vue';

import 'element-plus/dist/index.css';
import ElementPlus from 'element-plus';

// 创建app实例
let app = createApp(App);

// 挂载ui组件库
app.use(ElementPlus);

// 初始化,挂载dom
app.mount('#app');
