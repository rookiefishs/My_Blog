<!--
 * @Author: wangZhiyu <w3209605851@163.com>
 * @Date: 2023-12-17 20:27:07
 * @LastEditTime: 2024-08-09 15:11:40
 * @LastEditors: WangZhiyu <w3209605851@163.com>
 * @Descripttion: 
-->
<template>
  <!-- 当前使用的功能 -->
  <div class="btns">
    <el-button disabled :type="controlType === 'control' ? 'primary' : ''">键盘控制模式</el-button>
    <el-button disabled :type="controlType === 'mouse_follow' ? 'primary' : ''">视角跟随相机</el-button>
    <el-button disabled :type="controlType === 'target_point' ? 'primary' : ''">点击移动至指定点</el-button>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
// 导入threejs
import * as THREE from 'three';
// 导入轨道控制器
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// 全局尺寸变化检测
import { listenResize } from './utils/index';
// 导入gltf模型解析器
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// 导入draco解压缩gltf模型解析器
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
// 导入FPS帧率监控
import Stats from 'three/addons/libs/stats.module.js';
// 引入Threejs设置DOM+CSS的实例化方法
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
// 导入动画库
import gsap from 'gsap';

// 初始化场景,相机,渲染器
const scene = new THREE.Scene();
// THREE.PerspectiveCamera(摄像机垂直角度, 摄像机宽高比,摄像机近端面,摄像机远端面);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
// 实例化FPS监控
const stats = new Stats();

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

// 设置摄像机的位置
camera.position.set(0, 83, 90);

// 渲染器
const renderer = new THREE.WebGL1Renderer({ antialias: true });
// 设置渲染器尺寸
renderer.setSize(window.innerWidth, window.innerHeight);
// 设置渲染器颜色
renderer.setClearColor('#a9dfbe');
// 摄像机添加到场景中
scene.add(camera);

// // 创建轨道控制器
// const controls = new OrbitControls(camera, renderer.domElement);
// // 开启阻尼效果
// controls.enableDamping = true;
// // 禁止右键
// controls.enablePan = false;

// 纹理加载器
const textureLoader = new THREE.TextureLoader();

// 地板网格
const gridHelper = new THREE.GridHelper(1000, 10);
scene.add(gridHelper);

// 环境光
const light1 = new THREE.AmbientLight(0xffffff, 2); // 柔和的白光
scene.add(light1);

// 循环生成平行光
const lightArr = [
  {
    x: 10,
    y: 100,
    z: 10,
  },
  {
    x: 20,
    y: 100,
    z: 20,
  },
  {
    x: 30,
    y: 100,
    z: 30,
  },
  {
    x: 40,
    y: 100,
    z: 40,
  },
  {
    x: 50,
    y: 100,
    z: 50,
  },
  {
    x: -10,
    y: 100,
    z: -10,
  },
  {
    x: -20,
    y: 100,
    z: -20,
  },
  {
    x: -30,
    y: 100,
    z: -30,
  },
  {
    x: -40,
    y: 100,
    z: -40,
  },
  {
    x: -50,
    y: 100,
    z: -50,
  },
];
lightArr.forEach(({ x, y, z }) => {
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(x, y, z);
  scene.add(directionalLight);
});

// 人体模型数据
let character = null;

// 问号模型数据
let question = null;

// 当前的控制状态(wasd控制状态:control/指定点状态:target_point/鼠标跟随状态:mouse_follow)
let controlType = ref('mouse_follow');

// 动画示例
let mixer = null;

// 动画列表
let animations = [];

// 当前执行的动画
let currentAnimation = '';

// 线条
let line = null;

// THREEJS的时钟,用于控制动画的时间更新
const clock = new THREE.Clock();

