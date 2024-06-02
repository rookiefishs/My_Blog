/*
 * @Author: wangZhiyu <w3209605851@163.com>
 * @Date: 2024-05-16 11:41:25
 * @LastEditTime: 2024-05-16 14:07:51
 * @LastEditors: wangZhiyu <w3209605851@163.com>
 */
// nodejs跳转操作系统亮度第三方库
const brightness = require('brightness')

// 获取当前的屏幕亮度
brightness.get().then(light => {
  console.log(`当前的屏幕亮度为:${(light * 100).toFixed(2)}%`);

  // 设置当前的屏幕亮度
  brightness.set(1).then(res => {
    console.log('屏幕亮度设置成功!')
  })
})