<!--
 * @Author: wangzhiyu <w19165802736@163.com>
 * @version: 1.1.1
 * @Date: 2023-11-16 13:23:11
 * @LastEditTime: 2024-04-02 14:38:59
 * @Descripttion: 项目Vue主入口
-->
<template>
  <div>
    <DialogModal title="弹框标题" ref="dialogModalRef" @close="close" draggable="true">
      <template #text="{ row }">
        <el-button @click="openModal(row)">打开弹框</el-button>
      </template>
      <template #body>
        <span>body</span>
      </template>

      <template #footer="{ row }">
        <el-button @click="() => (row.visible = false)">取消</el-button>
        <el-button>确定</el-button>
      </template>
    </DialogModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const dialogModalRef = ref();
const openModal = () => {
  dialogModalRef.value.dialog.visible = true;
};
</script>

<style lang="scss" scoped></style>