// 加载模型
const loadModel = () => {
  // 实例化解析器
  const gltfLoader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();

  // 设置draco解压glft模型的解析器路径
  dracoLoader.setDecoderPath('./draco/gltf/');

  // 给gltf模型解析器设置解压解析器
  gltfLoader.setDRACOLoader(dracoLoader);

  // 导入人物模型
  gltfLoader.load('./character.glb', model => {
    // 获取模型
    character = model;

    // 设置相机跟随模型
    camera.lookAt(model.scene.position);

    // 调整模型的尺寸以及位置
    character.scene.scale.set(35, 35, 35);

    // 添加名称在模型上方
    addModelName(character.scene);

    // 模型导入场景中
    scene.add(character.scene);

    // 根据模型实例化动画
    mixer = new THREE.AnimationMixer(model.scene);

    // 模型支持的动画列表
    animations = {
      等: mixer.clipAction(character.animations[0]),
      跑: mixer.clipAction(character.animations[1]),
      停: mixer.clipAction(character.animations[2]),
      走: mixer.clipAction(character.animations[3]),
    };

    // 默认首先执行等待动画
    animations['等'].play();

    // 修改当前执行的动画标识为等待
    currentAnimation = '等';
  });

  // 导入问号模型
  gltfLoader.load('./question.glb', model => {
    // 保存模型数据
    question = model.scene;

    // 设置模型的垂直位置
    question.position.y = 20;

    // 设置模型的大小
    question.scale.set(0.05, 0.05, 0.05);

    // 循环设置模型的材质
    question.traverse(function (gltf) {
      // 问号的边框
      if (gltf.name === 'questionmark_05_-_Default_0') gltf.material = new THREE.MeshStandardMaterial({ color: '#1E88E5' });

      // 问号的主体
      if (gltf.name === 'questionmark_03_-_Default_0') {
        // 导入色彩贴图
        let map = textureLoader.load('./color.jpg');
        // 设置色彩贴图重复的模式
        // 水平镜像重复
        map.wrapS = THREE.RepeatWrapping;
        // 垂直镜像重复
        map.wrapT = THREE.MirroredRepeatWrapping;

        // 导入金属贴图
        let metalness = textureLoader.load('./metalness.png');
        // 设置金属贴图重复的模式
        // 水平镜像重复
        metalness.wrapS = THREE.RepeatWrapping;
        // 垂直镜像重复
        metalness.wrapT = THREE.MirroredRepeatWrapping;

        // 设置问号主体模型的材质
        gltf.material = new THREE.MeshStandardMaterial({
          // 默认贴图
          map,
          // 金属程度
          metalness: 1,
          // 金属贴图
          metalnessMap: metalness,
        });
      }
    });

    // 模型添加到场景中
    scene.add(question);

    // 设置模型自动旋转
    setInterval(() => {
      if (question.rotation.y >= Math.PI * 2) question.rotation.y = 0;
      else question.rotation.y += 0.1;
    }, 30);

    // 默认隐藏模型,当触发点击行为时,问号将会出现在点击的位置
    question.visible = false;
  });
};

// 添加模型到指定点之间的线条
const addLine = (startPoint, endPoint) => {
  // 如果线条存在,则默认删除线条(主要是为了实现线条长度更新的效果)
  line && scene.remove(line);

  // 创建线条的几何体，使用起始点和结束点
  const points = [startPoint, endPoint];

  // 创建一个线条
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  // 创建线条的材质
  const material = new THREE.LineBasicMaterial({ color: '#1E88E5' });

  // 创建线条对象
  line = new THREE.Line(geometry, material);

  // 将线条对象添加到场景中
  scene.add(line);

  // 重新计算距离
  const distance = startPoint.distanceTo(endPoint);

  // 在问号模型上更新距离信息
  addDistance(question, distance);

  // 返回线条对象
  return line;
};

