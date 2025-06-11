<template>
  <div id="liveView" class="videoView">
    <video id="webcam" autoplay playsinline></video>
    <canvas class="output_canvas" id="output_canvas"></canvas>
  </div>
  <div class="imgInfo">
    <p>识别到的手势:{{ videoGestureInfo.categoryName }}</p>
    <p>相似度:{{ videoGestureInfo.categoryScore }}</p>
    <p>左右手:{{ videoGestureInfo.handedness }}</p>
  </div>
</template>

<script setup>
import { GestureRecognizer, FilesetResolver, DrawingUtils } from './tasks-version@0.10.3.js';

// 手势识别器实例
let gestureRecognizer;

// 识别器识别的类型(图片/视频)
const runningMode = ref();

// 视频手势信息
const videoGestureInfo = ref({});

// 手势枚举
const enumGesture = {
  Closed_Fist: '握紧拳头',
  Open_Palm: '张开手掌',
  Thumb_Up: '竖起大拇指',
  Thumb_Down: '拇指朝下',
  Pointing_Up: '指向上',
  Victory: '胜利',
  None: '未识别',
};

// 创建手势识别器
const createGestureRecognizer = async () => {
  // 加载指定版本的MediaPipe视觉任务WebAssembly模块
  const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm');

  // 创建了一个手势识别器实例(这个手势识别器实例使用的是指定版本的MediaPipe视觉任务WebAssembly模块)
  gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    // 识别器配置
    baseOptions: {
      // 指向手势识别模型的路径
      modelAssetPath: './gesture_recognizer.task',
      // 设置为GPU以尝试利用图形处理单元进行加速,提高模型推理的速度
      delegate: 'GPU',
    },
    // 检测手掌的数量
    numHands: 2,
  });

  console.log('手势识别器加载完毕');
  // 识别视频中的手势
  predictWebcam();
};

// 识别视频中的手势
const predictWebcam = async () => {
  // 判断是否可以使用摄像头
  if (!hasGetUserMedia()) return alert('此设备不允许使用摄像头!');
  // 判断手势识别器是否加载完成
  if (!gestureRecognizer) return alert('手势识别器未加载完成');

  if (runningMode.value !== 'VIDEO') {
    // 设置识别器识别的类型为视频
    runningMode.value = 'VIDEO';
    await gestureRecognizer.setOptions({ runningMode: runningMode.value });
  }

  await gestureRecognizer.setOptions({ numHands: 2 });

  nextTick(() => {
    // 获取video元素
    const video = document.getElementById('webcam');
    // 获取视频手势节点绘制的canvas元素
    const canvasElement = document.getElementById('output_canvas');
    // 设置canvas的宽度和高度为video的宽度和高度
    canvasElement.width = video.clientWidth;
    canvasElement.height = video.clientHeight;
    // 获取canvas的上下文
    const canvasCtx = canvasElement.getContext('2d');

    // 设置上次识别视频手势的时间
    let lastVideoTime = -1;

    // 识别视频中的手势
    const predictWebcam = () => {
      // 获取当前视频的时间
      let nowInMs = Date.now();
      let results = {};

      // 如果视频的时间发生变化,则识别视频中的手势
      if (video.currentTime !== lastVideoTime) {
        // 替换上次识别视频手势的时间
        lastVideoTime = video.currentTime;
        results = gestureRecognizer.recognizeForVideo(video, nowInMs);
      }

      // 保存当前的canvas状态
      canvasCtx.save();
      // 清除canvas的内容
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

      // 创建drawingUtils实例,用于可视化MediaPipeVision任务的结果
      const drawingUtils = new DrawingUtils(canvasCtx);
      // 判断是否识别到手势
      if (results.landmarks) {
        // 循环绘制手势的节点
        for (const landmarks of results.landmarks) {
          // 绘制手势连接线
          drawingUtils.drawConnectors(landmarks, GestureRecognizer.HAND_CONNECTIONS, {
            // 连接线的颜色
            color: '#00FF00',
            // 连接线的宽度
            lineWidth: 3,
          });
          // 绘制手势关节点
          drawingUtils.drawLandmarks(landmarks, {
            // 关节点的颜色
            color: '#FF0000',
            // 关节点的半径
            radius: 2.5,
          });
        }
      }
      // 恢复canvas的状态
      canvasCtx.restore();

      // 判断是否识别到手势数据
      if (results?.gestures?.length > 0) {
        videoGestureInfo.value.categoryName = enumGesture[results.gestures[0][0].categoryName];
        videoGestureInfo.value.categoryScore = parseFloat(results.gestures[0][0].score * 100).toFixed(2);
        videoGestureInfo.value.handedness = results.handednesses[0][0].displayName;
      } else {
        videoGestureInfo.value.categoryName = '';
        videoGestureInfo.value.categoryScore = '';
        videoGestureInfo.value.handedness = '';
      }

      // 递归调用,继续识别视频中的手势
      requestAnimationFrame(predictWebcam);
    };

    // 打开摄像头
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      // 视频流添加到video元素中
      video.srcObject = stream;
      // 绑定视频加载完成事件,开始识别视频中的手势
      video.addEventListener('loadeddata', predictWebcam);
    });
  });
};

// 判断是否可以使用摄像头
function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

onMounted(() => {
  // 加载手势识别器
  createGestureRecognizer();
});
</script>
<style lang="scss" scoped>
video {
  clear: both;
  display: block;
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg);
  -moz-transform: rotateY(180deg);
  width: 100vw;
  height: 100vh;
}

.imgInfo {
  position: fixed;
  top: 0;
  left: 0;
  color: #fff;
  p {
    margin: 10px 0;
  }
}

.videoView {
  display: flex;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  #webcam {
    margin: 0 auto;
    width: 1250px;
    height: 100%;
  }
}

.canvas {
  z-index: 1;
  position: absolute;
  pointer-events: none;
}

.output_canvas {
  position: absolute;
  top: 0;
  margin: 0 auto;
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg);
  -moz-transform: rotateY(180deg);
}

.output {
  display: none;
  width: 100%;
  font-size: calc(8px + 1.2vw);
}
</style>
