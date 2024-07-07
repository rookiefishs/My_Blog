<template>
  <div>
    <Menu @sliderInput="sliderInput" @goPoint="goPoint" />
    <div class="btn" v-show="!drawer">
      <el-button type="primary" :icon="Operation" circle size="large" @click="drawerSwitch" />
    </div>
  </div>
</template>
<script setup>
// 导入gsap
import gsap from 'gsap';
/**
 * 旋转中心点
 * 2: 0.7,0.67,0
 * 3: 0.1,2.42,0
 * 4: 0.15,4.113,0
 * 5: 0.65,4.38,0
 * 6: 0.88,4.68,0
 */
import { Operation } from '@element-plus/icons-vue';
import { ref } from 'vue';
import Menu from './components/Menu/index.vue';
import * as THREE from 'three';
// 控制器
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// OBJ模型解析
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
// MTL材质解析
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { onMounted } from 'vue';

// 机械臂零件模型数组
let mtlList = ['0.mtl', '1.mtl', '2.mtl', '3.mtl', '4.mtl', '5.mtl', '6.mtl'];
// 机械臂零件材质数组
let objList = ['0.obj', '1.obj', '2.obj', '3.obj', '4.obj', '5.obj', '6.obj'];

// 创建场景->相机->渲染器->相机添加到场景中->渲染器渲染场景和相机->渲染器添加到dom中

// 场景变量
let scene = '';
// 相机变量
let camera = '';
// 渲染器变量
let renderer = '';
// 轨道控制器
let controls = '';

let handList = [];
let circlePosition = '';
const drawer = ref(false);
const handConfig = [
  {
    name: '1.mtl',
    activeRotation: 'y',
    rotation: {
      x: 0,
      y: 0,
      z: 0,
    },
    callback(obj) {
      // console.log('加载完毕的obj信息' + this.name, obj);
    },
  },
  {
    name: '2.mtl',
    activeRotation: 'x',
    rotation: {
      x: 0.7,
      y: 0.63,
      z: 0,
    },
    callback(obj) {
      // console.log('加载完毕的obj信息' + this.name, obj);
    },
  },
  {
    name: '3.mtl',
    activeRotation: 'x',
    rotation: {
      x: 0.1,
      y: 2.42,
      z: 0,
    },
    callback(obj) {
      // console.log('加载完毕的obj信息' + this.name, obj);
    },
  },
  {
    name: '4.mtl',
    activeRotation: 'x',
    rotation: {
      x: 0.15,
      y: 4.113,
      z: 0,
    },
    callback(obj) {
      // console.log('加载完毕的obj信息' + this.name, obj);
    },
  },
  {
    name: '5.mtl',
    activeRotation: 'y',
    rotation: {
      x: 0.65,
      y: 4.38,
      z: 0,
    },
    callback(obj) {
      // console.log('加载完毕的obj信息' + this.name, obj);
    },
  },
  {
    name: '6.mtl',
    activeRotation: 'x',
    rotation: {
      x: 0.88,
      y: 4.68,
      z: 0,
    },
    callback(obj) {
      // console.log('加载完毕的obj信息' + this.name, obj);
    },
  },
];

/**
 * 设置各个关节的角度
 * @param {number} value 指定的角度值
 * @param {string} name 控制的关节名称
 * @param {string} direction 旋转方向
 */
function sliderInput(value, name, direction, type = 'normal') {
  // 找到要设置的关节
  let target = handList.find(item => item.materialLibraries.join('') === name + '.mtl');
  if (type === 'normal') {
    // 直接设置运动
    target.rotation[direction] = value;
  }
}

