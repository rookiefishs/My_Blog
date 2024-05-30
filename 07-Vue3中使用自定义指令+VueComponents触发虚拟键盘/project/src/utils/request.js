/*
 * @Author: wangzhiyu <w19165802736@163.com>
 * @version: 1.1.1
 * @Date: 2023-11-17 10:52:04
 * @LastEditTime: 2023-11-23 14:08:31
 * @Descripttion: axios请求 响应,发送拦截器
 */
import axios from "axios";
import { ElMessage } from "element-plus";
console.log(
  import.meta.env.VITE_APP_BASE_API,
  "import.meta.env.VITE_APP_BASE_API1"
);
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL:
    import.meta.env.VITE_APP_ENV === "development"
      ? import.meta.env.VITE_APP_BASE_API
      : "http://127.0.0.1:2334",
  // 超时
  timeout: 100000,
});

// request拦截器
service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    if (res.data.code !== 200) {
      ElMessage.error(res.msg);
    }

    return Promise.resolve(res.data);
  },
  (error) => {
    ElMessage.error(error);
    return Promise.reject(error);
  }
);

export default service;
