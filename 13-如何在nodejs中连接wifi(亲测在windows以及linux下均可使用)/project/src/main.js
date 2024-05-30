/*
 * @Author: wangzhiyu <w19165802736@163.com>
 * @Date: 2023-12-15 13:57:47
 * @LastEditTime: 2024-04-17 14:10:03
 * @Descripttion: 项目主入口
 */
import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

// 组件库
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

// 导入路由
import router from '@/router';

// 全局组件
import { components } from './components/index';

const app = createApp(App);

// 挂载全局组件
components(app);

// 挂载路由+仓库
app.use(router);

// 挂载ui组件库
app.use(Antd);

if (window.process && window.process.type === 'renderer') {
  //加载时获取electron的配置
  //因为开启获取electron ipc会导致浏览器端无法访问
  const { ipcRenderer } = require('electron');
  await ipcRenderer.on('CONFIG', async (event, config) => {
    app.mount('#app');
  });
} else {
  app.mount('#app');
}
