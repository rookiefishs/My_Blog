<!--
 * @Author: wangzhiyu <w19165802736@163.com>
 * @version: 1.1.1
 * @Date: 2023-11-22 09:56:16
 * @LastEditTime: 2024-01-18 13:55:56
 * @Descripttion: 弹框组件
-->
<template>
  <slot name="text" :row="dialog">
    <!-- 默认内容 -->
    <el-button type="primary" @click="dialog.visible = true">点击打开弹框</el-button>
  </slot>
  <el-dialog :close-on-press-escape="false" v-model="dialog.visible" :append-to-body="true" :title="title" :before-close="handleClose" :width="width" :close-on-click-modal="false" @close="close" destroy-on-close draggable="true" ref="DialogModel">
    <div :style="{ height: height }">
      <slot name="body" :row="dialog">
        <!-- 默认内容 -->
        弹框内部内容
      </slot>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <slot name="footer" :row="dialog">
          <!-- 默认内容 -->
          <el-button type="primary" @click="dialog.visible = false">确认</el-button>
          <el-button @click="dialog.visible = false">关闭</el-button>
        </slot>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue';

const props = defineProps({
  // 弹框头部标题
  title: {
    type: String,
    required: true,
  },
  // 弹框宽度
  width: {
    type: String,
    default: '70%',
  },
  // 弹框高度
  height: {
    type: String,
    default: '',
  },
});
const emits = defineEmits(['close']);
// 弹框实例
const DialogModel = ref();
const dialog = reactive({
  visible: false,
});
const close = () => {
  emits('close');
};
const handleClose = () => {
  dialog.visible = false;
};
const getDialogRef = () => {
  return DialogModel.value;
};
defineExpose({
  dialog,
  getDialogRef,
});
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
