<!--
 * @Author: wangzhiyu <w19165802736@163.com>
 * @Date: 2023-12-15 11:05:46
 * @LastEditTime: 2024-04-17 17:17:10
 * @Descripttion: Home页面
-->
<template>
  <div>
    <!-- 判断wifi是否开启 -->
    <a-button class="refreshWifi" @click="getWifiList" type="primary">刷新wifi</a-button>
    <!-- 刷新wifi -->
    <div v-if="wifiOpen" class="wifiList">
      <!-- 循环展示当前扫描到的wifi列表 -->
      <div v-for="item in wifiList" class="wifiItem">
        <!-- wifi名称 -->
        <div class="wifiSSid">{{ item.ssid }}</div>
        <!-- 连接wifi -->
        <a-button
          :type="item.isConnect ? 'default' : 'primary'"
          :danger="item.isConnect"
          @click="
            () => {
              if (item.isConnect) {
                // 断开wifi
                disconnectWifi(item);
              } else {
                // 连接wifi
                connectWifi(item);
              }
            }
          "
        >
          {{ item.isConnect ? '断开 wifi' : '连接 wifi' }}
        </a-button>
      </div>
    </div>

    <!-- wifi功能未开启提示 -->
    <div v-else>本机wifi未开启,请开启wifi后重试!</div>

    <!-- 连接wifi输入密码弹框 -->
    <a-modal :width="550" v-model:open="openModal" title="连接wifi" @ok="handleOk" cancelText="取消连接" okText="确认连接">
      <a-form>
        <a-form-item label="wifi名称">
          <a-input disabled :value="selectWifiInfo.ssid"></a-input>
        </a-form-item>
        <a-form-item label="wifi密码">
          <a-input-password v-model:value="wifiPassword" placeholder="请输入wifi密码" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { message } from 'ant-design-vue';
const wifi = require('node-wifi');

// wifi列表
const wifiList = ref([]);

// 判断是否开启网络
const wifiOpen = ref(false);

// 弹框开启/关闭状态
const openModal = ref(false);

// 选中连接的wifi信息
const selectWifiInfo = ref({});

// wifi密码
const wifiPassword = ref('');

// 初始化 WiFi 模块
wifi.init({
  iface: null, // 在 Windows 上通常不需要指定接口
});

// 获取wifi列表
const getWifiList = () => {
  // 扫描可用的 WiFi 网络
  wifi.scan((error, networks) => {
    // 扫描wifi失败
    if (error) {
      wifiOpen.value = false;
      console.log(error, 'error');
      return;
    }
    wifiOpen.value = true;

    // wifi扫描成功,获取wifi列表
    wifiList.value = networks.filter(item => item.ssid);

    // 检查当前wifi的连接状态
    getWifiState();
  });
};
getWifiList();

// 获取当前网络连接信息
const getWifiState = () => {
  // 获取当前连接的 WiFi 网络信息
  wifi.getCurrentConnections((error, currentConnections) => {
    if (error) {
      console.error(error);
      return;
    }
    // 如果存在已连接的wifi信息
    if (currentConnections.length > 0) {
      // 当前已经连接的 WiFi 网络
      const connectedNetwork = currentConnections[0].mac;

      // 标记当前连接的wifi
      wifiList.value.forEach(item => {
        if (item.ssid === connectedNetwork) {
          item.isConnect = true;
        } else {
          item.isConnect = false;
        }
      });
    } else {
      console.log('当前未连接到任何 WiFi 网络。');
    }
  });
};

// 连接wifi
const connectWifi = wifiInfo => {
  // 打开弹框
  openModal.value = true;
  selectWifiInfo.value = wifiInfo;
};

// 确认连接wifi
const handleOk = () => {
  // 连接到 WiFi 网络
  wifi.connect({ ssid: selectWifiInfo.value.ssid, password: wifiPassword.value }, error => {
    if (error) {
      // 提示wifi连接失败
      message.error('wifi连接失败,请检查账号密码后重试!');
    } else {
      // 提示wifi连接成功
      message.success('wifi连接成功!');

      // 标记当前连接的wifi
      wifiList.value.forEach(item => {
        if (item.ssid === selectWifiInfo.value.ssid) {
          item.isConnect = true;
        } else {
          item.isConnect = false;
        }
      });
    }

    // 清空密码
    wifiPassword.value = '';
    // 关闭弹框
    openModal.value = false;
  });
};

// 断开wifi连接
const disconnectWifi = () => {
  // 断开当前连接的 WiFi 网络
  wifi.disconnect(error => {
    if (error) {
      console.log(error);
    } else {
      message.success('wifi连接已断开!');
      wifiList.value.forEach(item => {
        item.isConnect = false;
      });
    }
  });
};
</script>

<style lang="scss">
.refreshWifi {
  position: absolute;
  left: 30%;
}
.wifiList {
  position: relative;
  width: 30%;
  min-width: 200px;
  margin: 0 auto;
  border: 1px solid #000;
  border-radius: 10px;
  max-height: 90vh;
  overflow: auto;

  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #535353;
  }
  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #ededed;
  }
  .wifiItem {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    border-bottom: 1px solid #000;
    padding-right: 50px;
    box-sizing: border-box;
    &:last-child {
      border-bottom: none;
    }
    .wifiSSid {
      width: 75%;
      white-space: nowrap; /* 禁止文本换行 */
      overflow: hidden; /* 隐藏溢出部分 */
      text-overflow: ellipsis; /* 显示省略号 */
      padding-left: 20px;
    }
  }
}
</style>
