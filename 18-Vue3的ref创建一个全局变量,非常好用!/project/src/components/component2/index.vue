<!--
 * @Author: wangZhiyu <w3209605851@163.com>
 * @Date: 2024-06-06 22:07:22
 * @LastEditTime: 2024-06-06 22:20:17
 * @LastEditors: wangZhiyu <w3209605851@163.com>
 * @FilePath: \使用ref作为全局变量\src\components\component2\index.vue
 * @Descripttion: 
 * Copyright (c) 2024 by 塔比星/王志宇, All Rights Reserved. 
-->
<template>
  <div>
    <button @click="changeCount">修改count</button>
  </div>
</template>

<script setup>
import { count } from '../../utils/global';
const changeCount = () => {
  count.value++;
};
</script>

<style lang="scss" scoped></style>
