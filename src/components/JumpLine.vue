<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import { Modal, Input } from "view-ui-plus";
import { Position } from "../types/FieldInfo";

const props = defineProps<{ isShow: boolean; targetTabName: string }>();
const emit = defineEmits<{
  (e: "update:isShow", isShow: boolean): void;
  (e: "jumpToLine", position: Position, preIndex: number): void;
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
  emit(
    "jumpToLine",
    {
      fileName: props.targetTabName,
      index: parseInt(lineValue.value),
    },
    -1
  );
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
