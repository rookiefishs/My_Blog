<!--
 * @Author: wangZhiyu <w3209605851@163.com>
 * @Date: 2024-05-09 15:27:54
 * @LastEditTime: 2024-05-12 00:42:07
 * @LastEditors: wangZhiyu <w3209605851@163.com>
-->
<template>
  <div class="boxList">
    <div class="boxItem" v-for="item in boxNum">
      <img v-if="item.type" :src="cubeImg[item.type]" alt="" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
// 导入THREEJS
import * as THREE from 'three';
// 导入THREEJS的控制器
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// THREEJS的性能监视器
import Stats from 'three/examples/jsm/libs/stats.module.js';
// 辅助方法,用于监听页面尺寸变化,实时更新3D场景
import { listenResize } from './utils/index';
// Debugger工具
import * as dat from 'lil-gui';
// 在3D场景中进行物理世界的第三方库
import * as CANNON from 'cannon-es';
// 物理世界Debugger调试工具
import CannonDebugger from 'cannon-es-debugger';
import { ElMessageBox } from 'element-plus';

// 圆柱体图片
import cylinderImg from './assets/image/cylinder.png';
// 立方体图片
import boxImg from './assets/image/box.png';
// 球体
import sphereImg from './assets/image/sphere.png';

// 存放物理世界模型与3D世界模型的盒子尺寸
const boxSize = 10;

// 可以存放获取的方格的盒子数量
let boxNum = ref([
  // {
  //   // 存放的物体类型 圆柱/球体/立方体
  //   type: '',
  // },
  // {
  //   // 存放的物体类型 圆柱/球体/立方体
  //   type: '',
  // },
  {
    // 存放的物体类型 圆柱/球体/立方体
    type: '',
  },
  {
    // 存放的物体类型 圆柱/球体/立方体
    type: '',
  },
  {
    // 存放的物体类型 圆柱/球体/立方体
    type: '',
  },
  {
    // 存放的物体类型 圆柱/球体/立方体
    type: '',
  },
  {
    // 存放的物体类型 圆柱/球体/立方体
    type: '',
  },
]);

// 不同立方体所代表的图片
const cubeImg = {
  cylinder: cylinderImg,
  box: boxImg,
  sphere: sphereImg,
};

// 创建性能监视器
let stats = new Stats();

// 存储实时生成的物理世界+3D场景模型
let objectsToUpdate = [];
// 创建一个THREE的Group,存放生成的模型,便于后续识别点击的范围
const group = new THREE.Group();

// 创建物理世界
const world = new CANNON.World();
// 设置物理世界的重力,这里表示物理世界的Y轴方向被施加了-100(这里仅仅只是为了初识时的效果,后续会修改重力加速度)的重力加速度,这会使物体在模拟中收到重力的影响而产生下落的效果
world.gravity.set(0, -100, 0);
// 这里设置了物理世界的广相位算法,用于加速碰撞检测,可以有效的减少需要检测碰撞的物体的数量,提高模拟的性能
world.broadphase = new CANNON.SAPBroadphase(world);
// 禁用物理世界刚体的休眠功能,当刚体处于静止状态时,Cannon.js会将其设置为修改状态,虽然这样会减少计算量,提高性能,但是这就表示一旦物体停止移动,就不会收到物理世界的影响,例如下落等行为
world.allowSleep = false;

// 创建场景
const scene = new THREE.Scene();
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
// 指定相机在场景中的位置
camera.position.set(6.54, 17.57, 0);
// 将相机以及生成的模型添加到场景中
scene.add(camera, group);

// TODO: 创建一个光线投射实例化对象,光线投射用于鼠标拾取(在三维空间中计算鼠标移动经过了那些物体)
const raycaster = new THREE.Raycaster();
// 鼠标位置归一化之后的设备坐标
const pointer = new THREE.Vector2();

// 创建渲染器,并且配置使用抗锯齿
const renderer = new THREE.WebGLRenderer({ antialias: true });
// 指定渲染器的尺寸
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启渲染器的阴影映射功能
renderer.shadowMap.enabled = true;

// 创建一个默认的物理世界的材质
const defaultMaterial = new CANNON.Material('default');
// 创建实时生成的立方体的默认材质
const material = new THREE.MeshStandardMaterial();

