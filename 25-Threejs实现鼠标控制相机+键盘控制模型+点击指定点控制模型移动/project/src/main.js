/*
 * @Author: WangZhiyu <w3209605851@163.com>
 * @Date: 2024-08-09 08:55:00
 * @LastEditTime: 2024-08-09 16:40:24
 * @LastEditors: WangZhiyu <w3209605851@163.com>
 * @Descripttion: 
 */
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'; // 导入element-plus 组件库
import 'element-plus/dist/index.css'; // 导入element-plsu css文件

createApp(App).use(ElementPlus).mount('#app')
