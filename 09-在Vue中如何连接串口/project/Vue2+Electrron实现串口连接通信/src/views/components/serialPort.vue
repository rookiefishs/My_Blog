<template>
  <div class="container">
    <aside class="aside">
      <el-button
        size="mini"
        type="danger"
        icon="el-icon-back"
        @click="$router.back()"
        >返回</el-button
      >
      <!-- 串口号 -->
      <el-row
        class="aside_row"
        type="flex"
        justify="space-between"
        align="middle"
      >
        <span>串口号</span>
        <div>
          <i @click="refreshSerialPort" class="el-icon-refresh"></i>
          <el-select
            :disabled="isOpen"
            style="width: 150px"
            size="mini"
            v-model="currentSerialPort"
          >
            <el-option
              v-for="item in serialPortList"
              :value="item.path"
              :key="item.path"
              >{{ item.path }}</el-option
            >
          </el-select>
        </div>
      </el-row>

      <!-- 波特率 -->
      <el-row
        class="aside_row"
        type="flex"
        justify="space-between"
        align="middle"
      >
        <span>波特率</span>
        <div>
          <i @click="writeBaud" class="el-icon-edit"></i>
          <el-select
            :disabled="isOpen"
            v-if="!isHandBaud"
            style="width: 150px"
            size="mini"
            v-model="currentBaud"
          >
            <el-option v-for="item in baudList" :value="item" :key="item">{{
              item
            }}</el-option>
          </el-select>
          <el-input
            :disabled="isOpen"
            style="width: 150px"
            size="mini"
            v-else
            v-model="currentBaud"
          ></el-input>
        </div>
      </el-row>

      <!-- 数据位 -->
      <el-row
        class="aside_row"
        type="flex"
        justify="space-between"
        align="middle"
      >
        <span>数据位</span>
        <div>
          <el-select
            :disabled="isOpen"
            style="width: 150px"
            size="mini"
            v-model="currentDataBit"
          >
            <el-option v-for="item in dataBits" :value="item" :key="item">{{
              item
            }}</el-option>
          </el-select>
        </div>
      </el-row>

      <!-- 校验位 -->
      <el-row
        class="aside_row"
        type="flex"
        justify="space-between"
        align="middle"
      >
        <span>校验位</span>
        <div>
          <el-select
            :disabled="isOpen"
            style="width: 150px"
            size="mini"
            v-model="currentVaild"
          >
            <el-option v-for="item in vaildBits" :value="item" :key="item">{{
              item
            }}</el-option>
          </el-select>
        </div>
      </el-row>

      <el-button
        style="width: 100%"
        @click="openSerialPort"
        :type="isOpen ? 'primary' : 'none'"
        >{{ isOpen ? "关闭" : "打开" }}串口</el-button
      >
      <el-button
        style="width: 100%; margin: 10px auto"
        :type="isUpdateFile ? 'primary' : 'none'"
        @click="downloadFile"
        >{{ isUpdateFile ? "不保存到文件" : "保存到文件" }}</el-button
      >

      <!-- 是否转换为JSON -->
      <el-row type="flex" justify="center">
        <el-switch
          v-model="conversionJSON"
          inactive-text="是否转换为JSON"
          :inactive-value="false"
          :active-value="true"
        >
        </el-switch>
      </el-row>
    </aside>
    <main class="main">
      <div class="content_area">
        <el-row
          type="flex"
          justify="space-between"
          style="padding-right: 10px; margin: 5px 0"
        >
          <span style="margin: 5px">发送区域：</span>
          <el-button
            @click="sendContent = ''"
            type="info"
            size="mini"
            style="margin-bottom: 5px"
            >清空</el-button
          >
        </el-row>
        <el-input
          @wheel.native="wheelFn"
          disabled
          class="content"
          type="textarea"
          :rows="15"
          v-model="sendContent"
        ></el-input>

        <el-row
          type="flex"
          justify="space-between"
          style="padding-right: 10px; margin: 5px 0"
        >
          <span style="margin: 5px">接收区域：</span>
          <el-button
            @click="receiveContent = ''"
            type="info"
            size="mini"
            style="margin-bottom: 5px"
            >清空</el-button
          >
        </el-row>
        <el-input
          @wheel.native="wheelFn"
          disabled
          class="content"
          type="textarea"
          :rows="15"
          v-model="receiveContent"
        ></el-input>
      </div>
      <div class="footer">
        <el-input
          @keypress.native="handleKeyDown"
          v-model="sendValue"
          type="textarea"
          :rows="7"
        ></el-input>
        <div class="submit" @click="sendMsg">
          <i class="el-icon-position"></i>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
// 导入串口第三方库
const { SerialPort } = window.require("serialport");
// 导入ipcRenderer,用于和electron主线程通信
const { ipcRenderer } = window.require("electron");

