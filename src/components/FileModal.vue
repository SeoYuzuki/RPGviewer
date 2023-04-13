<script setup lang="ts">
import { ref, computed } from "vue";
import { FieldInfo } from "../types/FieldInfo";
import { FileInfo, ParsedLine } from "../types/parsedRpgFile";
const props = defineProps<{}>();

let isShowDdsInfo = ref<boolean>(false);
let fileInfo = ref<FileInfo>();
const divs = ref<any[]>([]);
const fieldInfoList = ref<FieldInfo[]>([]);
function getElementClass(index: number) {
  // TODO
}

function onElementClicked(rl: ParsedLine, index: number) {
  // TODO
}
</script>

<template>
  <Modal
    v-model="isShowDdsInfo"
    footer-hide
    draggable
    sticky
    scrollable
    width="900"
    :transfer="false"
    :mask="false"
    :title="fileInfo?.fileName"
  >
    <div class="text-block0">
      <div class="container">
        <div class="cont_elements">
          <div
            v-for="(rl, index) in fileInfo?.parsedLineList"
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
  </Modal>
</template>

<style scoped>
.text-block0 {
  /* position: absolute; */
  background-color: rgb(42, 42, 42);
  color: rgb(255, 255, 255);
  /* height: 500px; */
  /* width: 700px; */
  font-family: "MingLiU";
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
</style>
