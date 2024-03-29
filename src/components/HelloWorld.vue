<script setup lang="ts">
import { ref, onMounted, watch, nextTick, Ref, computed } from "vue";
import { Button, Col, Tabs } from "view-ui-plus";
/** utils */
import AuxiliaryCross from "../utils/AuxiliaryCross";
import KeyPress from "../utils/KeyPress";
import { useMouse } from "../utils/mouse";
/** types */
import { parseFile, fileInfoMap } from "../core/fileParse/fileParser";
import { FileInfo } from "../types/parsedRpgFile";
import { FieldInfo, Position } from "../types/FieldInfo";
import { TabContextData } from "../types/TabContextData";
/** components */
import FileDrawer from "./FileDrawer.vue";
import ReadMe from "./ReadMe.vue";
import JumpLine from "./JumpLine.vue";
import CodeView from "./CodeView.vue";
import { ICodeView } from "../types/ICodeView";

/** 十字線事件 */
let openAuxiliaryCross = AuxiliaryCross().openAuxiliaryCross;
let isCtrlPress: Ref<boolean> = KeyPress().isCtrlPress;

/**
 * 滑鼠位置
 */
const { x, y } = useMouse();

/** 上選單開關 */
const upHere = ref<boolean>(true);

/**
 * 上傳
 */

/** tab顯示清單 */
const tabList1 = ref<FileInfo[]>([]);
const tabList2 = ref<FileInfo[]>([]);

/** 當前Tab名稱 */
const targetTabName1 = ref<string>("");
const targetTabName2 = ref<string>("");

watch(fileInfoMap.value, () => {
  if (targetTabName1.value === "") {
    targetTabName1.value =
      Array.from(fileInfoMap.value.values()).pop()?.fileName ?? "";
  }
});

/**
 * 上傳檔案事件
 */
