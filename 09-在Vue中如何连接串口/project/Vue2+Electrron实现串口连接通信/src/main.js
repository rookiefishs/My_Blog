import Vue from "vue";
import App from "./App";
import router from "./router";
import Element from "element-ui";
// import "element-ui/lib/theme-chalk/index.css";
import plugins from "./plugins"; // plugins
Vue.use(plugins);
Vue.use(Element);
// 判断是否为electron环境
if (window.process && window.process.type === "renderer") {
  //加载时获取electron的配置
  //因为开启获取electron ipc会导致浏览器端无法访问
  const { ipcRenderer } = window.require("electron");
  // console.log(ipcRenderer, 'ipcRenderer')
  //ipcRenderer.send('Open-Debug-Window') // 向主进程发送消息
  ipcRenderer.on("CONFIG", async (event, config) => {
    /* eslint-disable no-new */
    new Vue({
      el: "#app",
      router,
      components: { App },
      template: "<App/>"
    });
  });
} else {
  new Vue({
    el: "#app",
    router,
    components: { App },
    template: "<App/>"
  });
}
