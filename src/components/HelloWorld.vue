<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { getContentByFile } from "../utils/A1Utils";
import { getAuxiliaryCrossHandler } from "../utils/AuxiliaryCross";
import { parseRpgFile } from "../utils/RpgFileParser";
import { getFieldInfoList } from "../utils/FieldInfoParser";
import { ParsedLine } from "../types/parsedRpgFile";
import { FORM_TYPE_BAR_LIST } from "../dictionary/RPG_dictionary";

import formTypeC from "./formType/FormTypeC.vue";
import formTypeE from "./formType/formTypeE.vue";
import formTypeF from "./formType/formTypeF.vue";
import formTypeI from "./formType/formTypeI.vue";
import { Button } from "view-ui-plus";
import { FormType } from "../types/FormType";
import { FieldInfo } from "../types/FieldInfo";

let lineValue: string = "";

/**
 * 上傳
 */
/** 被解析的RPG檔案 */
const parsedRpgFile = ref<ParsedLine[]>([]);
/** 欄位資訊 */
const fieldInfoList = ref<FieldInfo[]>([]);
/**
 * 上傳檔案事件
 * @param file
 */
async function handleUpload(file: File): Promise<boolean> {
  let res = await getContentByFile(file);
  // 依照不同From type解析每行
  parsedRpgFile.value = parseRpgFile(res);
  // 檢查是否有值得彈出提示或是超連結的欄位
  fieldInfoList.value = getFieldInfoList(parsedRpgFile.value);
  return false;
}

/** 是否顯示Read Me */
let isShowReadMe = ref<boolean>(false);

let lineClicked = ref<number>(0);
let selectedBarModel = ref<string>();

function getElementClass(index: number) {
  if (index == lineClicked.value) {
    return "focus-line";
  } else return "element";
}

function onElementClicked(rl: ParsedLine, index: number) {
  console.log(index, rl);
  lineClicked.value = index;
  if (rl.formTypeSpecifications) {
    selectedBarModel.value = rl.formTypeSpecifications;
  }
}
const selectedBar = computed(() => {
  if (selectedBarModel.value) {
    console.log(selectedBarModel.value);
    return (
      FORM_TYPE_BAR_LIST.find((e) => e.value === selectedBarModel.value)?.bar ??
      ""
    );
  }
  return "";
});

const divs = ref<any[]>([]);
let prevPosition: number = 0;
function scrollToRef(position: number, _prevPosition: number) {
  console.log("scrollWin", position.toString().padStart(5, "0"));
  console.log(divs.value);

  let el: Element = divs.value[position];

  if (el) {
    el.scrollIntoView();
    prevPosition = _prevPosition;
  }
}

/** 是否顯示十字線 */
let openAuxiliaryCross = ref<boolean>(false);
let auxiliaryCrossHandler = getAuxiliaryCrossHandler(openAuxiliaryCross);
/**
 *
 */
onMounted(() => {
  window.addEventListener("keydown", (e) => {
    if (e.altKey) {
      if (e.keyCode == 37) {
        // 左
        scrollToRef(prevPosition, 0); //TODO
      }
      // e.altKey
      if (e.key == "s") {
        openAuxiliaryCross.value = !openAuxiliaryCross.value;
      }
      if (e.keyCode == 76) {
        // l
        // this.$refs["jumpLine"].focus();
      }
      // if (e.keyCode == 73) {
      //   // i
      //   console.log(this.parsedRpgFile);
      //   console.log(this.fieldInfo);
      // }
    }
  });

  window.addEventListener("mousemove", auxiliaryCrossHandler);
});

onUnmounted(() => {
  window.removeEventListener("mousemove", auxiliaryCrossHandler);
});
</script>

