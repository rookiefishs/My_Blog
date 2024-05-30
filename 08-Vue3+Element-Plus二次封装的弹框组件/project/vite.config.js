/*
 * @Author: wangzhiyu <w19165802736@163.com>
 * @version: 1.1.1
 * @Date: 2023-11-16 13:25:38
 * @LastEditTime: 2023-12-02 16:26:47
 * @Descripttion: vite配置
 */
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

let proxy_target = 'http://10.10.32.181:2334';

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd());
  const { VITE_APP_ENV, VITE_APP_PATH } = env;
  return {
    base: VITE_APP_ENV === 'production' ? './' : './',
    plugins: [vue()],
    resolve: {
      // https://cn.vitejs.dev/config/#/resolve-alias
      alias: {
        // 设置路径
        '~': path.resolve(__dirname, './'),
        // 设置别名
        '@': path.resolve(__dirname, 'src'),
        '@assets': path.resolve(__dirname, 'assets'),
      },
      // https://cn.vitejs.dev/config/#resolve-extensions
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    // vite 相关配置
    server: {
      port: 85,
      host: true,
      open: true,
      force: true,
      hmr: true, // 热更新
      proxy: {
        // https://cn.vitejs.dev/config/#server-proxy
        '/dev-api': {
          target: VITE_APP_PATH,
          changeOrigin: true,
          rewrite: p => p.replace(/^\/dev-api/, ''),
        },
      },
    },
    build: {
      target: 'esnext',
      rollupOptions: {
        output: {
          // 图片等资源输出的目录
          assetFileNames: 'assets/[name].[ext]',
        },
      },
    },
  };
});
