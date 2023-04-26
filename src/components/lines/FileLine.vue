<script setup lang="ts">
import { ref, computed } from "vue";
import { ParsedLine } from "../../types/parsedRpgFile";
import ParameterField from "../fields/ParameterField.vue";
import KeywordField from "../fields/KeywordField.vue";
import { FieldInfo, Position } from "../../types/FieldInfo";

const props = defineProps<{
  parsedLine: ParsedLine;
  fieldInfoList: FieldInfo[];
}>();
const emit = defineEmits<{
  (e: "scrollToRef", position: Position, preIndex: number): void;
  // (e: "openDds", name: string): void;
}>();

let formContent = props.parsedLine.formContent;

function scrollToRef(position: Position, preIndex: number) {
  emit("scrollToRef", position, preIndex);
}

// function openDds(name: string) {
//   emit("openDds", name);
// }
</script>

<template>
  <span>
    <template v-for="[key, value] in parsedLine.contentMap">
      <template v-if="value.view === 'KeywordField'">
        <KeywordField
          :keyword="value.value"
          :dictionary="value.dic"
          :span_class="value.class"
        ></KeywordField>
      </template>
      <template v-else-if="value.view === 'ParameterField'">
        <ParameterField
          :field-info-list="fieldInfoList"
          :field-text="value.value"
          :index="parsedLine.index"
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