// 根据指定点位数组设置机械臂位姿
function goPoint(targetPoint) {
  // 循环所有的自定义关节
  handConfig.forEach((item, index) => {
    // 判断是否有rotation属性,如果有就表示这个模型初始值就设置了角度
    if (item.rotation) {
      // 设置这个角度为指定的targetPoint中的点位
      item.rotation[item.activeRotation] = targetPoint[index];
      // 如果没有rotation属性,就表示这个模块初始值也没有角度
    } else {
      // 新建rotation属性
      item.rotation = {};
      // 指定rotation属性
      item.rotation[item.activeRotation] = targetPoint[index];
    }

    // 找到要改变角度的机械臂模型零件
    // const obj = handList.find(listItem => listItem.name.includes(item.name));
    let obj = handList.find(item => item.materialLibraries.join('') === index + 1 + '.mtl');

    // 自定义过渡的角度值以及角度方向
    let animationObj = {
      // 不限制执行次数
      repeat: -1,
      // 是否原路返回
      yoyo: true,
    };
    animationObj[item.activeRotation] = item.rotation[item.activeRotation];

    /**
     * 过渡旋转关节到达指定点位
     * @params {obj} 要设置的模型的rotation
     * @params {duration} 过渡时间
     * @params {target} 目标角度
     */
    gsap.to(obj.rotation, 1, animationObj);
  });
}

// 设置随机方向运动
// let value = 0;
// const randomFn = (max, min) => Math.floor(Math.random() * (max - min) + min);

// setInterval(() => {
//   value += 0.1;
//   sliderInput(randomFn(-Math.PI, Math.PI), '1', 'y');
//   sliderInput(randomFn(-Math.PI, Math.PI), '2', 'x');
//   sliderInput(randomFn(-Math.PI, Math.PI), '3', 'x');
//   sliderInput(randomFn(-Math.PI, Math.PI), '4', 'x');
//   sliderInput(randomFn(-Math.PI, Math.PI), '5', 'y');
//   sliderInput(randomFn(-Math.PI, Math.PI), '6', 'x');
// }, 1000);

// 修改标识点位的小球的坐标,测试使用
const changeCircle = (input, target) => {
  let value = input.target.value;
  circlePosition.position[target] = value;
};

// 标识点位的小球,测试使用
const circle = () => {
  const geometry = new THREE.SphereGeometry(0.1, 32, 16);
  const material = new THREE.MeshBasicMaterial({ color: 'red' });

  circlePosition = new THREE.Mesh(geometry, material);
  scene.add(circlePosition);
};

// 开关侧边栏控制栏
const drawerSwitch = () => {
  drawer.value = !drawer.value;
};

// 将后面的元素添加到前面元素的children列表中,这样某个节点运动时,节点的children都可以跟随运动
const addChildren = () => {
  // 对节点进行排序,避免添加错误的父级
  handList = handList.sort((a, b) => a.materialLibraries.join('')[0] - b.materialLibraries.join('')[0]);

  // 添加子级模型
  for (let i = 0; i < handList.length; i++) {
    // 当前模型后面还有其他模型时才会允许添加
    if (handList[i + 1]) {
      // 当前模型的类型为Group时,表示这里我已经使用了一个父级元素来包住模型了,以此来修改模型运动的中心点,如果没有包住,就表示这个模型的中心点是对的,不需要添加到Group中
      handList[i].children[0].type === 'Group' ? handList[i].children[0].add(handList[i + 1]) : handList[i].add(handList[i + 1]);
    }
  }
  console.log(handList[0], 'handList[0]');
  // 将最终整合的模型添加到场景中
  scene.add(handList[0]);
};

// 初始化
function initBase() {
  // 创建场景
  scene = new THREE.Scene();

  // 设置场景在的位置
  scene.position.set(0, -2, 0);

  // 创建视口相机
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);

  // 修改相机视图位置
  camera.position.set(6, 8, 6);

  // 相机添加到场景中
  scene.add(camera);

  // antialias:开启抗锯齿  logarithmicDepthBuffer:使用对数深度缓冲器,一般在单个场景处理较大的差异
  renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });

  // 设置渲染器尺寸
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 设置渲染器颜色
  renderer.setClearColor('#fff');
}

// 添加辅助线
function addHelpLine() {
  const gridHelper = new THREE.GridHelper(100, 20);
  scene.add(gridHelper);
}

