<script setup lang="ts">
import { ref, computed } from "vue";
import { Modal } from "view-ui-plus";
const props = defineProps<{ isShowReadMe: boolean }>();
const emit = defineEmits<{
  (e: "update:isShowReadMe", isShowReadMe: boolean): void;
}>();

function onVisibleChange(event: boolean) {
  emit("update:isShowReadMe", event);
}
</script>

<template>
  <Modal
    :model-value="isShowReadMe"
    title="RPG小助手 1.1.0"
    @on-visible-change="onVisibleChange"
  >
    <Row :gutter="16">
      <Col span="24"> 目前主要支援A F E I C 規格 </Col>
    </Row>
    <Row :gutter="16">
      <Col span="8">左鍵有顏色之關鍵字:</Col>
      <Col span="16"> 可以叫出說明 </Col>
    </Row>
    <Row :gutter="16">
      <Col span="8">雙擊滑鼠左鍵:</Col>
      <Col span="14"> 顯示該FormType規格 </Col>
    </Row>
    <Row :gutter="16">
      <Col span="8">ctrl + 滑鼠左鍵:</Col>
      <Col span="14"> 跳到在此檔案中定義field的位置 </Col>
    </Row>
    <Row :gutter="16">
      <Col span="8">alt + 鍵盤左:</Col>
      <Col span="14"> 回到跳轉之前的位置 </Col>
    </Row>
  </Modal>
</template>

<style scoped></style>
