<script setup lang="ts">
import { ref, computed } from "vue";
import { ParsedLine } from "../../types/parsedRpgFile";
import ParameterField from "../fields/ParameterField.vue";
import KeywordField from "../fields/KeywordField.vue";
import { FieldInfo } from "../../types/FieldInfo";

const props = defineProps<{ rl: ParsedLine; fieldInfoList: FieldInfo[] }>();
const emit = defineEmits<{
  (e: "scrollToRef", position: number, prevPosition: number): void;
}>();

let formContent = props.rl.formContent;

function scrollToRef(position: number, prevPosition: number) {
  emit("scrollToRef", position, prevPosition);
}
</script>

<template>
  <span>
    <template v-for="[key, value] in rl.contentMap">
      <template v-if="value.view === 'KeywordField'">
        <KeywordField
          :keyword="value.value"
          :dictionary="value.dic"
        ></KeywordField>
      </template>
      <template v-else-if="value.view === 'ParameterField'">
        <ParameterField
          :field-info-list="fieldInfoList"
          :field_text="value.value"
          :index="rl.index"
          @scroll-to-ref="scrollToRef"
        ></ParameterField>
      </template>
      <span v-else :class="value.class">{{ value.value }}</span>
    </template>
  </span>
</template>

<style scoped>
.comments {
  color: #3ba000;
}
</style>
