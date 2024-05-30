// 引入express库
var express = require('express');
// 引入socket.io库用于实现websocket通信
var socket = require('socket.io');
// 设置文件根路径
var path = __dirname + '/public'

// 创建并启动服务器
var app = express();
var server = app.listen(3000, () => {
  console.log(`http://localhost:3000`);
});

// 创建websocket实例,并与服务器进行关联
var ws = new socket(server);

// 处理websocket事件
ws.on('connection', (socket) => {
  // websocket收到sendMsg事件时调用这里的回调函数(senhdMsg是某个页面发送消息的事件)
  socket.on('sendMsg', (data) => {
    // 当页面发送消息时,就将收到的消息进行广播,所以连接词websocket的页面都可以收到
    ws.sockets.emit('news', data);
  })
});

// 处理静态文件请求
app.use(express.static(path));


// 处理路由请求
app.get('/', (req, res) => {
  // 返回 index.html 页面
  res.sendFile(__dirname + '/index.html');
});

// 处理 user1 页面请求
app.get('/user1', (req, res) => {
  // 返回 user1.html 页面
  res.sendFile(path + '/user1.html');
});
// 处理 user2 页面请求
app.get('/user2', (req, res) => {
  // 返回 user2.html 页面
  res.sendFile(path + '/user2.html');
});
// 处理 user3 页面请求
app.get('/user3', (req, res) => {
  // 返回 user3.html 页面
  res.sendFile(path + '/user3.html');
});
// 处理 user4 页面请求
app.get('/user4', (req, res) => {
  // 返回 user4.html 页面
  res.sendFile(path + '/user4.html');
});

// 处理第三方库请求
// 使用静态文件中间件，设置第三方库路径
app.use(express.static('node_modules'));
