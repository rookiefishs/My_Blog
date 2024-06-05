<!--
 * @Author: wangzhiyu <w19165802736@163.com>
 * @version: 1.0.0
 * @Date: 2024-03-14 15:44:26
 * @LastEditTime: 2024-06-05 21:11:34
 * @Descripttion: 在Threejs中加载CSS与HTML标签
-->
<template></template>

<script setup>
import { onMounted } from 'vue';
// 导入threejs
import * as THREE from 'three';
// 导入轨道控制器
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// 引入Threejs设置DOM+CSS的实例化方法
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';

// 初始化场景,相机,渲染器
const scene = new THREE.Scene();
// THREE.PerspectiveCamera(摄像机垂直角度, 摄像机宽高比,摄像机近端面,摄像机远端面);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// 设置摄像机的位置
camera.position.set(50, 50, 50);
// 渲染器
const renderer = new THREE.WebGL1Renderer({ antialias: true });
// 设置渲染器尺寸
renderer.setSize(window.innerWidth, window.innerHeight);
// 渲染颜色
renderer.setClearColor('#3F51B5');

// 创建2D渲染器
const cssRenderer = new CSS2DRenderer();
// 设置2D渲染器的尺寸
cssRenderer.setSize(window.innerWidth, window.innerHeight);
// 设置2D渲染器为绝对定位,并且在页面顶部
cssRenderer.domElement.style.position = 'absolute';
cssRenderer.domElement.style.top = '0';
// 设置2D渲染器可直接传统,操作Threejs场景
cssRenderer.domElement.style.pointerEvents = 'none';
// 确保 CSS2DRenderer 使用的相机和 WebGLRenderer 使用的相机相同
cssRenderer.camera = camera;

// 摄像机添加到场景中
scene.add(camera);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 开启阻尼效果
controls.enableDamping = true;

// 辅助线
const axesHelper = new THREE.AxesHelper(50);
scene.add(axesHelper);

// 添加一个HTML+CSS到Threejs场景中
function addDom() {
  // 创建一个DOM元素
  const div = document.createElement('div');
  // 设置DOM元素的内容
  div.innerHTML = '我是手动添加的html元素,放到Threejs场景里';
  // 设置div的样式
  div.style.color = '#fff';
  // 使用CSS2Object将dom转换为Threejs可操作的对象
  const divThree = new CSS2DObject(div);
  // 设置转换为Threejs可以使用的结构后的物体的位置
  divThree.position.set(10, 10, 10);
  // 将处理后的对象添加到Threejs场景中
  scene.add(divThree);
}

// 渲染函数
function render() {
  // 更新渲染器
  renderer.render(scene, camera);
  // 渲染 CSS2D 场景
  cssRenderer.render(scene, camera);
  // 更新轨道控制器
  controls.update();
  requestAnimationFrame(render);
}

onMounted(() => {
  render();
  document.getElementById('app').appendChild(renderer.domElement);
  // 2D渲染器挂载DOM
  document.getElementById('app').appendChild(cssRenderer.domElement);
  addDom();

  // 窗口缩放处理
  window.addEventListener('resize', () => {
    // 设置渲染器尺寸
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 更新相机宽高比
    camera.aspect = window.innerWidth / window.innerHeight;
    // 更新相机投影矩阵
    camera.updateProjectionMatrix();
    // 设置渲染器像素比
    renderer.setPixelRatio(window.innerWidth / window.innerHeight);
  });
});
</script>

<style lang="scss" scoped></style>
