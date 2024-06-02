/*
 * @Author: wangZhiyu <w3209605851@163.com>
 * @Date: 2024-05-16 11:41:25
 * @LastEditTime: 2024-05-16 14:11:38
 * @LastEditors: wangZhiyu <w3209605851@163.com>
 */
// 导入Nodejs音量控制API
const loudness = require('loudness');

// 获取当前的音量
loudness.getVolume().then(volume => {
  console.log(`当前系统音量为:${volume}%`);

  // 设置系统音量
  loudness.setVolume(50).then(() => {
    console.log(`音量已设置为50%`)
  });
});