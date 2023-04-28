<script setup lang="ts">
import { ref, computed, Ref } from "vue";
import { Constants } from "../../dictionary/RPG_dictionary";
import { FieldInfo, Position } from "../../types/FieldInfo";
import { isCtrlPress } from "../../utils/KeyPress";

const props = defineProps<{
  fieldText: string;
  span_class?: string;
}>();

/**
 * 取得常數欄位的class
 * 直接利用該欄位的字串特性判斷是不是常數
 */
function getStaticFieldClass() {
  if (/\'.+\'/.test(props.fieldText.trim())) {
    return "static_string";
  }

  if (/X\'.+\'/.test(props.fieldText.trim())) {
    return "static_string";
  }

  if (
    !isNaN(parseFloat(props.fieldText.trim())) &&
    isFinite(parseFloat(props.fieldText.trim()))
  ) {
    return "static_number";
  }

  if (Constants.includes(props.fieldText.trim())) {
    return "static_number italic";
  }

  return "temp";
}
</script>

<template>
  <span :class="getStaticFieldClass()">
    {{ fieldText }}
  </span>
</template>

<style scoped>
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