<template>
  <Row :gutter="16">
    <!-- <Col span="10">
      <input type="file" ref="file" @change="readFile($event)" />
    </Col> -->
    <Upload :before-upload="handleUpload">
      <Button icon="ios-cloud-upload-outline">Select the file to upload</Button>
    </Upload>
    <!-- <Col span="4">
      跳至
      <i-Input
        ref="jumpLine"
        v-model="lineValue"
        placeholder="alt + l"
        style="width: 100px"
        @keypress="jumpToLine"
      >
      </i-Input>
      行
    </Col> -->
    <Col span="5">
      十字線(alt+s) <i-Switch v-model="openAuxiliaryCross"> </i-Switch>
    </Col>
    <Col span="3">
      <Button type="primary" @click="isShowReadMe = true">Read Me</Button>
    </Col>
  </Row>
  <Row :gutter="0">
    <Col span="18"> {{ "_______INDEX" }}{{ selectedBar }} </Col>
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
          v-for="(rl, index) in parsedRpgFile"
          :class="getElementClass(index)"
          :ref="
            (el) => {
              divs[index] = el;
            }
          "
          @click="onElementClicked(rl, index)"
        >
          <!-- {{ rl.rawRl }} -->
          <Poptip :title="'title'" width="500">
            <template #content> {{ rl }}</template>

            {{ "      " + (index + 1).toString().padStart(5, "0") }}
          </Poptip>
          <!-- 整行註解 -->
          <span v-if="rl.formType === 'comments'" class="comments">
            {{ rl.rawRl }}</span
          >
          <span v-else>
            <formTypeC
              v-if="rl.formType === 'C'"
              :rl="rl"
              :field_info="fieldInfoList"
              @scroll-to-ref="scrollToRef"
            >
            </formTypeC>
            <formTypeI
              v-else-if="rl.formType === 'I'"
              :rl="rl"
              :field_info="fieldInfoList"
              @scroll-to-ref="scrollToRef"
            >
            </formTypeI>
            <formTypeE
              v-else-if="rl.formType === 'E'"
              :rl="rl"
              :field_info="fieldInfoList"
              @scroll-to-ref="scrollToRef"
            >
            </formTypeE>
            <span v-else class="non"> {{ rl.rawRl }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
  <Modal v-model="isShowReadMe" title="RPG小助手 1.1.0">
    <Row :gutter="16">
      <Col span="24"> 目前主要支援E I C 規格 </Col>
    </Row>
    <Row :gutter="16">
      <Col span="8">左鍵有顏色之關鍵字:</Col>
      <Col span="16"> 可以叫出說明 </Col>
    </Row>
    <Row :gutter="16">
      <Col span="8">雙擊滑鼠左鍵:</Col>
      <Col span="14"> 顯示該FormType規格 </Col>
    </Row>
    <Row :gutter="16">
      <Col span="8">ctrl + 滑鼠左鍵:</Col>
      <Col span="14"> 跳到在此檔案中定義field的位置 </Col>
    </Row>
    <Row :gutter="16">
      <Col span="8">alt + 鍵盤左:</Col>
      <Col span="14"> 回到跳轉之前的位置 </Col>
    </Row>
  </Modal>
</template>

<style scoped>
.text-block0 {
  position: absolute;
  background-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
  height: 95%;
  width: 100%;
  /* position: absolute;
      width: 100%;
      left: 5%; */
}

.text-block {
  white-space: pre-wrap;
  /* font-size: v-bind("fontSize"); */
  /* display: inline-block;
        /* max-width: 200px; */
  /* height: 100%; */
  /* position: absolute; */
  /* top: 50%; */
  /* display: flex; */
  /* justify-content: center; */
  /* align-items: center; */
}

.bar {
  background-color: rgb(75, 16, 16);
  position: absolute;
  left: 0;
  top: 0;
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

.element {
  /* font-family: MingLiU; */
  position: relative;
}

.comments {
  color: #3ba000;
}

.non {
  color: #d9ea79;
}

.focus-line {
  position: relative;
  background-color: rgb(27, 27, 27);
}
</style>
