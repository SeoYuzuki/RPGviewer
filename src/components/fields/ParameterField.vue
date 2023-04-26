<script setup lang="ts">
import { ref, computed } from "vue";
import { Constants } from "../../dictionary/RPG_dictionary";
import { FieldInfo, Position } from "../../types/FieldInfo";
const props = defineProps<{
  fieldInfoList: FieldInfo[];
  fieldText: string;
  index: number;
}>();
const emit = defineEmits<{
  (e: "scrollToRef", position: Position, preIndex: number): void;
}>();

const targetFieldInfo = computed(() => {
  return props.fieldInfoList.find(
    (e: any) => e.fieldName?.trim() === props.fieldText.trim().split(",")[0]
  );
});

const clickableFieldClass = computed(() => {
  if (targetFieldInfo.value) {
    return targetFieldInfo.value.info.class ?? "clickable_field";
  }
  return "clickable_field";
});

// function getClickableFieldClass() {}

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

function onClick(e: MouseEvent) {
  console.log(props, targetFieldInfo.value);
  if (e.ctrlKey) {
    if (targetFieldInfo.value?.info.openDss) {
      // emit("openDds", targetFieldInfo.value?.info.openDss);
      emit(
        "scrollToRef",
        { fileName: targetFieldInfo.value?.info.openDss, index: 0 },
        props.index
      );
      return;
    }

    if (targetFieldInfo.value?.position) {
      emit("scrollToRef", targetFieldInfo.value?.position, props.index);
    }
  }
}
// function handleMouseEvent(e: any) {
//   console.log(targetFieldInfo);
// }
</script>

<template>
  <span>
    <Poptip
      v-if="targetFieldInfo"
      class="poptip"
      width="300"
      word-wrap
      transfer
    >
      <span :class="clickableFieldClass" @click="onClick">
        {{ fieldText }}
      </span>
      <template #content>
        {{ targetFieldInfo.info.content ?? "" }}
      </template>
    </Poptip>
    <template v-else>
      <span :class="getStaticFieldClass()" @click="onClick">
        {{ fieldText }}
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