// 添加光线
function addLight() {
  const positions = [
    { x: 10, y: 10, z: 10 },
    { x: -10, y: 10, z: -10 },
    { x: -30, y: 10, z: 0 },
    { x: 0, y: -10, z: 0 },
  ];
  positions.forEach(pos => {
    const light = new THREE.DirectionalLight('#8fbad3', 1);
    light.position.set(pos.x, pos.y, pos.z);
    scene.add(light);
  });
}

// 循环导入模型
for (let i = 0; i < mtlList.length; i++) {
  initIsland(mtlList[i], objList[i]);
}

// 添加机械臂模型
function initIsland(mtl, obj) {
  // obj解析器
  var objLoader = new OBJLoader();
  // mtl解析器
  var mtlLoader = new MTLLoader();

  mtlLoader.load(`./model/${mtl}`, function (materials) {
    // 将 MaterialCreator 对象应用到材质文件中
    materials.preload();

    // 将解析得到的材质赋值给 objLoader 对象
    objLoader.setMaterials(materials);

    // 加载 OBJ 模型文件
    objLoader.load(`./model/${obj}`, function (obj) {
      // 如果当前模型需要设置父级,父级将会保存到这个变量中,默认位空
      let objNew = null;

      // 获取模型的名称
      let objName = obj.materialLibraries.join('');

      // 获取当前模型对应handConfig对象中的某个配置对象,如果对应的话,就表示需要单独做一些处理
      let objInfo = handConfig.find(item => objName === item.name);

      // 判断是否对应
      if (objInfo) {
        // 创建一个Mesh
        objNew = new THREE.Mesh(new THREE.SphereGeometry(0, 32, 16), new THREE.MeshBasicMaterial({ color: 'rgba(0,0,0,1)' }));
        // 设置Mesh的位置
        objNew.position.set(objInfo.rotation.x, objInfo.rotation.y, objInfo.rotation.z);

        // 上面设置Mesh的位置会物体的位置也移动过去,这里将物体的位置移动回来
        obj.position.set(-objInfo.rotation.x, -objInfo.rotation.y, -objInfo.rotation.z);

        // 给Mesh设置名称,便于后续的查找与操作
        objNew.materialLibraries = [objInfo.name];

        // 将模型添加到Mesh中,这样模型的中心点就会以Mesh的坐标为中心了
        objNew.add(obj);

        // 调用回调函数,便于操作
        objInfo.callback(objNew || obj);
      }

      // 零件模型添加到数组中,便于后续的修改调试
      handList = [...handList, objNew || obj];

      // 加载完所有的模型后调用添加父级子级函数
      if (handList.length === objList.length) {
        // 调用函数,设置父级子级
        addChildren();
      }
    });
  });
}

// 轨道控制器
function initOrbitControls() {
  // 创建轨道控制器
  controls = new OrbitControls(camera, renderer.domElement);
  // 开启阻尼 更加真实
  controls.enableDamping = true;
}

// 初始化
initBase();
// 添加灯光
addLight();
// 添加控制器
initOrbitControls();
// 添加辅助线和网格地板
addHelpLine();

// render渲染器
function render() {
  // 渲染器更新
  renderer.render(scene, camera);
  // 控制器更新
  controls.update();
  requestAnimationFrame(render);
}

onMounted(() => {
  // 将渲染器添加到页面中
  document.body.appendChild(renderer.domElement);
  render();
  // 窗口大小处理
  window.addEventListener('resize', () => {
    // 更新相机宽高比
    camera.aspect = window.innerWidth / window.innerHeight;
    // 更新相机的投影矩阵
    camera.updateProjectionMatrix();
    // 更新渲染器渲染的尺寸大小
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 设置渲染器的像素比(window.devicePixelRatio:当前设备的像素比)
    renderer.setPixelRatio(window.innerWidth / window.innerHeight);
  });
});
</script>

<style>
.btn {
  position: fixed;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
}
</style>
