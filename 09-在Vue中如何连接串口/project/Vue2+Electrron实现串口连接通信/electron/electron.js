/*
 * @Author: wangzhiyu
 * @version: 1.0.0
 * @Date: 2023-09-07 22:10:24
 * @LastEditTime: 2024-04-04 00:39:06
 * @Descripttion: 
 */
// electron/electron.js
const path = require("path");
const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const yaml = require("js-yaml");
const fs = require("fs");
// const Serialport = window.require('serialport')
// console.log(Serialport, 'Serialport')
let isDev = process.env.IS_DEV === "true";
function createWindow() {
  // 串口日志文件路径
  const serialPortLog = path.join(__dirname, "../log.txt");

  // 读取配置文件
  const configPath = isDev
    ? path.join(__dirname, "../configDev.yaml")
    : path.join(__dirname, "../../config_pro.yaml");
  const config = yaml.load(fs.readFileSync(configPath));
  if (config.system.isDev) {
    isDev = config.system.isDev;
  }
  // 配置自动播放音频
  app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");
  if (isDev) {
    mainWindow = new BrowserWindow({
      fullscreenable: false,
      fullscreen: false,
      simpleFullscreen: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: false,
        allowRunningInsecureContent: true
      }
    });
  } else {
    mainWindow = new BrowserWindow({
      fullscreenable: true,
      fullscreen: true,
      simpleFullscreen: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: false,
        allowRunningInsecureContent: true
      }
    });
  }

  //如果时dev 环境加载本地url,否则加载index.html
  mainWindow.loadURL(
    isDev
      ? "http://localhost:8080"
      : `file://${path.join(__dirname, "../dist/index.html")}`
  );

  //根据环境判断是否开启devTools
  if (isDev) {
    //Menu.setApplicationMenu(null)
    mainWindow.webContents.openDevTools();
  } else {
    Menu.setApplicationMenu(null);
    mainWindow.webContents.openDevTools();
  }

  //当窗口加载完成后将config 赋值给窗体
  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.send("CONFIG", config);
  });

  ipcMain.on("serial-port-message", (event, data) => {
    console.log(data, "data");
    // 写入串口数据日志
    fs.appendFile(serialPortLog, data + "\n", err => {
      console.log(err ? err : "ok");
    });
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  app.on("activate", function() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
