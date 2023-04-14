<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { Button } from "view-ui-plus";

import { getContentByFile } from "../utils/A1Utils";
import AuxiliaryCross from "../utils/AuxiliaryCross";
import { parseFile } from "../core/fileParse/fileParser";
import {
  privateFieldInfoMap,
  publicFieldInfoMap,
} from "../core/FieldInfoParser";
import { FileInfo, ParsedLine } from "../types/parsedRpgFile";
import { FORM_TYPE_BAR_LIST } from "../dictionary/RPG_dictionary";
import { FieldInfo } from "../types/FieldInfo";
/** components */
import FileLine from "./formType/FileLine.vue";
import DssDrawer from "./DssDrawer.vue";
import ReadMe from "./ReadMe.vue";
import JumpLine from "./JumpLine.vue";

/** 十字線事件 */
let openAuxiliaryCross = AuxiliaryCross().openAuxiliaryCross;

/**
 * 上傳
 */

/** 上傳的檔案列表 */
const fileInfoMap = ref<Map<string, FileInfo>>(new Map());
/** 當前Tab名稱 */
const targetTabName = ref<string>("");
/** tab顯示清單 */
const tabList = ref<FileInfo[]>([]);
/** 當前渲染程式碼 */
const parsedRpgFile = ref<ParsedLine[]>();
/** 該文件之欄位資訊 */
const targetFieldInfoList = ref<FieldInfo[]>([]);
/**
 * 當tab文件切換時
 */
watch(targetTabName, (val, oldVa) => {
  parsedRpgFile.value = fileInfoMap.value.get(val)?.parsedLineList;
  let temp = privateFieldInfoMap.value.get(val);
  console.log("fieldInfoList", temp);
  if (temp) {
    console.log("fieldInfoList", temp);
    targetFieldInfoList.value = temp;
  }
});

/** 欄位資訊清單 共用+各自檔案 */
const fieldInfoList = computed(() => {
  let temp: FieldInfo[] = [];
  console.log(publicFieldInfoMap.value);
  publicFieldInfoMap.value.forEach((e) => {
    console.log(e);
    temp = temp.concat(e);
  });
  return targetFieldInfoList.value.concat(temp);
});

/**
 * 上傳檔案事件
 */
async function handleUpload(file: File): Promise<boolean> {
  try {
    let fileExtension = (/[.]/.exec(file.name) ? file.name.split(".")[1] : "")
      .trim()
      .toLowerCase();
    let name = file.name.split(".")[0].trim();
    console.log(file, fileExtension);
    let dssInfo: FileInfo;
    let res = await getContentByFile(file);

    dssInfo = {
      parsedLineList: parseFile(res, name, fileExtension),
      fileName: file.name,
      name: name,
      fileExtension: fileExtension,
    };
    tabList.value = tabList.value.filter((e) => e.name !== name);
    tabList.value.push(dssInfo);
    fileInfoMap.value.set(file.name.split(".")[0].trim(), dssInfo);

    fileInfoMap.value.set(file.name.split(".")[0].trim(), dssInfo);

    // fieldInfoList.value = getFieldInfoList(temp);
    targetTabName.value = name;
  } catch (e) {
    console.log(e);
  }

  return false;
}

/** 是否顯示檔案抽屜 */
let isShowDrawer = ref<boolean>(false);
/** 是否顯示Read Me */
let isShowReadMe = ref<boolean>(false);
/** 是否顯示跳行 */
let isShowJumpLine = ref<boolean>(false);

let lineClicked = ref<number>(0);
let selectedBarModel = ref<string>();

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

const divs = ref<any[]>([]);
let prevPosition: number = 0;
function scrollToRef(position: number, _prevPosition?: number) {
  if (!_prevPosition) {
    _prevPosition = position;
  }
  console.log("scrollWin", position, _prevPosition);
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
      if (e.key == "ArrowLeft") {
        // 左
        scrollToRef(prevPosition, 0); //TODO
      }
      if (e.key === "l") {
        isShowJumpLine.value = !isShowJumpLine.value;
      }
      if (e.key === "i") {
        console.log(fieldInfoList.value, publicFieldInfoMap.value);
      }
    }
  });
});

function openTab(key: string) {
  key = key.trim();
  console.log("openTab", { key, t: tabList.value });
  let temp = fileInfoMap.value.get(key);
  if (temp) {
    // 如果上方tab不存在則添加
    if (!tabList.value.some((e) => e.name === key)) {
      tabList.value.push(temp);
    }
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
    <Upload multiple :before-upload="handleUpload">
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
              @open-dds="openTab"
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
  <ReadMe v-model:isShowReadMe="isShowReadMe" />
  <JumpLine v-model:is-show="isShowJumpLine" @jump-to-line="scrollToRef" />
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