// 创建3D场景控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置场景控制器的自动旋转
controls.autoRotate = false;
// 启用场景控制器的阻尼效果
controls.enableDamping = true;
// 设置场景控制器的缩放速度
controls.zoomSpeed = 0.3;
// 设置控制器的目标点,控制器将会根据此目标点进行旋转,缩放等操作
controls.target = new THREE.Vector3(0, 3, 0);

// 创建实时调试工具
const gui = new dat.GUI();
// 默认关闭调试器
gui.close()
// 调试工具内容
const guiObj = {
  // 是否开启物理世界调试工具
  CannonDebugger: false,
  // 创建一个圆形
  createSphere() {},
  // 创建一个盒子
  createBox() {},
  // 创建一个圆柱
  createCylinders() {},
  // 清除所有创建的3D场景中的立方体与物理世界中的物理模型
  reset() {},
};

// 创建物理世界的调试工具
const cannonDebugger = CannonDebugger(scene, world, {
  // 监听创建物理世界中的3D模型
  onInit(body, mesh) {
    // 根据配置控制是否显示物理世界中的3D模型
    mesh.visible = guiObj.CannonDebugger;
  },
});

// 创建3D世界中的平面,与物理世界的平面一起形成一个开口的盒子
function initPlaneBox() {
  // 创建3D场景的平面的配置
  const planeData = {
    // 平面尺寸
    size: boxSize,
    // 平面颜色
    color: 0xffffff,
    // 旋转/缩放/位置 变换
    transform: [
      {
        // 平面的角度设置
        rotation: [-Math.PI / 2, 0, 0],
        // 平面的位置设置
        position: null,
      },
      {
        rotation: null,
        position: [0.5, boxSize / 2, -boxSize / 2],
      },
      {
        rotation: [0, -Math.PI, 0],
        position: [0.5, boxSize / 2, boxSize / 2],
      },
      { rotation: [0, -Math.PI / 2, 0], position: [boxSize / 2, boxSize / 2, 0] },
      { depth: 1, rotation: [0, Math.PI / 2, 0], position: [-boxSize / 2, boxSize / 2, 0] },
    ],
  };

  // 循环配置,生成3D立方体(平面)
  planeData.transform.forEach(item => {
    // 创建3D场景中的平面,用于表示分隔板
    const plane = new THREE.Mesh(
      // 创建平面立方体
      new THREE.BoxGeometry(planeData.size + (item.depth || 0), planeData.size, 1),
      // 创建平面材质
      new THREE.MeshStandardMaterial({
        color: planeData.color,
        side: THREE.DoubleSide,
      })
    );
    plane.name = 'plane';

    // 设置平面的位置
    item.position && plane.position.set(...item.position);
    // 设置平面的旋转角度
    item.rotation && plane.rotation.set(...item.rotation);
    // 设置平面反射阴影
    plane.receiveShadow = true;
    // 将平面添加到场景中
    scene.add(plane);
  });
}
initPlaneBox();

// 创建全局平行光以及平行光的辅助对象
function initLight() {
  // 创建平行光
  const directionLight = new THREE.DirectionalLight();
  // 设置平行光投射阴影
  directionLight.castShadow = true;
  // 设置平行光的位置
  directionLight.position.set(5, 5, 6);

  // 设置平行光相机离视锥体的近端的距离
  directionLight.shadow.camera.near = 1;
  // 设置平行光相机离视锥体的远端的距离
  directionLight.shadow.camera.far = 20;
  // 设置阴影相机视锥体的顶部距离
  directionLight.shadow.camera.top = 10;
  // 设置阴影相机视锥体的右侧距离
  directionLight.shadow.camera.right = 10;
  // 设置阴影相机视锥体的底部距离
  directionLight.shadow.camera.bottom = -10;
  // 设置阴影相机视锥体的左侧距离
  directionLight.shadow.camera.left = -10;

  // 创建环境光
  const ambientLight = new THREE.AmbientLight(new THREE.Color('#ffffff'), 0.4);

  // 添加环境光+平行光到场景中
  scene.add(ambientLight, directionLight);
}
initLight();

