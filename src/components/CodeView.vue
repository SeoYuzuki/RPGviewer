<script setup lang="ts">
import { ref, computed } from "vue";
import { FieldInfo, Position } from "../types/FieldInfo";
import { FileInfo, ParsedLine } from "../types/parsedRpgFile";
import { linkMap, publicFieldInfoMap } from "../core/FieldInfoParser";
import { FORM_TYPE_BAR_LIST } from "../dictionary/RPG_dictionary";

import FileLine from "./lines/FileLine.vue";

const props = defineProps<{
  /** 當前渲染程式碼 */
  parsedRpgFile: ParsedLine[];
  /** 當前Tab名稱 */
  targetTabName: string;
}>();

const emit = defineEmits<{
  (e: "openTab", key: string): void;
}>();

const divs = ref<any[]>([]);

let lineClicked = ref<number>(0);
let selectedBarModel = ref<string>();

/** 該文件之欄位資訊 */
const targetFieldInfoList = ref<FieldInfo[]>([]);

/** 欄位資訊清單 target + linkMap */
const fieldInfoList = computed(() => {
  let temp: FieldInfo[] = [];
  let linkList = linkMap.value.get(props.targetTabName);
  linkList?.forEach((e) => {
    let fieldInfo = publicFieldInfoMap.value.get(e);
    if (fieldInfo) {
      temp = temp.concat(fieldInfo);
    }
  });

  return targetFieldInfoList.value.concat(temp);
});

function getElementClass(index: number) {
  if (index == lineClicked.value) {
    return "focus-line";
  } else return "element";
}
function onElementClicked(rl: ParsedLine, index: number) {
  console.log(rl.formTypeSpecifications, index, rl);
  lineClicked.value = index;
  if (rl.formTypeSpecifications) {
    selectedBarModel.value = rl.formTypeSpecifications;
  }
}

const selectedBar = computed(() => {
  if (selectedBarModel.value) {
    //console.log(selectedBarModel.value);
    return (
      FORM_TYPE_BAR_LIST.find((e) => e.value === selectedBarModel.value)?.bar ??
      ""
    );
  }
  return "";
});

/** 位置紀錄指標 */
let positionHistIndex = ref<number>(1);
/** 位置紀錄清單 */
let positionHistList = ref<Position[]>([]);
function scrollToRef(position: Position, preIndex: number) {
  positionHistList.value = positionHistList.value.slice(
    0,
    positionHistIndex.value - 1
  );
  positionHistIndex.value = positionHistIndex.value + 1;
  positionHistList.value.push({
    fileName: props.targetTabName,
    index: preIndex,
  });
  positionHistList.value.push(position);
  toPosition();
}

function toPosition() {
  let position = positionHistList.value[positionHistIndex.value - 1];
  openTab(position.fileName);

  let el: Element = divs.value[position.index];
  if (el) {
    el.scrollIntoView();
  }
}

function openTab(key: string) {
  emit("openTab", key);
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
          v-for="(parsedLine, index) in props.parsedRpgFile"
          :class="getElementClass(index)"
          :ref="
            (el) => {
              divs[index] = el;
            }
          "
          @click="onElementClicked(parsedLine, index)"
        >
          <!-- {{ rl.rawRl }} -->
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
  position: absolute;
  background-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
  height: 80%;
  width: 100%;
  /* position: absolute;
      width: 100%;
      left: 5%; */
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
</style>