async function handleUpload(file: File): Promise<boolean> {
  parseFile(file, tabList1);
  upHere.value = false;
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

/**
 *
 * @param position 目標位置
 * @param preIndex 前位置，紀錄導向歷史用，-1表示不記錄
 */
function scrollToRef(position: Position, preIndex: number) {
  if (preIndex != -1) {
    positionHistList.value = positionHistList.value.slice(
      0,
      positionHistIndex.value - 1
    );
    positionHistIndex.value = positionHistIndex.value + 1;
    positionHistList.value.push({
      fileName: targetTabName1.value,
      index: preIndex,
    });
    positionHistList.value.push(position);
  }
  toPosition(position);
}

/** codeView元件清單 */
const codeViewList = ref<any>([]);

/**
 * 跳到指定TAB 指定行數
 * @param position
 */
function toPosition(position: Position) {
  let codeView: ICodeView | undefined = undefined;

  if (position.fileName == targetTabName1.value) {
    // 用for迴圈查找ref list, 不直接用ref綁定成Map是因為效能
    for (const temp of codeViewList.value) {
      if (temp.getName() === position.fileName) {
        codeView = temp;
      }
    }
    if (codeView) {
      codeView.scrollByIndex(position.index);
    }

    return;
  }
  openTab(position.fileName);
  /** 等Tab切換完成後再移動到位置  */
  nextTick(() => {
    for (const temp of codeViewList.value) {
      if (temp.getName() === position.fileName) {
        codeView = temp;
      }
    }
    if (codeView) {
      codeView.scrollByIndex(position.index);
    }
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
        e.preventDefault(); // 防止瀏覽器操作
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

/**
 * 開啟對應TAB，若TAB已關閉則開啟
 * @param key
 */
function openTab(key: string) {
  let fileName = key.trim();
  let temp = fileInfoMap.value.get(fileName);
  if (temp) {
    if (tabList1.value.some((e) => e.fileName === fileName)) {
      targetTabName1.value = fileName.trim();
    } else if (tabList2.value.some((e) => e.fileName === fileName)) {
      targetTabName2.value = fileName.trim();
    } else {
      // 如果上方tab不存在則添加
      tabList1.value.push(temp);
      targetTabName1.value = fileName.trim();
    }
  }
}

/** 暫存右鍵觸發TAB對象 */
let tabContextData: TabContextData;
/**
 * tab右鍵事件母事件，對任意tab頁籤按下右鍵即會觸發
 * @param data
 */
function handleContextMenu(data: TabContextData) {
  tabContextData = data;
}

/** 左TAB長度 */
const tab1length = computed(() => {
  return tabList2.value.length === 0 ? 24 : 12;
});

/**
 * TAB右鍵下選單功能，左移或右移
 * @param tabId 1右移 2左移
 */
function handleTabShift(tabId: number) {
  if (tabId === 1) {
    let fileName = tabContextData.name;
    let temp = fileInfoMap.value.get(fileName);
    if (temp) {
      if (!tabList2.value.some((e) => e.fileName === fileName)) {
        tabList2.value.push(temp);
      }
      targetTabName2.value = fileName.trim();
    }
    tabList1.value = tabList1.value.filter((e) => e.fileName != fileName);
  } else if (tabId === 2) {
    let fileName = tabContextData.name;
    let temp = fileInfoMap.value.get(fileName);
    if (temp) {
      if (!tabList1.value.some((e) => e.fileName === fileName)) {
        tabList1.value.push(temp);
      }
      targetTabName1.value = fileName.trim();
    }
    tabList2.value = tabList2.value.filter((e) => e.fileName != fileName);
  }
}

/**
 * tab 拖拉事件
 */
function handleDragDropTest(
  name: string,
  newName: string,
  a: number,
  b: number,
  names: string,
  tabId: number
): any {
  console.log({ a, b, tabId });
  let tabList = tabId === 1 ? tabList1 : tabList2;
  tabList.value.splice(b, 1, ...tabList.value.splice(a, 1, tabList.value[b]));
}

/**
 * tab移除元件事件
 * @param name
 * @param tabId
 */
function handleTabRemove(name: string, tabId: number) {
  let tabList = tabId === 1 ? tabList1 : tabList2;
  tabList.value = tabList.value.filter((e) => e.fileName != name);
}

/**
 * 同名提示區
 */
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
  <!-- 上方選單感應開關 -->
  <div style="display: flex; justify-content: center; width: 100%">
    <div class="top" @mouseover="upHere = true">==================</div>
  </div>

  <!-- 上方抽屜 -->
  <Drawer placement="top" height="7px" :closable="false" v-model="upHere">
    <Row :gutter="16">
      <Upload multiple :before-upload="handleUpload">
        <Button icon="ios-cloud-upload-outline">upload files</Button>
      </Upload>
      <Button @click="isShowDrawer = !isShowDrawer" type="primary"
        >files
      </Button>

      <Col span="4">
        十字線(alt+s) <i-Switch v-model="openAuxiliaryCross"> </i-Switch>
      </Col>
      <Col span="4">
        <Button type="primary" @click="isShowReadMe = !isShowReadMe">
          Read Me
        </Button>
      </Col>
    </Row>
  </Drawer>

  <Row>
    <Col :span="tab1length">
      <Tabs
        v-model="targetTabName1"
        type="card"
        closable
        :draggable="true"
        :animated="false"
        @on-drag-drop="(...args) => handleDragDropTest(...args, 1)"
        @on-tab-remove="handleTabRemove($event, 1)"
        @on-contextmenu="handleContextMenu"
      >
        <TabPane
          v-for="(fileInfo, index) in tabList1"
          :key="index"
          :label="fileInfo.fileRawName"
          :name="fileInfo.fileName"
          context-menu
        >
          <CodeView
            ref="codeViewList"
            :fileInfoMap="fileInfoMap"
            :targetTabName="fileInfo.fileName"
            @scrollToRef="scrollToRef"
            @popCard="popCard"
          >
          </CodeView>
        </TabPane>

        <template #contextMenu>
          <DropdownItem @click="handleTabShift(1)">右移</DropdownItem>
        </template>
      </Tabs>
    </Col>
    <Col v-if="tab1length === 12" span="12">
      <Tabs
        v-model="targetTabName2"
        type="card"
        closable
        :draggable="true"
        :animated="false"
        @on-drag-drop="(...args) => handleDragDropTest(...args, 2)"
        @on-tab-remove="handleTabRemove($event, 2)"
        @on-contextmenu="handleContextMenu"
      >
        <TabPane
          v-for="(fileInfo, index) in tabList2"
          :key="index"
          :label="fileInfo.fileRawName"
          :name="fileInfo.fileName"
          context-menu
        >
          <CodeView
            ref="codeViewList"
            :fileInfoMap="fileInfoMap"
            :targetTabName="fileInfo.fileName"
            @scrollToRef="scrollToRef"
            @popCard="popCard"
          >
          </CodeView>
        </TabPane>
        <template #contextMenu>
          <DropdownItem @click="handleTabShift(2)">左移</DropdownItem>
        </template>
      </Tabs>
    </Col>
  </Row>

  <ReadMe v-model:isShowReadMe="isShowReadMe" />

  <JumpLine
    v-model:is-show="isShowJumpLine"
    :targetTabName="targetTabName1"
    @jump-to-line="scrollToRef"
  />

  <!-- 右方抽屜 -->
  <Drawer title="files" placement="right" :mask="false" v-model="isShowDrawer">
    <FileDrawer :dssInfoMap="fileInfoMap" @openTab="openTab" />
  </Drawer>

  <!-- 同名欄位區 -->
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
</template>

<style scoped>
.top {
  width: 100px;
  color: rgb(112, 112, 112);
  font-weight: bold;
  display: flex;
  justify-content: center;
}
</style>
