<script setup lang="ts">
import { ref, computed, Ref } from "vue";
import { Constants } from "../../dictionary/RPG_dictionary";
import { FieldInfo, Position } from "../../types/FieldInfo";
import { isCtrlPress } from "../../utils/KeyPress";
import StaticField from "./StaticField.vue";

import { Poptip } from "view-ui-plus";

const props = defineProps<{
  fieldInfoList: FieldInfo[];
  fieldText: string;
  index: number;
}>();
const emit = defineEmits<{
  (e: "scrollToRef", position: Position, preIndex: number): void;
  (e: "popCard", a: { fieldInfoList: FieldInfo[]; preIndex: number }): void;
}>();

/** 欄位資訊清單 */
const targetFieldInfoList = computed(() => {
  return props.fieldInfoList.filter(
    (e: any) => e.fieldName?.trim() === props.fieldText.trim().split(",")[0]
  );
});

const clickableFieldClass = computed(() => {
  if (targetFieldInfoList.value.length > 0) {
    return targetFieldInfoList.value[0].info.class ?? "clickable_field";
  }
  return "clickable_field";
});

function onClick_ctrl() {
  if (isCtrlPress.value) {
    if (targetFieldInfoList.value.length === 1) {
      let info: FieldInfo = targetFieldInfoList.value[0];
      if (info.position) {
        emit("scrollToRef", info.position, props.index);
      }
      return;
    } else {
      emit("popCard", {
        fieldInfoList: targetFieldInfoList.value,
        preIndex: props.index,
      });
    }
    visible.value = true;
  }
}

const visible = ref<boolean>(false);
// const hovered = ref<boolean>(false);
</script>

<template>
  <!-- <span @mouseover="hovered = true" @mouseleave="hovered = false"> -->
  <span>
    <!-- 有欄位資訊 -->
    <template v-if="targetFieldInfoList.length > 0">
      <!-- 被hover 且 沒按ctrl 則只需要Tooltip-->
      <!-- <template v-if="hovered"> -->
      <Tooltip :delay="500" width="500" max-width="500" transfer>
        <span :class="clickableFieldClass" @click="onClick_ctrl()">
          {{ fieldText }}
        </span>
        <template style="white-space: normal" #content>
          <template v-for="e in targetFieldInfoList">
            <span v-if="e.info.title">
              {{ e.info.title }}
            </span>
            {{ e.info.content ?? "" }}
            <br />
          </template>
        </template>
      </Tooltip>
      <!-- </template> -->

      <!-- 沒被hover -->
      <!-- <template v-else>
        <span :class="clickableFieldClass" @click="onClick_ctrl()">
          {{ fieldText }}
        </span>
      </template> -->
    </template>
    <template v-else>
      <StaticField :field-text="fieldText" />
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
