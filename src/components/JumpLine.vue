<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import { Modal, Input } from "view-ui-plus";

const props = defineProps<{ isShow: boolean }>();
const emit = defineEmits<{
  (e: "update:isShow", isShow: boolean): void;
  (e: "jumpToLine", index: number): void;
}>();

const lineValue = ref<string>("");
const input1 = ref<any>();

function onVisibleChange(event: boolean) {
  emit("update:isShow", event);
}

watch(
  () => props.isShow,
  (val, oldVa) => {
    try {
      if (val) {
        nextTick(() => {
          input1.value.focus({
            cursor: "start",
          });
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
);

function jumpToLine() {
  emit("jumpToLine", parseInt(lineValue.value));
}
</script>

<template>
  <Modal
    :model-value="props.isShow"
    title="jump to"
    @on-ok="jumpToLine"
    @on-visible-change="onVisibleChange"
  >
    <Input ref="input1" v-model="lineValue"> </Input>
  </Modal>
</template>

<style scoped></style>
