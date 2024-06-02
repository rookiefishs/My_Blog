/*
 * @Author: wangZhiyu <w3209605851@163.com>
 * @Date: 2024-05-10 08:58:56
 * @LastEditTime: 2024-05-10 09:06:56
 * @LastEditors: wangZhiyu <w3209605851@163.com>
 * @FilePath: \threejs_demo\src\utils\index.js
 * @Descripttion: 
 * Copyright (c) 2024 by 塔比星/王志宇, All Rights Reserved. 
 */
import { PerspectiveCamera, WebGLRenderer } from 'three'

/**
 * 监听 resize 事件,对3D视图进行更新
 */
export const listenResize = (sizes, camera, renderer) => {
  window.addEventListener('resize', () => {
    // 更新页面尺寸
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // 更新相机
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // 更新渲染器
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })
}

/**
 * 全屏展示效果
 */
export const setFullScreen = (canvas) => {
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
  if (fullscreenElement) {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else {
      document.webkitExitFullscreen()
    }
  } else {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen()
    } else {
      canvas.webkitRequestFullscreen()
    }
  }
}

/**
 * 监听双击事件,自动调用全屏方法
 */
export const dbClkfullScreen = (canvas) => {
  window.addEventListener('dblclick', () => {
    setFullScreen(canvas)
  })
}
