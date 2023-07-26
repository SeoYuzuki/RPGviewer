<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { FieldInfo, Position } from "../types/FieldInfo";
import { FileInfo, ParsedLine } from "../types/parsedRpgFile";
import { ICodeView } from "../types/ICodeView";
import {
  publicFieldInfoList,
  linkMap,
  allFieldInfoMap,
} from "../core/FieldInfoParser";
import { FORM_TYPE_BAR_LIST } from "../dictionary/RPG_dictionary";

import FileLine from "./lines/FileLine.vue";
import OutLine from "./OutLine.vue";
import { Button } from "view-ui-plus";

const props = defineProps<{
  /** 當前Tab名稱 */
  targetTabName: string;
  /** 上傳的檔案列表 */
  fileInfoMap: Map<string, FileInfo>;
}>();

const emit = defineEmits<{
  (e: "scrollToRef", position: Position, preIndex: number): void;
  (e: "popCard", a: { fieldInfoList: FieldInfo[]; preIndex: number }): void;
}>();

/** 每行的element */
const divs = ref<any[]>([]);

let lineClicked = ref<number>(0);
let selectedBarModel = ref<string>();

/** 當前渲染程式碼 */
const parsedRpgFile = computed(() => {
  return props.fileInfoMap.get(props.targetTabName)?.parsedLineList;
});

/** 當前大綱 */
const outLine = computed(() => {
  return props.fileInfoMap.get(props.targetTabName)?.outLine;
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
    parsedLine: rl,
    fieldInfoList: fieldInfoList.value,
    linkMap: linkMap.value,
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
      "......................................................................."
    );
  }
  return ".......................................................................";
});

function scrollToRef(position: Position, preIndex: number) {
  emit("scrollToRef", position, preIndex);
}

/**
 * 跳到指定行
 * @param index
 */
function scrollByIndex(index: number) {
  let el: Element = divs.value[index];
  if (el) {
    el.scrollIntoView();
  }
}

/** 欄位數字 */
const isShowColumnGridLine = ref<boolean>(false);

/** OutLine */
const showOutLine = ref<boolean>(false);

defineExpose<ICodeView>({
  scrollByIndex: scrollByIndex,
  getName: (): string => props.targetTabName,
});
</script>

<template>
  <Row :gutter="0">
    <template v-if="isShowColumnGridLine">
      <Col span="24">
        {{
          "________________1_________2_________3_________4_________5_________6_________7_________8"
        }}
      </Col>

      <Col span="24">
        {{
          "_______12345678901234567890123456789012345678901234567890123456789012345678901234567890"
        }}
      </Col>
    </template>

    <Col> {{ "__INDEX" }}{{ selectedBar }} </Col>
    <Col>
      <Select v-model="selectedBarModel" style="width: 150px" size="small">
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
    <Col>
      <Button size="small" @click="showOutLine = true">OutLine</Button>
    </Col>
    <Col>
      <Button
        size="small"
        @click="isShowColumnGridLine = !isShowColumnGridLine"
      >
        Col
      </Button>
    </Col>
  </Row>
  <div :class="isShowColumnGridLine ? 'text-block0' : 'text-block1'">
    <div class="container">
      <div class="cont_elements">
        <div
          v-for="(parsedLine, index) in parsedRpgFile"
          :class="getElementClass(index)"
          :ref="
            (el: any) => {
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
              @popCard="emit('popCard', $event)"
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

  <Modal
    class="a123"
    v-model="showOutLine"
    draggable
    sticky
    scrollable
    footer-hide
    width="210"
    :transfer="false"
    :mask="false"
    :title="'OuntLine: ' + targetTabName"
    class-name="modify-style"
  >
    <OutLine
      v-if="showOutLine"
      :targetTabName="targetTabName"
      :outLine="outLine"
      @scroll-to-ref="scrollToRef"
    ></OutLine>
  </Modal>
</template>

<style scoped>
.text-block0 {
  /* position: absolute; */
  /* position: relative; */
  background-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
  height: calc(100vh - (140px));
  width: 100%;
}

.text-block1 {
  background-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
  height: calc(100vh - (90px));
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
<style>
.modify-style .ivu-modal-header {
  padding-top: 6px;
  padding-right: 5px;
  padding-bottom: 4px;
  padding-left: 15px;
}
</style>
