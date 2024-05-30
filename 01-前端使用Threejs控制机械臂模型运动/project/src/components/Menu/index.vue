<!--
 * @Author: wangzhiyu <w19165802736@163.com>
 * @version: 1.0.0
 * @Date: 2024-02-20 14:04:30
 * @LastEditTime: 2024-02-20 14:09:18
 * @Descripttion: 菜单控制机械臂角度模块
-->
<template>
  <el-scrollbar height="100%">
    <div class="slider-block">
      <div class="slider-item">
        <p class="demonstration">关节1</p>
        <span class="demonstration">绕y轴旋转</span>
        <el-slider v-model="joint1" show-input :min="min" :max="max" :step="0.01" @input="sliderInput($event, '1', 'y')" />
      </div>
      <div class="slider-item">
        <p class="demonstration">关节2</p>
        <span class="demonstration">绕x轴旋转</span>
        <el-slider v-model="joint2" show-input :min="min" :max="max" :step="0.01" @input="sliderInput($event, '2', 'x')" />
      </div>
      <div class="slider-item">
        <p class="demonstration">关节3</p>
        <span class="demonstration">绕x轴旋转</span>
        <el-slider v-model="joint3" show-input :min="min" :max="max" :step="0.01" @input="sliderInput($event, '3', 'x')" />
      </div>

      <div class="slider-item">
        <p class="demonstration">关节4</p>
        <span class="demonstration">绕x轴旋转</span>
        <el-slider v-model="joint4" show-input :min="min" :max="max" :step="0.01" @input="sliderInput($event, '4', 'x')" />
      </div>
      <div class="slider-item">
        <p class="demonstration">关节5</p>
        <span class="demonstration">绕y轴旋转</span>
        <el-slider v-model="joint5" show-input :min="min" :max="max" :step="0.01" @input="sliderInput($event, '5', 'y')" />
      </div>

      <div class="slider-item">
        <p class="demonstration">关节6</p>
        <span class="demonstration">绕x轴旋转</span>
        <el-slider v-model="joint6" show-input :min="min" :max="max" :step="0.01" @input="sliderInput($event, '6', 'x')" />
      </div>
    </div>
  </el-scrollbar>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
const joint1 = ref(0);
const joint2 = ref(0);
const joint3 = ref(0);
const joint4 = ref(0);
const joint5 = ref(0);
const joint6 = ref(0);

const min = ref(Number(-Math.PI.toFixed(2)));
const max = ref(Number(Math.PI.toFixed(2)));

const emit = defineEmits(['sliderInput']);

const sliderInput = (e, name, direction) => {
  emit('sliderInput', e, name, direction);
};
</script>
