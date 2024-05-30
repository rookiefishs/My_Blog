<!--
 * @Author: wangzhiyu <w19165802736@163.com>
 * @version: 1.0.0
 * @Date: 2024-03-12 16:30:13
 * @LastEditTime: 2024-05-30 13:31:15
 * @Descripttion: Threejs自定义辅助线
-->
<template></template>

<script setup>
import { onMounted } from 'vue';
// 导入threejs
import * as THREE from 'three';
// 导入轨道控制器
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 初始化场景,相机,渲染器
const scene = new THREE.Scene();
// THREE.PerspectiveCamera(摄像机垂直角度, 摄像机宽高比,摄像机近端面,摄像机远端面);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
// 设置摄像机的位置
camera.position.set(2.5, 1.51, 1.02);
// 摄像机添加到场景中
scene.add(camera);
// 渲染器
const renderer = new THREE.WebGL1Renderer({ antialias: true });
// 设置渲染器尺寸
renderer.setSize(window.innerWidth, window.innerHeight);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 开启阻尼效果
controls.enableDamping = true;

/**
 * 添加xyz三色辅助线
 * @param {Object} model 需要添加辅助线的THREE.Object3D
 * @param {Number} thickness 线条的长度
 * @param {Number} height 线条的高度
 */
function addAxesHelper(model, thickness, height) {
  // 设置三个方向的圆锥+圆锥,形成坐标辅助线
  const axesHelperArr = [
    {
      color: '#00FFB5',
      direction: 'x',
      cylinderDirection: 'z',
      goneDirection: 'y',
      angle: -Math.PI / 2,
    },
    {
      color: '#2F88FE',
      direction: 'y',
      cylinderDirection: 'y',
      goneDirection: 'y',
      angle: -Math.PI / 2,
    },
    {
      color: '#F86C55',
      direction: 'z',
      cylinderDirection: 'x',
      goneDirection: 'y',
      angle: Math.PI / 2,
    },
  ];

  // 循环方向数组
  for (let i = 0; i < axesHelperArr.length; i++) {
    // 获取各个方向的颜色,方向值,旋转方向,旋转角度,圆锥指示方向
    const { color, direction, cylinderDirection, goneDirection, angle } = axesHelperArr[i];
    // 默认粗细缩小100倍
    const crude = thickness / 100;

    // 创建圆柱几何体
    const geometryCylinder = new THREE.CylinderGeometry(crude, crude, height, 32);
    // 创建圆柱材质
    const materialCylinder = new THREE.MeshBasicMaterial({ color });
    // 生成圆柱物体
    const meshCylinder = new THREE.Mesh(geometryCylinder, materialCylinder);
    // 设置圆柱物体默认的旋转方向下的指定旋转角度
    meshCylinder.rotation[cylinderDirection] = angle;
    // 将圆柱的底部对准中心点
    meshCylinder.position[direction] = height / 2;

    // 创建圆锥几何体
    const geometryCone = new THREE.ConeGeometry(crude * 2, 0.05, 32);
    // 创建圆锥材质
    const materialCone = new THREE.MeshBasicMaterial({ color });
    // 生成圆锥物体
    const meshCone = new THREE.Mesh(geometryCone, materialCone);
    // 设置圆锥位置为圆锥的底部
    meshCone.position[goneDirection] = height / 2;

    // 圆锥添加到圆柱中
    meshCylinder.add(meshCone);

    // 圆柱+圆锥的箭头组合添加到指定的Object3D对象中
    model.add(meshCylinder);
  }
}

addAxesHelper(scene, 1.3, 1);

// 渲染函数
function render() {
  // 更新渲染器
  renderer.render(scene, camera);
  // 更新轨道控制器
  controls.update();
  requestAnimationFrame(render);
}

onMounted(() => {
  render();
  document.getElementById('app').appendChild(renderer.domElement);

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
