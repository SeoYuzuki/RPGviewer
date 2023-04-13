<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { Button } from "view-ui-plus";

import { getContentByFile } from "../utils/A1Utils";
import AuxiliaryCross from "../utils/AuxiliaryCross";
import { parseRpgFile } from "../core/fileParse/RpgFileParser";
import { parseDdsFile } from "../core/fileParse/DDSFileParser";
import { getFieldInfoList } from "../core/FieldInfoParser";
import { FileInfo, ParsedLine } from "../types/parsedRpgFile";
import { FORM_TYPE_BAR_LIST } from "../dictionary/RPG_dictionary";
import { FieldInfo } from "../types/FieldInfo";
/** components */
import FormTypeAll from "./formType/FormTypeAll.vue";
import DssDrawer from "./DssDrawer.vue";
import ReadMe from "./ReadMe.vue";

let openAuxiliaryCross = AuxiliaryCross().openAuxiliaryCross;

/**
 * 上傳
 */

/** 上傳的檔案列表 */
let fileInfoMap = ref<Map<string, FileInfo>>(new Map());
/** 當前Tab名稱 */
let targetTabName = ref<string>("");
/** tab顯示清單 */
let tabList = ref<FileInfo[]>([]);
/** 當前渲染程式碼 */
const parsedRpgFile = computed(() => {
  return fileInfoMap.value.get(targetTabName.value)?.parsedLineList;
});

/**
 * 上傳DDS檔案事件
 */
async function handleUploadDDS(file: File): Promise<boolean> {
  try {
    let fileExtension = /[.]/.exec(file.name) ? file.name.split(".")[1] : "";
    let name = file.name.split(".")[0].trim();
    console.log(file, fileExtension);
    let dssInfo: FileInfo;
    let res = await getContentByFile(file);
    if (["dds", "pf"].includes(fileExtension.toLowerCase())) {
      let temp = parseDdsFile(res);
      dssInfo = {
        parsedLineList: temp,
        fileName: file.name,
        name: name,
        fileExtension: fileExtension,
      };
      tabList.value = tabList.value.filter((e) => e.name !== name);
      tabList.value.push(dssInfo);
      fileInfoMap.value.set(file.name.split(".")[0].trim(), dssInfo);
    } else if (["rpg"].includes(fileExtension.toLowerCase())) {
      // 依照不同From type解析每行
      let temp = parseRpgFile(res);
      dssInfo = {
        parsedLineList: temp,
        fileName: file.name,
        name: file.name.split(".")[0],
        fileExtension: fileExtension,
      };
      tabList.value = tabList.value.filter((e) => e.name !== name);
      tabList.value.push(dssInfo);
      fileInfoMap.value.set(file.name.split(".")[0].trim(), dssInfo);

      // 檢查是否有值得彈出提示或是超連結的欄位
      fieldInfoList.value = getFieldInfoList(temp);
    } else {
      console.log("not support file extension", fileExtension);
    }
  } catch (e) {
    console.log(e);
  }

  return false;
}

/** 欄位資訊 */
const fieldInfoList = ref<FieldInfo[]>([]);

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
    }
  });
});

function openTab(key: string) {
  console.log("openTab", { key, t: tabList.value });
  let temp = fileInfoMap.value.get(key.trim());
  if (temp) {
    if (!tabList.value.some((e) => e.name === key)) {
      tabList.value.push(temp);
    }
    changeTab(key);
  }
}

function changeTab(key: string) {
  console.log("changeTab", key, targetTabName.value);
  if (fileInfoMap.value.get(key.trim())) {
    targetTabName.value = key.trim();
  }
}

/**
 * tab 拖拉事件
 */
function handleDragDrop(
  name: string,
  newName: string,
  a: number,
  b: number,
  names: string
) {
  // names 为调整后的 name 集合
  tabList.value.splice(b, 1, ...tabList.value.splice(a, 1, tabList.value[b]));
}

function handleTabRemove(name: string) {
  console.log(name);
  tabList.value = tabList.value.filter((e) => e.name != name);
}
</script>

<template>
  <Drawer title="files" placement="right" :mask="false" v-model="isShowDrawer">
    <DssDrawer :dssInfoMap="fileInfoMap" @openTab="openTab" />
  </Drawer>
  <Row :gutter="16">
    <Upload multiple :before-upload="handleUploadDDS">
      <Button icon="ios-cloud-upload-outline">upload files</Button>
    </Upload>
    <Button @click="isShowDrawer = !isShowDrawer" type="primary">files</Button>

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
      <Button type="primary" @click="isShowReadMe = true"
        >Read Me{{ isShowReadMe }}</Button
      >
    </Col>
  </Row>
  <Tabs
    v-model="targetTabName"
    type="card"
    closable
    :draggable="true"
    @on-drag-drop="handleDragDrop"
    @on-tab-remove="handleTabRemove"
  >
    <TabPane
      v-for="(fileInfo, index) in tabList"
      :key="index"
      :label="fileInfo.fileName"
      :name="fileInfo.name"
    >
    </TabPane>
  </Tabs>
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

            {{ " " + (index + 1).toString().padStart(5, "0") }}
          </Poptip>
          <!-- 整行註解 -->
          <span v-if="rl.formType === 'comments'" class="comments">
            {{ rl.rawRl }}</span
          >
          <span v-else>
            <FormTypeAll
              :rl="rl"
              :fieldInfoList="fieldInfoList"
              @open-dds="changeTab"
            />
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
  <!-- <Modal v-model="isShowReadMe" title="RPG小助手 1.1.0">
    <Row :gutter="16">
      <Col span="24"> 目前主要支援F E I C 規格 </Col>
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
  </Modal> -->

  <ReadMe v-model:isShowReadMe="isShowReadMe" />
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

.text-block1 {
  background-color: rgb(42, 42, 42);
  color: rgb(255, 255, 255);
  /* height: 500px; */
  /* width: 700px; */
  font-family: "MingLiU";
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