// 创建物理世界的平面,语D世界中的平面一起形成一个开口的盒子
function initPhysicalWorldPlane() {
  // 创建一个默认的接触材质实例
  const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
    // 摩擦系数
    friction: 0.3,
    // 弹性
    restitution: 0.3,
  });

  // 将接触材质应用于物理世界中,可以确保在模拟中正确的处理物体之间的碰撞,并根据定义的接触材质来模拟碰撞效果
  world.addContactMaterial(defaultContactMaterial);

  // 创建物理世界中的平面形状(因为Cannon中的平面是无限延伸的,所以这里使用一个盒子来替代,盒子的厚度为0.5,很薄,模拟出平面的效果)
  // const floorShape = new CANNON.Box(new CANNON.Vec3(boxSize / 2, boxSize / 2, 0.05));
  const floorShape = new CANNON.Plane();

  // 设置物理世界中的物体配置
  const cannonBodyData = {
    // 设置物体的类型,CANNON.Body.STATIC表示此物体是一个静态物体,表示它的位置不会改变,也不会收到力的作用,通常用来表示地面或者墙壁灯不会移动的物体
    type: CANNON.Body.STATIC,
    // 指定物体的形状
    shape: floorShape,
    // 指定物体的材质
    material: defaultMaterial,
    // 旋转/缩放/位置 变换
    transform: [
      {
        axis: {
          rotation: [1, 0, 0],
          angle: -Math.PI / 2,
        },
        position: [0, -0.05, 0],
      },
      {
        axis: null,
        position: [0, boxSize / 2, -(boxSize / 2)],
      },
      {
        axis: {
          rotation: [0, 1, 0],
          angle: -Math.PI,
        },
        position: [0, boxSize / 2, boxSize / 2],
      },
      {
        axis: {
          rotation: [0, 1, 0],
          angle: -Math.PI / 2,
        },
        position: [boxSize / 2, boxSize / 2, 0],
      },
      {
        axis: {
          rotation: [0, 1, 0],
          angle: Math.PI / 2,
        },
        position: [-(boxSize / 2), boxSize / 2, 0],
      },
    ],
  };

  // 循环生成物理世界中的物体
  cannonBodyData.transform.forEach(item => {
    // 创建物理世界中的物体
    const floorBody = new CANNON.Body({
      type: cannonBodyData.type,
      shape: cannonBodyData.shape,
      material: cannonBodyData.material,
    });
    // 设置物体旋转的角度
    item.axis && floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(...item.axis.rotation), item.axis.angle);

    // 设置物体的位置
    item.position && floorBody.position.set(...item.position);

    // 将物体添加到
    world.addBody(floorBody);
  });
}
initPhysicalWorldPlane();

// 创建一个3D场景中的小球
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

// 生成一个物理环境与3D环境的小球
const createSphere = radius => {
  // 创建实时生成的立方体的默认材质
  const material = new THREE.MeshStandardMaterial({ color: '#3F51B5' });
  // 创建一个小球模型
  const mesh = new THREE.Mesh(sphereGeometry, material);
  // 设置小球投射阴影
  mesh.castShadow = true;
  // 设置小球的尺寸
  mesh.scale.set(radius, radius, radius);
  // 设置小球下落的位置
  const position = new THREE.Vector3(getRandomNumber(-boxSize / 2 - 0.3, boxSize / 2 - 0.3), boxSize, getRandomNumber(-boxSize / 2 - 0.3, boxSize / 2 - 0.3));
  // 设置3D环境的小球的位置
  mesh.position.copy(position);

  // 将小球添加到3D场景的group中
  group.add(mesh);

  // 创建物理环境中的小球(物理环境中的小球要求与真实环境中的小球一样大小,所以上面设置了小球的scale)
  const shape = new CANNON.Sphere(radius);
  // 获取3D世界的盒子的顶点信息
  // const vertices = sphereGeometry.attributes.position.array;
  // 获取3D世界的盒子的三角面数据
  // const indices = sphereGeometry.index.array;

  // 使用盒子的顶点与三角面的信息生成一个物理世界的盒子
  // const shape = new CANNON.Trimesh(vertices, indices);

  // 设置物理环境中小球物体
  const body = new CANNON.Body({
    mass: 1,
    shape,
    material: defaultMaterial,
  });

  // 设置物理世界的小球物体与3D场景的小球物体在同一个位置
  body.position.copy(position);

  // 将小球添加到物理世界中
  world.addBody(body);

  // 将3D世界中的物体和物理世界的物体添加到数组中,方便统一处理
  objectsToUpdate.push({
    mesh,
    body,
    name: 'sphere',
  });

  // 监听物理世界中的小球落地回调事件
  body.addEventListener('collide', () => {
    // console.log('碰撞');
  });
};

