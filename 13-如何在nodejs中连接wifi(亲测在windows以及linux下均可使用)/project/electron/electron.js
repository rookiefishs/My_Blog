// !: 这里的electron.js将会在node环境下运行

// 导入node内置模块
const path = require('path');
const fs = require('fs');

// 导入electronAPI
const { app, BrowserWindow, Menu, ipcMain } = require('electron');

// 导入yaml第三方库,用于操作配置文件
const yaml = require('js-yaml');

// const { spawn } = require("child_process");

// 判断是否为测试环境
let isDev = process.env.IS_DEV === 'true';

// 配置文件
let config = null;

// 读取配置文件的路径
let filePath = '/home/iimt/coffeePos/config.yaml';

// 初始化左面段应用
function createWindow() {
  // 如果没有从指定的路径读取到配置文件,则默认从本地读取
  try {
    // 判断文件是否存在
    fs.accessSync(filePath);
    config = yaml.load(fs.readFileSync(filePath));
  } catch (err) {
    // 读取配置文件
    const configPath = isDev ? path.join(__dirname, '../config_dev.yaml') : path.join(__dirname, '../../config_pro.yaml');
    config = yaml.load(fs.readFileSync(configPath));
  }

  console.log(config);

  // 判断是否为dev环境
  if (config.system.isDev) {
    isDev = config.system.isDev;
  }

  // 配置自动播放音频
  app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
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
  } else {
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
  }

  //如果时dev 环境加载本地url,否则加载index.html
  mainWindow.loadURL(isDev ? 'http://localhost:9090' : `file://${path.join(__dirname, '../dist/index.html')}`);

  //根据环境判断是否开启devTools
  if (isDev) {
    mainWindow.webContents.openDevTools();
  } else {
    Menu.setApplicationMenu(null);

    // 生产环境中根据配置设置是否开启devTools
    config.system.isTools && mainWindow.webContents.openDevTools();
  }

  //当窗口加载完成后将config 赋值给窗体
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('CONFIG', config);
  });
}

//此方法将在Electron完成后调用,初始化，并准备创建浏览器窗口。
app.whenReady().then(() => {
  createWindow();

  // 拉起对应的第三方服务
  if (process.platform === 'linux' && config.system.startWebserver) {
    child = spawn(config.system.startWebserver);
  }

  setTimeout(() => {
    console.log('3 秒钟已经过去了');
    app.on('activate', function () {
      console.log('拉起应用');
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  }, 3000);
});

// 应用销毁触发
app.on('window-all-closed', () => {
  // 停止对应的第三方服务
  if (process.platform === 'linux' && config.system.stopWebserver) {
    child = spawn(config.system.stopWebserver);
  }

  if (process.platform !== 'darwin') {
    app.quit();
  }
});
