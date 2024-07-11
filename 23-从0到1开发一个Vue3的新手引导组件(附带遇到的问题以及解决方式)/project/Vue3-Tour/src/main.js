/*
 * @Author: wangZhiyu <w3209605851@163.com>
 * @Date: 2024-07-09 13:44:13
 * @LastEditTime: 2024-07-09 14:08:45
 * @LastEditors: wangZhiyu <w3209605851@163.com>
 * @FilePath: \Vue3新手引导组件\Vue3-Tour\src\main.js
 * @Descripttion: 
 * Copyright (c) 2024 by 塔比星/王志宇, All Rights Reserved. 
 */
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'; // 导入element-plus 组件库
import 'element-plus/dist/index.css'; // 导入element-plsu css文件

import mountComponents from './components'
const app = createApp(App)

mountComponents(app)

app.use(ElementPlus).mount('#app')
