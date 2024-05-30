/*
 * @Author: wangzhiyu <w19165802736@163.com>
 * @version: 1.1.1
 * @Date: 2023-11-23 11:16:17
 * @LastEditTime: 2023-12-04 10:37:58
 * @Descripttion: 枚举数据
 */
// 参数枚举
export const enumWelding = {
  WeldSpeed: '焊接速度mm/s',
  LaserStartPower: '激光起始功率%',
  LaserConstantPower: '激光恒定功率%',
  LaserEndPower: '激光结束功率%',
  LaserFrequency: '激光频率Hz',
  LaserOccupationRatio: '激光频率Hz',
  RampUpDistance: '缓升距离mm',
  SlowDescentDistance: '缓降距离mm',
  ReturnStartPoint: '缓降距离mm',
  ZRepeatedLiftHeight: 'Z轴重复上抬高度mm',
  EarlyLightEmission: '提前出光ms',
  DelayedLuminescence: '提前出光ms',
  TurnOffLightInAdvance: '提前关光ms',
  DelayedShutdownLight: '延后关光ms',
  WireFeedingTime: '提前送丝时间ms',
  WireBreakingTime: '提前断丝时间ms',
  DoNothingSpeed: '空移速度mm/s',
};

// 指令枚举
export const enumActiveFlow = {
  焊接工艺: 0x02,
  起点: 0x03,
  端点: 0x04,
  弧点: 0x05,
  结束点: 0x06,
  圆起点: 0x07,
  圆中点: 0x08,
  圆终点: 0x09,
  点焊: 0x0a,
  空走: 0x0b,
  轴回位: 0x0c,
  DO输出: 0x0d,
};

// 电流电压枚举
export const enumElectric = {
  电流输出A: 0x70,
  电压输出A: 0x90,
  电流输出B: 0x71,
  电压输出B: 0x91,
};
