/*
 * @Author: wangzhiyu <w19165802736@163.com>
 * @version: 1.1.1
 * @Date: 2023-12-04 14:58:03
 * @LastEditTime: 2024-01-18 13:57:07
 * @Descripttion: vue自定义全局指令
 */
import { nextTick } from 'vue';
import Keyboard from '@/components/Keyboard/index';
/**
    在绑定元素的 attribute 或事件监听器被应用之前调用, 在指令需要附加须要在普通的 v-on 事件监听器前调用的事件监听器时，这很有用
    created() { },
    当指令第一次绑定到元素并且在挂载父组件之前调用
    beforeMount() { },
    在绑定元素的父组件被挂载后调用
    mounted() { },
    在更新包含组件的 VNode 之前调用
    beforeUpdate() { },
    在包含组件的 VNode 及其子组件的 VNode 更新后调用
    updated() { },
    在卸载绑定元素的父组件之前调用
    beforeUnmount() { },
    当指令与元素解除绑定且父组件已卸载时, 只调用一次
    unmounted() { },
 */

/**
 * 递归查找input元素
 * @param {object} dom dom树
 * @returns 找到的input元素或者null
 */
function findFirstInputElement(dom) {
  // 检查dom是否是input元素
  if (dom.tagName === 'INPUT') {
    return dom;
  }

  // 如果不是input元素，且有子节点，则递归查找子节点
  if (dom.children) {
    for (let child of dom.children) {
      let input = findFirstInputElement(child);
      if (input) {
        return input; // 如果找到input元素，立即返回
      }
    }
  }
  // 如果没有找到input元素，返回null
  return null;
}

export default {
  install(app) {
    app.directive('keyboard', {
      mounted(el, binding) {
        // 获取需要监听聚焦的input
        let input = findFirstInputElement(el);

        // 边界处理判断
        if (input === null) return console.log('没有要聚焦的input');

        // 绑定指令的input取消聚焦
        input.blur();

        // 判断是否已经获取焦点
        window.isFocus = false;

        // 打开键盘方法
        const { openModal } = window.keyboard ? window.keyboard : window;

        // 聚焦事件函数
        const focusFn = () => {
          // 如果已经获取过焦点,并且没有取消焦点,则不允许后续代码运行
          if (window.isFocus) return;

          // 设置已获取焦点
          window.isFocus = true;

          // 打开键盘弹框
          openModal && openModal(input.value);

          // 设置全局当前触发指令的input
          window.targetInput = input;
        };

        // 绑定表单聚焦事件
        input.onfocus = focusFn;

        // 每次取消聚焦时,都重新监听聚焦函数,将之前的聚焦函数覆盖
        input.onblur = () => {
          input.onfocus = focusFn;
        };
      },
      beforeUnmount(el) {
        console.log('触发beforeUnmount');
        el.onfocus = () => {};
        el.onblur = () => {};
      },
    });
  },
};
