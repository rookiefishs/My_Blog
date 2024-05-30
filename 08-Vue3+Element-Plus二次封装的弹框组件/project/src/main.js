/*
 * @Author: wangzhiyu <w19165802736@163.com>
 * @version: 1.1.1
 * @Date: 2023-11-16 13:19:53
 * @LastEditTime: 2024-04-02 14:41:18
 * @Descripttion: 入口文件
 */
import { createApp } from 'vue';
import App from './App.vue';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { components } from './components/index';

const app = createApp(App);

// 全局组件挂载
components(app);

app.use(ElementPlus).mount('#app');
