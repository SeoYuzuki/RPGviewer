<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { Button } from "view-ui-plus";

import { getContentByFile } from "../utils/A1Utils";
import AuxiliaryCross from "../utils/AuxiliaryCross";
import { parseFile } from "../core/fileParse/fileParser";
import { linkMap, publicFieldInfoMap } from "../core/FieldInfoParser";
import { FileInfo, ParsedLine } from "../types/parsedRpgFile";
import { FORM_TYPE_BAR_LIST } from "../dictionary/RPG_dictionary";
import { FieldInfo, Position } from "../types/FieldInfo";
/** components */
import FileLine from "./lines/FileLine.vue";
import DssDrawer from "./DssDrawer.vue";
import ReadMe from "./ReadMe.vue";
import JumpLine from "./JumpLine.vue";
import CodeView from "./CodeView.vue";

/** 十字線事件 */
let openAuxiliaryCross = AuxiliaryCross().openAuxiliaryCross;

/**
 * 上傳
 */

/** 上傳的檔案列表 */
const fileInfoMap = ref<Map<string, FileInfo>>(new Map());
/** tab顯示清單 */
const tabList = ref<FileInfo[]>([]);

/** 當前Tab名稱 */
const targetTabName = ref<string>("");

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
    let res = await getContentByFile(file);
    let fileInfo: FileInfo = {
      parsedLineList: parseFile(res, name, fileExtension),
      fileRawName: file.name,
      fileName: name,
      fileExtension: fileExtension,
    };
    tabList.value = tabList.value.filter((e) => e.fileName !== name);
    tabList.value.push(fileInfo);
    fileInfoMap.value.set(file.name.split(".")[0].trim(), fileInfo);

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
    fileName: targetTabName.value,
    index: preIndex,
  });
  positionHistList.value.push(position);
  toPosition();
}

const divs = ref<any[]>([]);
function toPosition() {
  let position = positionHistList.value[positionHistIndex.value - 1];
  openTab(position.fileName);

  let el: Element = divs.value[position.index];
  if (el) {
    el.scrollIntoView();
  }
}

/**
 * 跳轉至前/後連結的位置
 * @param type
 */
function scrollToPrePostition(type: "ArrowRight" | "ArrowLeft") {
  if (type === "ArrowLeft") {
    if (positionHistIndex.value < 2) {
      return;
    }
    positionHistIndex.value--;
    toPosition();
  } else if (type === "ArrowRight") {
    if (positionHistIndex.value >= positionHistList.value.length) {
      return;
    }
    positionHistIndex.value++;
    toPosition();
  }
}

/**
 * onMounted
 */
onMounted(() => {
  window.addEventListener("keydown", (e) => {
    if (e.altKey) {
      if (e.key == "ArrowLeft" || e.key == "ArrowRight") {
        scrollToPrePostition(e.key);
      }

      if (e.key === "l") {
        isShowJumpLine.value = !isShowJumpLine.value;
      }
      if (e.key === "i") {
        console.log({
          // fieldInfoList: fieldInfoList.value,
          publicFieldInfoMap: publicFieldInfoMap.value,
          linkMap: linkMap.value,
        });
      }
    }
  });
});

function openTab(key: string) {
  let fileName = key.trim();
  console.log("openTab", { key: fileName, t: tabList.value });
  let temp = fileInfoMap.value.get(fileName);
  if (temp) {
    // 如果上方tab不存在則添加
    if (!tabList.value.some((e) => e.fileName === fileName)) {
      tabList.value.push(temp);
    }
    targetTabName.value = fileName.trim();
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
  tabList.value = tabList.value.filter((e) => e.fileName != name);
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
    <Col span="5">
      十字線(alt+s) <i-Switch v-model="openAuxiliaryCross"> </i-Switch>
    </Col>
    <Col span="3">
      <Button type="primary" @click="isShowReadMe = !isShowReadMe"
        >Read Me</Button
      >
    </Col>
  </Row>
  <Tabs
    v-model="targetTabName"
    type="card"
    closable
    :draggable="true"
    :animated="false"
    @on-drag-drop="handleDragDrop"
    @on-tab-remove="handleTabRemove"
  >
    <TabPane
      v-for="(fileInfo, index) in tabList"
      :key="index"
      :label="fileInfo.fileRawName"
      :name="fileInfo.fileName"
    >
      <CodeView
        :fileInfoMap="fileInfoMap"
        :targetTabName="fileInfo.fileName"
        @scrollToRef="scrollToRef"
      >
      </CodeView>
    </TabPane>
  </Tabs>

  <ReadMe v-model:isShowReadMe="isShowReadMe" />
  <JumpLine
    v-model:is-show="isShowJumpLine"
    :targetTabName="targetTabName"
    @jump-to-line="scrollToRef"
  />
</template>

<style scoped>
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