// 创建一个3D场景中的盒子
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

// 生成一个物理环境与3D环境的盒子
const createBoxes = (width, height, depth) => {
  // 创建实时生成的立方体的默认材质
  const material = new THREE.MeshStandardMaterial({ color: '#3F51B5' });
  // 创建一个盒子模型
  const mesh = new THREE.Mesh(boxGeometry, material);
  // 设置盒子投射阴影
  mesh.castShadow = true;
  // 设置盒子的尺寸
  mesh.scale.set(width, height, depth);
  // 设置盒子下落的位置
  const position = new THREE.Vector3(getRandomNumber(-boxSize / 2 - 0.3, boxSize / 2 - 0.3), boxSize, getRandomNumber(-boxSize / 2 - 0.3, boxSize / 2 - 0.3));
  // 设置3D环境的盒子的位置
  mesh.position.copy(position);
  // 盒子添加到3D环境的group中
  group.add(mesh);
  // 创建一个3D环境中的盒子
  const shape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));

  // 获取3D世界的盒子的顶点信息
  // const vertices = boxGeometry.attributes.position.array;

  // 获取3D世界的盒子的三角面数据
  // const indices = boxGeometry.index.array;

  // 使用盒子的顶点与三角面的信息生成一个物理世界的盒子
  // const shape = new CANNON.ConvexPolyhedron(vertices, indices);

  // 设置物理环境中盒子物体
  const body = new CANNON.Body({
    mass: 1,
    shape,
    material: defaultMaterial,
  });

  // 设置物理世界的盒子物体与3D场景的盒子物体在同一个位置
  body.position.copy(position);

  // 将盒子添加到物理世界中
  world.addBody(body);

  // 将3D世界中的物体和物理世界的物体添加到数组中,方便统一处理
  objectsToUpdate.push({
    mesh,
    body,
    name: 'box',
  });

  // 监听物理世界中的盒子落地回调事件
  body.addEventListener('collide', () => {
    // console.log('碰撞');
  });
};

// 创建一个3D场景中的圆柱体
const cylinder = new THREE.CylinderGeometry(1, 1, 1, 10, 6);

// 生成一个物理环境与3D环境的圆柱
const createCylinders = size => {
  // 创建实时生成的立方体的默认材质
  const material = new THREE.MeshStandardMaterial({ color: '#3F51B5' });
  // 创建一个圆柱模型
  const mesh = new THREE.Mesh(cylinder, material);
  // 设置圆柱投射阴影
  mesh.castShadow = true;
  // 设置圆柱的尺寸
  mesh.scale.set(size, size, size);
  // 设置圆柱下落的位置
  const position = new THREE.Vector3(getRandomNumber(-boxSize / 2 - 0.3, boxSize / 2 - 0.3), boxSize, getRandomNumber(-boxSize / 2 - 0.3, boxSize / 2 - 0.3));
  // 设置3D环境的圆柱的位置
  mesh.position.copy(position);
  // 圆柱添加到3D环境的group中
  group.add(mesh);

  // 创建一个3D环境中的圆柱体
  const shape = new CANNON.Cylinder(0.5, 0.5, 1, 10);

  // 设置物理环境中圆柱物体
  const body = new CANNON.Body({
    mass: 1,
    shape,
    material: defaultMaterial,
  });

  // 设置物理世界的圆柱物体与3D场景的圆柱物体在同一个位置
  body.position.copy(position);

  // 将圆柱添加到物理世界中
  world.addBody(body);

  // 将3D世界中的物体和物理世界的物体添加到数组中,方便统一处理
  objectsToUpdate.push({
    mesh,
    body,
    name: 'cylinder',
  });

  // 监听物理世界中的圆柱落地回调事件
  body.addEventListener('collide', () => {
    // console.log('碰撞');
  });
};

