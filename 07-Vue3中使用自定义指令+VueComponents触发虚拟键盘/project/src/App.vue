<!--
 * @Author: wangzhiyu <w19165802736@163.com>
 * @version: 1.1.1
 * @Date: 2023-11-16 13:23:11
 * @LastEditTime: 2023-12-04 16:36:57
 * @Descripttion: 项目Vue主入口
-->
<template>
  <div>
    <el-input v-model="a" v-keyboard />
    <el-input v-model="b" v-keyboard />
    <el-input v-model="c" v-keyboard />
    <el-input v-model="d" v-keyboard />
    <Keyboard></Keyboard>
    <button @click="btnFn">aaaa</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

let a = ref(1);
let b = ref(2);
let c = ref(3);
let d = ref(4);

const btnFn = () => {
  console.log(a.value);
  console.log(b.value);
  console.log(c.value);
  console.log(d.value);
};
</script>

<style lang="scss" scoped></style>
