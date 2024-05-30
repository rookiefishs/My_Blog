<!--
 * @Author: wangzhiyu <w19165802736@163.com>
 * @version: 1.0.0
 * @Date: 2024-04-04 00:04:39
 * @LastEditTime: 2024-04-04 00:49:36
 * @Descripttion: 
-->
<template>
  <div class="inter">
    <serial-port></serial-port>
  </div>
</template>

<script>
import serialPort from "./components/serialPort.vue";
export default {
  data() {
    return {};
  },
  components: {
    serialPort,
  },
};
</script>

<style scoped>
.inter {
  padding: 10px;
  box-sizing: border-box;
}
</style>