export default {
  data() {
    return {
      port: "",
      // 串口列表
      serialPortList: [],
      currentSerialPort: localStorage.getItem("currentSerialPort") || "COM1",
      // 波特率列表
      baudList: [
        300, 600, 1200, 4800, 9600, 14400, 19200, 38400, 56000, 57600, 115200,
        12800, 25600, 460800, 512000, 750000, 921600, 1500000,
      ],
      currentBaud: 512000,
      // 是否手动写入波特率
      isHandBaud: false,

      // 数据位
      dataBits: [5, 6, 7, 8],
      currentDataBit: 8,

      // 校验位
      vaildBits: ["even", "mark", "none", "odd"],
      currentVaild: "none",

      receiveContent: "",
      sendContent: "",
      sendValue: "",

      // 串口是否打开
      isOpen: localStorage.getItem("isOpen") === "true",

      // 是否允许保存数据到文件
      isUpdateFile: localStorage.getItem("isUpdateFile") === "true",

      // 是否转换为JSON
      conversionJSON: true,

      // 是否滚动到底部
      isBottom: true,
    };
  },
  async created() {
    this.serialPortList = await SerialPort.list();
  },
  methods: {
    // 发送消息
    async sendMsg() {
      if (!this.port || (await SerialPort.list().length) === 0) {
        // 关闭串口
        this.isOpen = false;
        localStorage.setItem("isOpen", "false");
        return this.$message({ message: "串口未连接", type: "warning" });
      }
      let obj = this.sendValue.split(",").map((item) => Number(item));
      this.port.write(
        this.conversionJSON ? JSON.stringify(obj) : this.sendValue
      ); // 发送字符串
      this.sendContent += this.conversionJSON
        ? JSON.stringify(obj)
        : this.sendValue;

      // 文本域滚动到底部
      this.scrollBottom();
    },
    // 连接/关闭串口
    async openSerialPort() {
      // 获取选中的串口
      let serialPortItem = this.serialPortList.find(
        (item) => item.path === this.currentSerialPort
      );
      console.log(await SerialPort.list(), "serialPortItem");

      // 关闭串口
      if (this.isOpen) {
        // 关闭串口
        console.log(this.port, "关闭串口");
        this.isOpen = false;
        localStorage.setItem("isOpen", "false");

        this.port && this.port.close();
      } else {
        // 打开串口
        console.log("打开串口");
        this.isOpen = true;
        localStorage.setItem("isOpen", "true");

        // 连接串口,配置对应的数据
        this.port = new SerialPort({
          // 连接的串口信息数据
          ...serialPortItem,
          // 比特率
          baudRate: this.currentBaud,
          // 数据位
          dataBits: this.currentDataBit,
          // 校验位
          parity: this.currentVaild,
        });

        this.port.on("open", () => {
          localStorage.setItem("currentSerialPort", this.port.path);
        });

        // 接收消息
        this.port.on("data", (data) => {
          this.receiveContent += data.toString();
          console.log(`接收到了消息:`, data.toString());

          // 数据传递给electron主线程,主线程保存到文件中
          if (this.isUpdateFile) {
            console.log("保存文件");
            ipcRenderer.send("serial-port-message", data.toString());
          }

          // 文本域滚动到底部
          this.scrollBottom();
        });

        // 监听错误
        let that = this;
        that.port.on("error", function (err) {
          // 串口正在打开错误不提示
          if (err.toString() === "Error: Port is opening") return;
          that.$message({ message: err, type: "error" });
          console.log("errorr");
          that.isOpen = !that.isOpen;
          localStorage.setItem("isOpen", that.isOpen);
        });
      }
    },
    // 刷新串口列表
    async refreshSerialPort() {
      this.serialPortList = await SerialPort.list();
      console.log("已刷新");
    },
    // 手动写入波特率
    writeBaud() {
      this.isHandBaud = !this.isHandBaud;

      // 判断是否为下拉
      if (!this.isHandBaud) {
        // 判断下拉列表中是否有对应的值
        this.currentBaud =
          this.baudList.find((item) => item === Number(this.currentBaud)) ||
          9600;
      }
    },
    // 切换是否保存文件
    downloadFile() {
      this.isUpdateFile = !this.isUpdateFile;
      localStorage.setItem("isUpdateFile", this.isUpdateFile);
    },
    // 按下 Shift 和 Enter 键时发送消息
    handleKeyDown(event) {
      if (event.shiftKey && event.keyCode === 13) {
        this.sendMsg();
      }
    },
    // 用户滚动鼠标时取消滚动到最底部行为
    wheelFn() {
      this.isBottom = false;
    },
    // 默认滚动到最底部,用户控制时取消,三秒后恢复
    scrollBottom() {
      this.$nextTick(() => {
        const textarea = document.querySelectorAll(".content textarea");
        if (this.isBottom) {
          for (let i = 0; i < textarea.length; i++) {
            textarea[i].scrollTo({
              top: textarea[i].scrollHeight,
              behavior: "smooth",
            });
          }
        }
      });
    },
  },
  watch: {
    isBottom(val) {
      if (!val) {
        setTimeout(() => {
          this.isBottom = true;
        }, 1500);
      }
    },
  },
  mounted() {},
  beforeDestroy() {
    // 关闭与electron主线程的通信通道
    ipcRenderer.removeAllListeners("message");

    // 获取连接的所有串口
    SerialPort.list().then((ports) => {
      // 关闭每个链接
      ports.forEach((port) => {
        console.log(port, "port");
        if (!port) return;
        let sp = new SerialPort({ ...port, baudRate: 9600 });
        sp.close();
      });
    });
  },
};
</script>

<style>
.container {
  display: flex;
  width: 100%;
  max-height: 92.5vh;
}

.aside {
  flex: 1;
  min-height: 100vh;
  background-color: #f2f2f2;
  padding: 10px;
  box-sizing: border-box;
}

.main {
  display: flex;
  flex-direction: column;
  flex: 6;
  min-height: 100vh;
  padding: 5px;
}

.footer {
  flex: 2;
  display: flex;
  box-sizing: border-box;
  padding-top: 5px;
  margin-bottom: 60px;
}

.content_area {
  flex: 8;
}

.aside_row {
  margin: 5px 0;
}

.submit {
  width: 200px;
  height: 85%;
  margin-left: 10px;
  border-radius: 8px;
  background: #cccccc;
  font-size: 65px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.submit:hover,
.submit:active {
  background-color: #999999;
}

.el-icon-position {
  transform: rotate(45deg);
}
</style>
