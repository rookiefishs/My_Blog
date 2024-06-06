<!--
 * @Author: wangZhiyu <w3209605851@163.com>
 * @Date: 2024-06-06 22:07:17
 * @LastEditTime: 2024-06-06 22:17:43
 * @LastEditors: wangZhiyu <w3209605851@163.com>
 * @FilePath: \使用ref作为全局变量\src\components\component1\index.vue
 * @Descripttion: 
 * Copyright (c) 2024 by 塔比星/王志宇, All Rights Reserved. 
-->
<template>
  <div>
    {{ count }}
  </div>
</template>

<script setup>
import { count } from '../../utils/global';
</script>

<style lang="scss" scoped></style>
