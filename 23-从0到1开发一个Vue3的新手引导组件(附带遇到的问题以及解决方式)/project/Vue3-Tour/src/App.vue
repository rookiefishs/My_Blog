<!--
 * @Author: wangZhiyu <w3209605851@163.com>
 * @Date: 2024-07-09 13:44:13
 * @LastEditTime: 2024-07-09 15:49:38
 * @LastEditors: wangZhiyu <w3209605851@163.com>
 * @FilePath: \Vue3新手引导组件\Vue3-Tour\src\App.vue
 * @Descripttion: 
-->
<template>
  <div class="container">
    <w-tour @onRead="onRead" readBtn tipMessage="这是新手教程的第一步" :isTarget="step === 1" :value="open">
      <template #target>
        <el-button type="primary">按钮1</el-button>
      </template>
    </w-tour>

    <w-tour @onRead="onRead" readBtn tipMessage="这是新手教程的第二步" :isTarget="step === 2" :value="open">
      <template #target>
        <el-button type="primary">按钮2</el-button>
      </template>
    </w-tour>

    <w-tour @onRead="onRead" readBtn tipMessage="这是新手教程的第三步" :isTarget="step === 3" :value="open">
      <template #target>
        <el-button type="primary">按钮3</el-button>
      </template>
    </w-tour>
  </div>
</template>
<script setup>
import { ref } from 'vue';
const step = ref(1);
const open = ref(true);

const onRead = () => {
  step.value++;

  if (step.value === 4) {
    // step.value = 0;
    open.value = false;
  }
  console.log(step.value);
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 500px;
  height: 100px;
  background-color: #7c7777;
  margin: 100px auto;
  padding: 10px;
}
</style>
