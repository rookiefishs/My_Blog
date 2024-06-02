/*
 * @Author: wangZhiyu <w3209605851@163.com>
 * @Date: 2024-05-10 20:56:44
 * @LastEditTime: 2024-05-12 00:35:29
 * @LastEditors: wangZhiyu <w3209605851@163.com>
 * @FilePath: \THREEJS中接入物理世界(实现碰撞检测以及反弹等效果)\vite.config.js
 * @Descripttion: 
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 1234,
    host: true
  }
})
