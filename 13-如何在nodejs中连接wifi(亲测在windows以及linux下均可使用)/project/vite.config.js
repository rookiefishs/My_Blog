/*
 * @Author: wangzhiyu <w19165802736@163.com>
 * @Date: 2023-12-15 13:57:47
 * @LastEditTime: 2024-04-17 11:03:09
 * @Descripttion: vite配置
 */
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd());

  // 获取环境配置
  const { VITE_APP_ENV, VITE_APP_BASE_API, VITE_APP_API_ADDRESS } = env;

  // 创建代理相关配置
  const server = {
    port: 9090,
    host: true,
    open: false,
    force: true,
    hmr: true, // 热更新
    proxy: {}
  };

  // 设置不同环境的不同配置
  server.proxy[VITE_APP_BASE_API] = {
    target: VITE_APP_API_ADDRESS,
    changeOrigin: true,
    rewrite: p => p.replace(/^\/dev-api/, ''),
  };

  return {
    base: VITE_APP_ENV === 'production' ? './' : './',
    plugins: [
      vue(),
      AutoImport({
        // 设置自动导入的模块
        imports: ['vue', 'vue-router'],

        // 自定义自动导入的配置文件,默认是根目录下
        dts: 'src/utils/auto-imports.d.ts',
      }),
    ],
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
    // 应用代理配置
    server,
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
