<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { getContentByFile } from "../utils/A1Utils";
import { getAuxiliaryCrossHandler } from "../utils/AuxiliaryCross";
import { parseRpgFile } from "../core/RpgFileParser";
import { parseDdsFile } from "../core/DDSFileParser";
import { getFieldInfoList } from "../core/FieldInfoParser";
import { DssInfo, ParsedLine } from "../types/parsedRpgFile";
import { FORM_TYPE_BAR_LIST } from "../dictionary/RPG_dictionary";

import FormTypeAll from "./formType/FormTypeAll.vue";
import DssDrawer from "./DssDrawer.vue";

import { Button } from "view-ui-plus";
import { FieldInfo } from "../types/FieldInfo";

let lineValue: string = "";

/**
 * 上傳
 */
let dssInfoMap = ref<Map<string, DssInfo>>(new Map());
/**
 * 上傳DDS檔案事件
 */
async function handleUploadDDS(file: File): Promise<boolean> {
  try {
    console.log(file);
    let res = await getContentByFile(file);
    console.log(res);
    parsedRpgFile.value = parseDdsFile(res);
    let dssInfo: DssInfo = {
      parsedLineList: parsedRpgFile.value,
      name: file.name,
    };
    dssInfoMap.value.set(file.name, dssInfo);
  } catch (e) {
    console.log(e);
  }

  return false;
}
/** 被解析的RPG檔案 */
const parsedRpgFile = ref<ParsedLine[]>([]);
/** 欄位資訊 */
const fieldInfoList = ref<FieldInfo[]>([]);
/**
 * 上傳RPG檔案事件
 * @param file
 */
async function handleUpload(file: File): Promise<boolean> {
  try {
    let res = await getContentByFile(file);
    // 依照不同From type解析每行
    parsedRpgFile.value = parseRpgFile(res);
    // 檢查是否有值得彈出提示或是超連結的欄位
    fieldInfoList.value = getFieldInfoList(parsedRpgFile.value);
  } catch (e) {
    console.log(e);
  }

  return false;
}
let isShowDrawer = ref<boolean>(false);

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
  console.log(rl.formTypeSpecifications, index, rl, fieldInfoList.value);
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
function openDds(name: string) {
  console.log(name);
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

/**
 * DDS
 */
let isShowDdsInfo = ref<boolean>(false);
let targetDssInfo = ref<DssInfo>();
function showDdsInfo(key: string) {
  console.log("showDdsInfo", key);
  isShowDdsInfo.value = true;

  targetDssInfo.value = dssInfoMap.value.get(key);
}
</script>

<template>
  <Drawer title="DDS" placement="right" :mask="false" v-model="isShowDrawer">
    <DssDrawer :dssInfoMap="dssInfoMap" />
  </Drawer>
  <Row :gutter="16">
    <!-- <Col span="10">
      <input type="file" ref="file" @change="readFile($event)" />
    </Col> -->
    <Upload multiple :before-upload="handleUploadDDS">
      <Button icon="ios-cloud-upload-outline">upload DDS file</Button>
    </Upload>
    <Button @click="isShowDrawer = true" type="primary">Left</Button>
    <Upload :before-upload="handleUpload">
      <Button icon="ios-cloud-upload-outline">upload RPG file</Button>
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
    <Col span="18">
      {{
        "_____________________1_________2_________3_________4_________5_________6_________7_________8"
      }}</Col
    >
    <Col span="18">
      {{
        "____________12345678901234567890123456789012345678901234567890123456789012345678901234567890"
      }}</Col
    >
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
            <FormTypeAll :rl="rl" :fieldInfoList="fieldInfoList" />
            <span v-if="rl.formType === 'unknown'" class="non">
              {{ rl.rawRl }}</span
            >
            <span v-if="rl.formType === 'unknown2'" class="non2">
              {{ rl.rawRl }}</span
            >
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
  <Modal
    v-model="isShowDdsInfo"
    footer-hide
    draggable
    sticky
    scrollable
    width="900"
    :transfer="false"
    :mask="false"
    :title="targetDssInfo?.name"
  >
    <div class="text-block0">
      <div class="container">
        <div class="cont_elements">
          <div
            v-for="(rl, index) in targetDssInfo?.parsedLineList"
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
              <FormTypeAll
                :rl="rl"
                :fieldInfoList="fieldInfoList"
                @openDds="
                  (name) => {
                    showDdsInfo(name);
                  }
                "
              ></FormTypeAll>
              <span v-if="rl.formType === 'unknown'" class="non">
                {{ rl.rawRl }}</span
              >
              <span v-if="rl.formType === 'unknown2'" class="non2">
                {{ rl.rawRl }}</span
              >
            </span>
          </div>
        </div>
      </div>
    </div>
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

.non2 {
  color: #37f49c;
}

.focus-line {
  position: relative;
  background-color: rgb(27, 27, 27);
}
</style>
