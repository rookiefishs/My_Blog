/*
 * @Author: wangzhiyu <w19165802736@163.com>
 * @version: 1.0.0
 * @Date: 2024-03-02 15:18:56
 * @LastEditTime: 2024-03-02 15:55:50
 * @Descripttion: 
 */
import { createApp } from 'vue'
import VueKonva from 'vue-konva';
import './index.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
createApp(App).use(ElementPlus).use(VueKonva).mount('#app')