// 添加任务模型名称
function addModelName(model) {
  // 创建一个DOM元素
  const modelName = document.createElement('div');
  // 设置div的样式
  modelName.style.color = '#03A9F5';
  modelName.style.fontSize = '25px';
  // 设置DOM元素的内容
  modelName.innerHTML = '人物1';
  // 使用CSS2Object将dom转换为Threejs可操作的对象
  const modelNameThree = new CSS2DObject(modelName);
  // 设置转换为Threejs可以使用的结构后的物体的位置
  modelNameThree.position.set(0, 1.9, 0);
  // 将处理后的对象添加到人物头上
  model.add(modelNameThree);
}

// 距离信息显示3D实例
let distanceThree = null;
// 创建显示距离信息div
const distanceDiv = document.createElement('div');
// 设置距离信息div的样式
distanceDiv.style.color = '#03A9F5';
distanceDiv.style.fontSize = '20px';

// 更新问号上显示的距离
function addDistance(model, distance) {
  // 设置DOM元素的内容(距小于1时不显示,不小于1时显示间隔距离)
  distanceDiv.innerHTML = distance > 1 ? `距离: ${distance.toFixed(2)}` : '';

  // 判断是否已经初始化过了,如果已经创建了此div的Threejs数据,则不需要再次添加
  if (!distanceThree) {
    // 使用CSS2Object将dom转换为Threejs可操作的对象
    const distanceThree = new CSS2DObject(distanceDiv);
    // 设置转换为Threejs可以使用的结构后的物体的位置
    distanceThree.position.set(0, 150, 0);
    // 将处理后的对象添加到问号模型头上
    model.add(distanceThree);
  }
}

// 模型移动动画
const modelMoveTarget = (model, target) => {
  // 当前位置
  let originPositon = new THREE.Vector3(model.position.x, 0, model.position.z);
  // 目标位置
  let targetPositon = new THREE.Vector3(target.x, 0, target.z);
  // 计算移动距离
  let distance = originPositon.distanceTo(targetPositon);

  // 当前距离与目标距离之间的距离差值小于等于1则目标点在当前点的位置,不需要移动
  if (distance <= 1) return;

  // 添加当前点与目标点的线条
  let line = addLine(originPositon, targetPositon);

  // 旋转模型到目标点的方向(指定目标点相对于当前目标点的相对角度)
  model.rotation.y = calculateAngle(originPositon.x, -originPositon.z, targetPositon.x, -targetPositon.z) - Math.PI / 2;

  // 显示问号模型
  question.visible = true;

  // 设置问号模型的位置
  question.position.set(targetPositon.x, 20, targetPositon.z);

  // 距离小于300时执行走动画,大于300时执行跑动画
  const isFar = distance > 300;

  // 记录当前的动画类型
  currentAnimation = isFar ? '跑' : '走';

  // 将等待动画权重降低
  animations['等'].fadeOut(0.2);

  // 执行跑/走动画
  animations[isFar ? '跑' : '走']
    .reset()
    .setEffectiveTimeScale(isFar ? 1 : 2)
    .setEffectiveWeight(1)
    .fadeIn(0.2)
    .play();

  // 使用gsap动画执行运动动画
  gsap.to(model.position, {
    ...targetPositon,
    // 这里配置运动时间与距离挂钩, 距离越远, 运动时间越长
    duration: parseInt(distance) / (isFar ? 50 : 25),
    // 动画轨迹为线性轨迹
    esas: 'none',
    // 动画运动回调
    onUpdate() {
      // 更新线条的距离
      line = addLine(new THREE.Vector3(model.position.x, 0, model.position.z), targetPositon);

      // 当执行的整体进度大于(跑时大于0.95,走时大于0.85)时,则执行动画执行完成回调,这样会有较好的过渡效果
      if (this.progress() >= (isFar ? 0.95 : 0.85) && currentAnimation !== '等') {
        // 停止走/跑运动
        animations[isFar ? '跑' : '走'].fadeOut(0.3);
        // 执行等待动画
        animations['等'].reset().setEffectiveWeight(1).fadeIn(0.1).play();
        // 隐藏问号模型
        question.visible = false;
        // 删除距离线条
        scene.remove(line);

        // 设置控制状态为鼠标控制状态
        controlType.value = 'mouse_follow';
      } else {
        // 设置相机的位置在模型的上方
        camera.position.set(model.position.x, 83, model.position.z + 90);
      }
    },
    // 监听动画执行完成
    onComplete() {
      // 修改当前执行的动画
      currentAnimation = '等';
    },
  });
};

