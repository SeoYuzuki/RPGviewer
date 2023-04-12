<script setup lang="ts">
import { ref, computed } from "vue";
import { Constants } from "../../dictionary/RPG_dictionary";
import { FieldInfo } from "../../types/FieldInfo";
const props = defineProps<{
  fieldInfoList: FieldInfo[];
  field_text: string;
  index: number;
}>();
const emit = defineEmits<{
  (e: "scrollToRef", position: number, prevPosition: number): void;
  (e: "openDds", name: string): void;
}>();

// console.log(props.fieldInfoList, props.field_text, props.index);
let targetFieldInfo = props.fieldInfoList.find(
  (e: any) => e.fieldName.trim() === props.field_text.trim().split(",")[0]
);

function getClickableFieldClass() {
  if (targetFieldInfo) {
    return targetFieldInfo.info.class ?? "clickable_field";
  }
  return "clickable_field";
}

/**
 * 取得常數欄位的class
 * 直接利用該欄位的字串特性判斷是不是常數
 */
function getStaticFieldClass() {
  if (/\'.+\'/.test(props.field_text.trim())) {
    return "static_string";
  }

  if (/X\'.+\'/.test(props.field_text.trim())) {
    return "static_string";
  }

  if (
    !isNaN(parseFloat(props.field_text.trim())) &&
    isFinite(parseFloat(props.field_text.trim()))
  ) {
    return "static_number";
  }

  if (Constants.includes(props.field_text.trim())) {
    return "static_number italic";
  }

  return "temp";
}
function getfield_info() {
  if (targetFieldInfo) {
    return targetFieldInfo.info.content;
  }
  return "";
}

function onClick(e: MouseEvent) {
  if (e.ctrlKey) {
    if (targetFieldInfo?.info.openDss) {
      console.log(123);
      emit("openDds", targetFieldInfo?.info.openDss);
      return;
    }
    emit("scrollToRef", targetFieldInfo?.position ?? 0, props.index);
  }
}
function handleMouseEvent(e: any) {
  console.log(e);
}
</script>

<template>
  <span>
    <Poptip v-if="targetFieldInfo" class="poptip" width="300" word-wrap>
      <span
        :class="getClickableFieldClass()"
        @click="onClick"
        @mouseover.ctrl="handleMouseEvent"
      >
        {{ field_text }}
      </span>
      <template #content>
        {{ getfield_info() }}
      </template>
    </Poptip>
    <template v-else>
      <span :class="getStaticFieldClass()">
        {{ field_text }}
      </span>
    </template>
  </span>
</template>

<style scoped>
.clickable_field {
  color: #75c4f1e8;
}

.file {
  color: #e22d2d;
}

.record {
  color: #e22d2d;
}

.data-structure {
  color: #eb15ab;
}

.static_string {
  color: #f0a263e8;
}

.static_number {
  color: #97f3c8e8;
}

.italic {
  font-style: italic;
}

.comments {
  color: #3ba000;
}

.temp {
  color: #8b7d87;
}
</style>
