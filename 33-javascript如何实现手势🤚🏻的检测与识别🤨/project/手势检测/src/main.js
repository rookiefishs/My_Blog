/*
 * @Author: wangzhiyu <w19165802736@163.com>
 * @Date: 2023-12-15 11:04:25
 * @LastEditTime: 2024-12-26 10:17:17
 * @Descripttion: 项目入口
 */
import { createApp } from 'vue';
import App from './App.vue';
import './assets/styles.scss'
// 组件库
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

// 导入路由
import router from '@/router';

// 创建app实例
let app = createApp(App);

// 挂载路由
app.use(router);

// 挂载组件库
app.use(Antd);

// 初始化,挂载dom
app.mount('#app');
