<!--
 * @Author: wangZhiyu <w3209605851@163.com>
 * @Date: 2024-07-07 09:48:42
 * @LastEditTime: 2024-07-07 10:06:12
 * @LastEditors: wangZhiyu <w3209605851@163.com>
 * @FilePath: \Vue3-create-pdf\src\App.vue
 * @Descripttion: 
-->
<template>
  <div>
    <table class="tableBox" border="1">
      <tr>
        <th>姓名</th>
        <th>年龄</th>
        <th>分数</th>
      </tr>
      <tr>
        <td>小王</td>
        <td>11</td>
        <td>98</td>
      </tr>
      <tr>
        <td>小李</td>
        <td>12</td>
        <td>79</td>
      </tr>
      <tr>
        <td>小陈</td>
        <td>87</td>
        <td>11</td>
      </tr>
    </table>
    <button @click="handDownloadPdf">点击下载pdf</button>
  </div>
</template>
<script setup>
import { nextTick } from 'vue';
import html2pdf from 'html2pdf.js';

const handDownloadPdf = () => {
  nextTick(() => {
    let element = document.querySelector('.tableBox');
    let opt = {
      margin: 0, // 设置PDF页面的边距为0，即没有边距
      filename: `成绩表.pdf`, // 指定生成文件的名称
      image: { type: 'jpeg', quality: 1 }, // 设置生成PDF时使用的图像格式为JPEG，质量为1（最高质量）
      // 这是一个用于将HTML元素转换为canvas的库
      html2canvas: {
        scale: 2, //  缩放比例为2，即生成的canvas尺寸是原始尺寸的两倍
        allowTaint: false, // 设置为false，表示不允许加载跨域的图片
        useCORS: true, // 设置为true，允许跨域加载的图片使用CORS策略
      },
      //  控制PDF页面的分页行为
      // mode: 设置为avoid-all，尽量避免分页
      // after: 在生成PDF时，当遇到id为levelAnalysis的元素后进行分页
      pagebreak: { mode: 'avoid-all', after: '#levelAnalysis' },
      enableLinks: true, // 支持文本中放链接，可点击跳转
    };

    // html2pdf()将html转换为pdf
    // set(opt)表示转换为pdf时使用指定的配置
    // form表示html2pdf中将指定的dom元素加入pdf
    // save()表示将创建完成的pdf保存到本地
    html2pdf().set(opt).from(element).save();
  });
};
</script>
<style scoped>
.tableBox {
  text-align: center;
}
th {
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
