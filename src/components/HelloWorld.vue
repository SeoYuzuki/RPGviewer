<script setup lang="ts">
import { ref, onMounted, watch, nextTick, Ref } from "vue";
import { Button } from "view-ui-plus";

import AuxiliaryCross from "../utils/AuxiliaryCross";
import KeyPress from "../utils/KeyPress";
import { useMouse } from "../utils/mouse";

import { parseFile, fileInfoMap } from "../core/fileParse/fileParser";
import { FileInfo } from "../types/parsedRpgFile";
import { FieldInfo, Position } from "../types/FieldInfo";

/** components */
import FileDrawer from "./FileDrawer.vue";
import ReadMe from "./ReadMe.vue";
import JumpLine from "./JumpLine.vue";
import CodeView from "./CodeView.vue";

/** 十字線事件 */
let openAuxiliaryCross = AuxiliaryCross().openAuxiliaryCross;
let isCtrlPress: Ref<boolean> = KeyPress().isCtrlPress;

/**
 * 滑鼠位置
 */
const { x, y } = useMouse();

/**
 * 上傳
 */

/** tab顯示清單 */
const tabList = ref<FileInfo[]>([]);
/** 當前Tab名稱 */
const targetTabName = ref<string>("");

watch(fileInfoMap.value, () => {
  if (targetTabName.value === "") {
    targetTabName.value =
      Array.from(fileInfoMap.value.values()).pop()?.fileName ?? "";
  }
});

/**
 * 上傳檔案事件
 */
async function handleUpload(file: File): Promise<boolean> {
  parseFile(file, tabList);
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
  toPosition(positionHistList.value[positionHistIndex.value - 1]);
}

/**
 * 跳轉到行的資訊物件
 * 有點彆扭的實作，每tab去監聽此物件是否被更新，如果當前tab是自己，則移動到該行
 */
const toPositionObj = ref<{ targetTabName: string; index: number }>({
  targetTabName: "",
  index: 0,
});
function toPosition(position: Position) {
  openTab(position.fileName);
  /** 等Tab切換完成後再移動到位置 */
  nextTick(() => {
    toPositionObj.value = {
      targetTabName: targetTabName.value,
      index: position.index,
    };
  });
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
    toPosition(positionHistList.value[positionHistIndex.value - 1]);
  } else if (type === "ArrowRight") {
    if (positionHistIndex.value >= positionHistList.value.length) {
      return;
    }
    positionHistIndex.value++;
    toPosition(positionHistList.value[positionHistIndex.value - 1]);
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
        console.log("test");
      }
    }
  });
});

function openTab(key: string) {
  let fileName = key.trim();
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

const showCard = ref<boolean>(false);
const cardX = ref<number>();
const cardY = ref<number>();
const popFieldInfoList = ref<FieldInfo[]>([]);
const popPreNumber = ref<number>(0);
function popCard(temp: { fieldInfoList: FieldInfo[]; preIndex: number }) {
  popFieldInfoList.value = temp.fieldInfoList;
  popPreNumber.value = temp.preIndex;
  cardX.value = x.value;
  cardY.value = y.value;
  showCard.value = true;
}

function closePopTip() {
  showCard.value = false;
}
</script>

<template>
  <div
    v-if="showCard"
    class="ivu-modal-wrap"
    style="z-index: 998"
    @click="closePopTip"
  >
    <Card
      style="position: absolute"
      :style="{ top: cardY + 'px', left: cardX + 'px', 'z-index': 999 }"
    >
      <template v-for="e in popFieldInfoList">
        <span @click="scrollToRef(e.position, popPreNumber)">
          at {{ e.position.fileName }}, line:{{ e.position.index }}
        </span>
        <br />
      </template>
    </Card>
  </div>
  <Drawer title="files" placement="right" :mask="false" v-model="isShowDrawer">
    <FileDrawer :dssInfoMap="fileInfoMap" @openTab="openTab" />
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
        :to-position-obj="toPositionObj"
        @scrollToRef="scrollToRef"
        @popCard="popCard"
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

<style scoped></style>
