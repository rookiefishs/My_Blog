/* 
 * @Author: wangzhiyu <w19165802736@163.com>
 * @version: 0.0.0
 * @Date: 2024-04-04 23:00:32
 * @LastEditTime: 2024-04-05 00:07:16
 * @Descripttion: electron入口文件
*/
// !: 这里的electron.js将会在node环境下运行

const path = require('path')

// 导入electronAPI
const { app, BrowserWindow, Menu, ipcMain } = require('electron');

// 初始化桌面端应用
function createWindow() {
  // TODO: 根据不同环境设置不同的应用配置
  const isDev = process.env.IS_DEV === 'true'

  // 主窗口
  let mainWindow = null

  // 如果当前为开发环境,则执行开发环境的配置
  if (isDev) {
    // 根据不同环境设置不同的应用配置
    mainWindow = new BrowserWindow({
      fullscreenable: false,
      fullscreen: false,
      simpleFullscreen: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: false,
        allowRunningInsecureContent: true,
      },
    });
    // 打开控制台
    mainWindow.webContents.openDevTools();
  } else {
    // 生产环境的配置
    mainWindow = new BrowserWindow({
      fullscreenable: false,
      fullscreen: false,
      simpleFullscreen: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: false,
        allowRunningInsecureContent: true,
      },
    });
  }

  // 如果为 dev 环境加载本地url,否则加载打包后的index.html
  mainWindow.loadURL(isDev ? 'http://localhost:5173' : `file://${path.join(__dirname, '../dist/index.html')}`);
}

// 此方法将在Electron完成后调用,初始化,并准备创建浏览器窗口。
app.whenReady().then(() => {
  // 创建windows应用
  createWindow();

  // 延迟3s 等待应用激活
  setTimeout(() => {
    console.log('已经过了3s了');
    app.on('activate', function () {
      // 如果应用激活后,窗口依然为0,则重新创建windows应用
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  }, 3000)
});

// 应用销毁触发
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
