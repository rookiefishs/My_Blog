/*
 * @Author: wangzhiyu <w19165802736@163.com>
 * @version: 1.1.1
 * @Date: 2023-11-16 13:19:53
 * @LastEditTime: 2024-01-18 13:56:52
 * @Descripttion: 入口文件
 */
import { createApp } from 'vue';
import App from './App.vue';
import './assets/styles/index.scss';

import directive from '@/directives/index';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { components } from './components/index';

const app = createApp(App);

// 全局组件挂载
components(app);

app.use(directive).use(ElementPlus).mount('#app');