// 计算坐标2相对于坐标1的角度
function calculateAngle(x1, y1, x2, y2) {
  // 计算坐标差值
  const dx = x2 - x1;
  const dy = y2 - y1;

  // 计算角度（弧度值）
  let angleRad = Math.atan2(dy, dx);

  return angleRad; // 直接返回弧度值，即正负π之间的值
}

// 拾取对象
function pickupObjects(event) {
  // wasd控制状态无法移动到指定点
  if (controlType.value === 'control') return ElMessage.warning('当前处于键盘控制状态,无法移动到指定点');

  // 点击屏幕创建光线投射用于进行鼠标拾取
  var raycaster = new THREE.Raycaster();

  // 将鼠标位置归一化为设备坐标. x 和 y 方向的取值范围是 (-1 to +1)
  var vector = new THREE.Vector2();
  vector.x = (event.clientX / window.innerWidth) * 2 - 1;
  vector.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // 创建平面 设置平面法向量Vector3 和 原点到平面距离(这里表示无限平面以Y轴为标准平铺在threejs场景中的)
  var groundplane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

  // 通过相机和鼠标位置更新射线投射器
  raycaster.setFromCamera(vector, camera);

  // 接受射线和平面的交点(也就是鼠标点击的3D坐标)
  var intersectionPoint = new THREE.Vector3();

  // 计算射线和平面的交点
  raycaster.ray.intersectPlane(groundplane, intersectionPoint);

  // intersectionPoint 就是点击位置的世界坐标
  currentAnimation === '等' && modelMoveTarget(character.scene, intersectionPoint);

  // 设置控制状态为移动到指定点
  controlType.value = 'target_point';
}

// 渲染函数
function render() {
  // 更新渲染器
  renderer.render(scene, camera);

  // 更新轨道控制器
  // controls.update();

  // 更新FPS
  stats.update();

  // 渲染 CSS2D 场景
  cssRenderer.render(scene, camera);

  // 获取时钟从创建到当前所使用的时间
  let delta = clock.getDelta();

  // 根据时间差来控制动画的播放
  mixer && mixer.update(delta);

  // 重新渲染
  requestAnimationFrame(render);
}

// 每次移动的距离
const move_distance = 0.5;