// 生成物体对象的数量(注意,数量会*3,因为最终的要求是生成的物体的数量要被三整除)
const meshNum = 20 * 3; // 90个圆柱 球体 正方体

// 当前生成的物体数量
let currentNum = 0;
let timer = setInterval(() => {
  // 当前生成的物体数量与限制的生成物体的数量一致时,停止生成物体
  if (currentNum === meshNum) {
    // 修改物理世界的重力
    world.gravity.set(0, -9.82, 0);

    return clearInterval(timer);
  }
  // 更新当前生成的物体数量
  currentNum += 1;

  // 生成圆柱立方体(物流世界与3D世界一起生成)
  createCylinders(1);
  // 生成球体立方体(物流世界与3D世界一起生成)
  createSphere(1);
  // 生成立方体(物流世界与3D世界一起生成)
  createBoxes(1, 1, 1);
}, 30);

// 重置3D环境与物理环境
guiObj.reset = () => {
  // 循环已添加的物体
  objectsToUpdate.forEach(object => {
    // 清除监听落地事件
    object.body.removeEventListener('collide', () => {
      console.log('清除监听落地事件');
    });
    // 在物理世界中移除物体
    world.removeBody(object.body);
    // 在3D世界中移除物体
    group.remove(object.mesh);
  });

  // 清除已添加物体列表,表示当前没有任何已添加的物体
  objectsToUpdate.splice(0, objectsToUpdate.length);
};

// 将生成物理环境与3D环境的小球的方法添加到debuggerUI中,方便使用
guiObj.createSphere = () => {
  createSphere(1);
};

// 将生成物理环境与3D环境的盒子的方法添加到debuggerUI中,方便使用
guiObj.createBox = () => {
  createBoxes(1, 1, 1);
};

// 将生成物理环境与3D环境的圆柱的方法添加到debuggerUI中,方便使用
guiObj.createCylinders = () => {
  createCylinders(1);
};

// 控制场景控制器开启/关闭自动旋转
gui.add(controls, 'autoRotate');

// 设置添加的物体显示格式为线框
gui.add(material, 'wireframe');

// 控制物理世界中的模型显示/隐藏
gui
  .add(guiObj, 'CannonDebugger')
  .name('CannonDebugger mesh visible')
  .onChange(value => {
    guiObj.CannonDebugger = value;
  });

// 添加小球物体
gui.add(guiObj, 'createSphere');
// 添加盒子物体
gui.add(guiObj, 'createBox');
// 添加圆柱物体
gui.add(guiObj, 'createCylinders');
// 清空物体
gui.add(guiObj, 'reset');

// 渲染 渲染器
function render() {
  // 更新物理世界的debugger工具的网格显示(物理世界的物体显示状态)
  cannonDebugger.update();

  // 计算物体的位置,速度,碰撞等属性,从而进行物理仿真
  world.fixedStep();

  // 执行渲染器渲染
  renderer.render(scene, camera);

  // 更新帧数
  stats.update();

  // 更新控制器
  controls.update();

  // 更新3D世界与物理世界中的物体的位置
  objectsToUpdate.forEach(object => {
    object.mesh.position.copy(object.body.position);
    object.mesh.quaternion.copy(object.body.quaternion);
  });

  // 下一帧渲染中重新执行此函数
  requestAnimationFrame(render);
}

// 生成一个从min到max的随机数
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// 节流
function throttle(func, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    func(...args);
  };
}

// 游戏处理逻辑
const gameFunc = target => {
  // 获取当前第一个没有保存的type的盒子
  const box = boxNum.value.find(item => !item.type);

  // 设置盒子的type,表示了盒子中存放的3D物体类型
  box.type = target.name;

  // 获取与当前类型相同的其他类型
  const sameType = boxNum.value.filter(item => item.type === target.name);

  // 如果发现相同类型的数量等于三个,则对相同类型的图形进行清除
  if (sameType.length === 3) {
    sameType.forEach(item => {
      item.type = '';
    });
  }

  // 物理世界中移除模型
  world.removeBody(target.body);
  // 3D世界中移除模型
  group.remove(target.mesh);

  // 获取剩余的盒子数量
  let surplusBox = boxNum.value.filter(item => !item.type).length;

  // 如果还有剩余的空盒子
  if (surplusBox > 0) {
    // 从存储物体的数组中移除
    objectsToUpdate = objectsToUpdate.filter(item => item.mesh.uuid !== target.mesh.uuid);

    // 判断物体是否被全部清除
    if (objectsToUpdate.length == 0) {
      alert('您已全部通关!');
    }

    // 没有空余的空盒子了
  } else {
    ElMessageBox.alert('游戏失败', '提示', {
      showClose: false,
      confirmButtonText: '确定',
      callback: () => {
        // 重置所有颜色
        objectsToUpdate.forEach(item => {
          // 将所有红色的物体重置颜色
          if (item.mesh.material.color.getHexString() === 'ff0000') {
            item.mesh.material.color.set(new THREE.Color('#3F51B5'));
          }
        });

        // 清空选择的物体列表
        boxNum.value.forEach(item => {
          item.type = '';
        });
      },
    });
  }
};

