/*
 * @Author: wangzhiyu <w19165802736@163.com>
 * @version: 1.1.1
 * @Date: 2023-11-17 10:59:33
 * @LastEditTime: 2023-12-02 17:01:45
 * @Descripttion: API接口封装
 */
import request from '@/utils/request';

// 获取机械臂位姿
export const getHandPose = params =>
  request({
    url: '/weld/getArmPose',
    params,
  });

// 保存焊接指令
export const saveWeldInfo = data =>
  request({
    url: '/weld/saveWIPInfo',
    data,
    method: 'post',
  });

// 获取所有焊接指令包
export const getAllWeld = () =>
  request({
    url: '/weld/getAllWIPInfo',
  });

// 发送焊接指令接口
export const SendWeldInfo = data =>
  request({
    url: '/weld/sendWIP',
    data,
    method: 'post',
  });

// 删除焊接指令
export const deleteWeldInfo = data =>
  request({
    url: `/weld/deleteWIPInfoById?id=${data.id}`,
    method: 'delete',
  });

// 复制焊接指令
export const copyWeldInfo = data =>
  request({
    url: '/weld/copyWIPInfo',
    data,
    method: 'post',
  });

// 修改焊接顺序
export const editWeldSort = data =>
  request({
    url: '/weld/sendWIPByIds',
    data,
    method: 'post',
  });
