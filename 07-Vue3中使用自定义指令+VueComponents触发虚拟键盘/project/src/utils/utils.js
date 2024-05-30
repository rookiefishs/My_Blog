/*
 * @Author: wangzhiyu <w19165802736@163.com>
 * @version: 1.1.1
 * @Date: 2023-12-02 14:21:41
 * @LastEditTime: 2023-12-02 14:22:00
 * @Descripttion: 工具函数
 */
/**
 * 深度克隆对象或数组
 *
 * @param {Object|Array} obj - 要克隆的对象或数组
 * @returns {Object|Array} 克隆后的新对象或数组
 */
export function deepClone(obj) {
  // 如果是基本类型或null，则直接返回原值
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  // 判断obj是数组还是对象
  const newObj = Array.isArray(obj) ? [] : {};

  // 递归克隆obj的子元素
  for (let key in obj) {
    // 跳过继承属性
    if (!Object.prototype.hasOwnProperty.call(obj, key)) {
      continue;
    }

    newObj[key] = deepClone(obj[key]);
  }

  return newObj;
}