onMounted(() => {
  // 开始渲染
  render();

  // 渲染器挂载页面
  document.getElementById('app').appendChild(renderer.domElement);

  // 2D渲染器挂载DOM
  document.getElementById('app').appendChild(cssRenderer.domElement);

  // FPS添加到页面中
  document.getElementById('app').appendChild(stats.dom);

  // 加载模型
  loadModel();

  // 设置全局尺寸监听以及更新
  listenResize({ width: window.innerWidth, height: window.innerHeight }, camera, renderer);

  // 监听点击事件,获取threejs中点击的坐标
  renderer.domElement.addEventListener('click', pickupObjects);

  // 各个key的启用状态
  let keyStatus = {
    w: false,
    a: false,
    s: false,
    d: false,
  };

  // 相机更新定时器
  let cameraTimer = null;

  // 监听全局的鼠标按下方法
  window.addEventListener('keydown', ({ key }) => {
    // 模型未加载成功不处理
    if (!character) return;

    // 将key转换为小写,避免大写的WASD无法操作
    key = key.toLowerCase();

    // 判断是否点击了wasd
    if (!'wasd'.includes(key)) return;

    // 判断当前是否为移动到指定点状态
    if (controlType.value === 'target_point') return ElMessage.warning('当前正在移动到指定点,无法使用键盘控制');

    // 保存当前模型的坐标
    let position = { ...character.scene.position };

    // 设置控制状态为wasd移动状态
    controlType.value = 'control';

    // 当点击w时,自动取消掉s的移动
    key === 'w' && (keyStatus['s'] = false);
    // 当点击a时,自动取消掉d的移动
    key === 'a' && (keyStatus['d'] = false);
    // 当点击d时,自动取消掉a的移动
    key === 's' && (keyStatus['w'] = false);
    // 当点击s时,自动取消掉w的移动
    key === 'd' && (keyStatus['a'] = false);

    // 获取当前按下的按钮移动状态,如果当前按钮的按钮正在移动时,则不允许再次启动移动
    if (keyStatus[key]) return;

    // 将当前按下的按钮的状态改为true
    keyStatus[key] = true;

    // 首先清除一次相机更新定时器
    clearInterval(cameraTimer);

    // 添加相机更新
    cameraTimer = setInterval(() => {
      // 开启w按钮定时器
      keyStatus['w'] && (position.z -= move_distance);
      keyStatus['a'] && (position.x -= move_distance);
      keyStatus['d'] && (position.x += move_distance);
      keyStatus['s'] && (position.z += move_distance);

      // 解构获取移动后的坐标
      let { x, y, z } = position;

      // 更新模型的朝向(这里character.scene.position还没更新,所以还是之前的位置)
      character.scene.rotation.y = calculateAngle(character.scene.position.x, -character.scene.position.z, position.x, -position.z) - Math.PI / 2;

      // 更新位置
      character.scene.position.set(x, y, z);

      // 获取模型的位置
      const modelPosition = character.scene.position;
      // 设置相机的位置在模型的上方
      camera.position.set(modelPosition.x, 83, modelPosition.z + 90);
      // 确保相机始终朝向模型
      camera.lookAt(modelPosition);
    });

    // 执行走动画
    animations['走'].reset().setEffectiveTimeScale(1).setEffectiveWeight(1).fadeIn(0.2).play();
  });

  // 监听键盘抬起事件
  window.addEventListener('keyup', ({ key }) => {
    // 判断当前是否为移动到指定点状态
    if (controlType.value === 'target_point') return;

    // 模型未加载成功不处理
    if (!character) return;

    // 将key转换为小写,避免大写的WASD无法操作
    key = key.toLowerCase();

    // 设置对应按钮可继续操作
    keyStatus[key] = false;

    // 所有按钮都被松开
    if (!keyStatus.w && !keyStatus.a && !keyStatus.s && !keyStatus.d) {
      // 设置控制状态为鼠标跟随状态
      controlType.value = 'mouse_follow';

      // 清除相机更新定时器
      clearInterval(cameraTimer);

      // 停止走/跑运动
      animations['走'].fadeOut(0.3);

      // 执行等待动画
      animations['等'].reset().setEffectiveWeight(1).fadeIn(0.1).play();
    }
  });

  // 创建一个二维向量,存储xy
  const mouse = new THREE.Vector2();

  // 监听鼠标移动事件
  window.addEventListener(
    'mousemove',
    e => {
      // 非鼠标控制视图模式不触发
      if (controlType.value === 'target_point' || controlType.value === 'control') return;

      // 获取鼠标位置
      mouse.x = ((e.clientX / window.innerWidth) * 2 - 1) * 100;
      mouse.y = (-(e.clientY / window.innerHeight) * 2 + 1) * 100;

      // 将相机聚焦到这个点
      camera.lookAt(mouse.x + camera.position.x, mouse.y + camera.position.y, camera.position.z - 50);

      // 修改当前的控制状态为鼠标跟随状态
      controlType.value = 'mouse_follow';
    },
    false
  );
});
</script>

<style scoped>
.btns {
  position: fixed;
  top: 1%;
  left: 5%;
}
</style>
