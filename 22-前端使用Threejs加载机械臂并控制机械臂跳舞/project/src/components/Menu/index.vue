<!--
 * @Author: wangzhiyu <w19165802736@163.com>
 * @version: 1.0.0
 * @Date: 2024-02-29 09:26:30
 * @LastEditTime: 2024-07-07 11:13:06
 * @Descripttion: 
-->
<template>
  <div class="slider-block">
    <!-- 关节1 -->
    <div class="slider-item">
      <p class="demonstration">关节1</p>
      <span class="demonstration">绕y轴旋转</span>
      <el-slider v-model="joints.joint1" show-input :min="min" :max="max" :step="0.01" @input="sliderInput($event, '1', 'y')" />
    </div>
    <!-- 关节2 -->
    <div class="slider-item">
      <p class="demonstration">关节2</p>
      <span class="demonstration">绕x轴旋转</span>
      <el-slider v-model="joints.joint2" show-input :min="min" :max="max" :step="0.01" @input="sliderInput($event, '2', 'x')" />
    </div>
    <!-- 关节3 -->
    <div class="slider-item">
      <p class="demonstration">关节3</p>
      <span class="demonstration">绕x轴旋转</span>
      <el-slider v-model="joints.joint3" show-input :min="min" :max="max" :step="0.01" @input="sliderInput($event, '3', 'x')" />
    </div>
    <!-- 关节4 -->
    <div class="slider-item">
      <p class="demonstration">关节4</p>
      <span class="demonstration">绕x轴旋转</span>
      <el-slider v-model="joints.joint4" show-input :min="min" :max="max" :step="0.01" @input="sliderInput($event, '4', 'x')" />
    </div>
    <!-- 关节5 -->
    <div class="slider-item">
      <p class="demonstration">关节5</p>
      <span class="demonstration">绕y轴旋转</span>
      <el-slider v-model="joints.joint5" show-input :min="min" :max="max" :step="0.01" @input="sliderInput($event, '5', 'y')" />
    </div>
    <!-- 关节6 -->
    <div class="slider-item">
      <p class="demonstration">关节6</p>
      <span class="demonstration">绕x轴旋转</span>
      <el-slider v-model="joints.joint6" show-input :min="min" :max="max" :step="0.01" @input="sliderInput($event, '6', 'x')" />
    </div>
    <!-- 动画1 -->
    <el-button @click="armAnimation(1)" size="large" type="primary" style="font-size: 18px; margin-top: 20px">动画1</el-button>
    <!-- 动画2 -->
    <el-button @click="armAnimation(2)" size="large" type="primary" style="font-size: 18px; margin-top: 20px">动画2</el-button>
    <!-- 动画3 -->
    <el-button @click="armAnimation(3)" size="large" type="primary" style="font-size: 18px; margin-top: 20px">动画3</el-button>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
const joints = ref({
  joint1: 0,
  joint2: 0,
  joint3: 0,
  joint4: 0,
  joint5: 0,
  joint6: 0,
});

const min = ref(Number(-Math.PI.toFixed(2)));
const max = ref(Number(Math.PI.toFixed(2)));

const emit = defineEmits(['sliderInput']);

// 动画1轨迹
const anmation1 = [0, 1.65, -1.72, 0, 0, 0];

// 动画2轨迹
const anmation2 = [0, -0.88, 1.59, 0, 0, 0];

// 动画3轨迹
const anmation3 = [-3.14, 0, 0, 0, 0, 0];

const sliderInput = (e, name, direction) => {
  emit('sliderInput', e, name, direction);
};

// 机械臂动画执行
const armAnimation = targetAnimation => {
  // 执行动画1
  if (targetAnimation === 1) {
    emit('goPoint', anmation1);
  }
  // 执行动画2
  if (targetAnimation === 2) {
    emit('goPoint', anmation2);
  }
  // 执行动画3
  if (targetAnimation === 3) {
    emit('goPoint', anmation3);
  }
};
</script>
