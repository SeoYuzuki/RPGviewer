<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { FieldInfo, Position } from "../types/FieldInfo";
import { FileInfo, ParsedLine } from "../types/parsedRpgFile";
import {
  publicFieldInfoList,
  linkMap,
  allFieldInfoMap,
} from "../core/FieldInfoParser";
import { FORM_TYPE_BAR_LIST } from "../dictionary/RPG_dictionary";

import FileLine from "./lines/FileLine.vue";

const props = defineProps<{
  /** 當前Tab名稱 */
  targetTabName: string;
  /** 上傳的檔案列表 */
  fileInfoMap: Map<string, FileInfo>;
  /** 跳轉到行的資訊物件 */
  toPositionObj: { targetTabName: string; index: number };
}>();

const emit = defineEmits<{
  (e: "scrollToRef", position: Position, preIndex: number): void;
}>();

/** 每行的element */
const divs = ref<any[]>([]);

let lineClicked = ref<number>(0);
let selectedBarModel = ref<string>();

/** 當前渲染程式碼 */
const parsedRpgFile = computed(() => {
  return props.fileInfoMap.get(props.targetTabName)?.parsedLineList;
});

/** 欄位資訊清單 target + linkMap */
const fieldInfoList = computed(() => {
  let temp: FieldInfo[] = [];
  let linkList = linkMap.value.get(props.targetTabName);
  linkList?.forEach((e) => {
    let fieldInfo = allFieldInfoMap.value.get(e);
    if (fieldInfo) {
      temp = temp.concat(fieldInfo);
    }
  });

  /** 該文件之欄位資訊 */
  let targetFieldInfoList =
    allFieldInfoMap.value.get(props.targetTabName) ?? [];
  return targetFieldInfoList.concat(temp).concat(publicFieldInfoList.value);
});

function getElementClass(index: number) {
  if (index == lineClicked.value) {
    return "focus-line";
  } else return "element";
}
function onElementClicked(rl: ParsedLine, index: number) {
  console.log({
    formTypeSpecifications: rl.formTypeSpecifications,
    index: index,
    rl: rl,
    fieldInfoList: fieldInfoList.value,
  });
  lineClicked.value = index;
  if (rl.formTypeSpecifications) {
    selectedBarModel.value = rl.formTypeSpecifications;
  }
}

const selectedBar = computed(() => {
  if (selectedBarModel.value) {
    return (
      FORM_TYPE_BAR_LIST.find((e) => e.value === selectedBarModel.value)?.bar ??
      ""
    );
  }
  return "";
});

/**
 * 跳轉到行
 * 有點彆扭的實作，每tab去監聽此物件是否被更新，如果當前tab是自己，則移動到該行
 */
watch(
  () => props.toPositionObj,
  (nV, oV) => {
    if (nV.targetTabName === props.targetTabName) {
      let el: Element = divs.value[nV.index];
      if (el) {
        el.scrollIntoView();
      }
    }
  }
);

function scrollToRef(position: Position, preIndex: number) {
  emit("scrollToRef", position, preIndex);
}
</script>

<template>
  <Row :gutter="0">
    <Col span="18">
      {{
        "________________1_________2_________3_________4_________5_________6_________7_________8"
      }}</Col
    >
    <Col span="18">
      {{
        "_______12345678901234567890123456789012345678901234567890123456789012345678901234567890"
      }}</Col
    >
    <Col span="18"> {{ "__INDEX" }}{{ selectedBar }} </Col>
    <Col span="6">
      <Select v-model="selectedBarModel" style="width: 250px" size="small">
        <i-Option
          v-for="item in FORM_TYPE_BAR_LIST"
          :value="item.value"
          :key="item.value"
        >
          <span>{{ item.label }}</span>
          <span style="float: right; color: #ccc">{{ item.value }}</span>
        </i-Option>
      </Select>
    </Col>
  </Row>

  <div class="text-block0">
    <div class="container">
      <div class="cont_elements">
        <div
          v-for="(parsedLine, index) in parsedRpgFile"
          :class="getElementClass(index)"
          :ref="
            (el) => {
              divs[index] = el;
            }
          "
          @click="onElementClicked(parsedLine, index)"
        >
          <Poptip :title="'title'" width="500">
            <template #content> {{ parsedLine }}</template>

            {{ " " + (index + 1).toString().padStart(5, "0") }}
          </Poptip>
          <!-- 整行註解 -->
          <span v-if="parsedLine.formType === 'comments'" class="comments">
            {{ parsedLine.rawRl }}</span
          >
          <span v-else>
            <FileLine
              :parsed-line="parsedLine"
              :fieldInfoList="fieldInfoList"
              @scroll-to-ref="scrollToRef"
            />
            <span v-if="parsedLine.formType === 'unknown'" class="non">
              {{ parsedLine.rawRl }}</span
            >
            <span v-if="parsedLine.formType === 'unknown2'" class="non2">
              {{ parsedLine.rawRl }}</span
            >
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-block0 {
  /* position: absolute; */
  /* position: relative; */
  background-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
  height: 75vh;
  width: 100%;
}

.container {
  white-space: pre-wrap;
  position: relative;
  height: 100%;
}

.cont_elements {
  overflow-y: scroll;
  height: 100%;
}

.focus-line {
  position: relative;
  background-color: rgb(27, 27, 27);
}

.non {
  color: #d9ea79;
}

.non2 {
  color: #37f49c;
}

.comments {
  color: #3ba000;
}
</style>