// 监听场景DOM加载完毕
onMounted(() => {
  // 开始渲染器渲染
  render();

  // 将渲染器以及性能监视器添加到dom中
  document.getElementById('app').appendChild(renderer.domElement);
  document.getElementById('app').appendChild(stats.domElement);

  // 检测窗口大小变化,更新3D场景视图
  listenResize({ width: window.innerWidth, height: window.innerHeight }, camera, renderer);

  // 监听鼠标点击
  window.addEventListener('click', event => {
    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // 使用setFromCamera方法通过摄像机和鼠标位置更新射线
    raycaster.setFromCamera(pointer, camera);

    // 计算物体和射线的焦点,第一个参数表示需要检测与射线相交(即当前鼠标移动到此模型上)的物体,第二个参数表示是否检测所有物体的后台,否则只检测对象本身的相交部分
    const intersects = raycaster.intersectObjects(scene.children);

    // 判断是否有相交的物体
    if (intersects.length > 0) {
      // 获取第一个相交的物体，即被点击的物体
      const clickedObject = intersects[0].object;

      // 判断当前选中的物体是否为group的子级(为大盒子中的子物体)
      const isGroupChildren = group.children.find(item => item.uuid === clickedObject.uuid);

      // 当前点击的物体非盒子内的物体不生效
      if (!isGroupChildren) return;

      // 获取点击的3D模型的物理世界模型与3D立方体模型
      let target = objectsToUpdate.find(item => item.mesh.uuid === clickedObject.uuid);

      // 执行游戏处理逻辑
      gameFunc(target);
    }
  });

  // 鼠标移动回调函数
  const mouseMoveFn = event => {
    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // 使用setFromCamera方法通过摄像机和鼠标位置更新射线
    raycaster.setFromCamera(pointer, camera);

    // 计算物体和射线的焦点,第一个参数表示需要检测与射线相交(即当前鼠标移动到此模型上)的物体,第二个参数表示是否检测所有物体的后台,否则只检测对象本身的相交部分
    const intersects = raycaster.intersectObjects(scene.children);

    // 判断是否有相交的物体
    if (intersects.length > 0) {
      // 获取第一个相交的物体，即被点击的物体
      const clickedObject = intersects[0].object;

      // 判断当前选中的物体是否为group的子级(为大盒子中的子物体)
      const isGroupChildren = group.children.find(item => item.uuid === clickedObject.uuid);

      // 设置所有的物体的材质为灰色
      objectsToUpdate.forEach(item => {
        if (item.mesh.material.color.getHexString() === 'ff0000') {
          // 重置颜色
          item.mesh.material.color.set(new THREE.Color('#3F51B5'));
        }

        // 当前选中的物体是group的子级
        if (isGroupChildren) {
          // 高亮显示当前选中的物体
          clickedObject.material.color.set(new THREE.Color('#f00'));
        }
      });
    }
  };

  // 节流处理的鼠标移动回调函数
  const mouseMoveFnThrottled = throttle(mouseMoveFn, 10);

  // 监听鼠标移动
  window.addEventListener('mousemove', mouseMoveFnThrottled);
});
</script>

<style lang="scss">
.boxList {
  position: absolute;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgb(209, 208, 208);
  padding: 15px;
  box-sizing: border-box;
  border-radius: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .boxItem {
    width: 8vmin;
    height: 8vmin;
    background-color: #fff;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    margin: 0 10px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
