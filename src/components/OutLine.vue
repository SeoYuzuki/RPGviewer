<script setup lang="ts">
import { ref, computed } from "vue";
import { Position } from "../types/FieldInfo";
import { List, ListItem } from "view-ui-plus";
import { FileInfo, OutLineItem, ParsedLine } from "../types/parsedRpgFile";
const props = defineProps<{
  /** 當前Tab名稱 */
  targetTabName: string;
  /** 大綱 */
  outLine: OutLineItem[] | undefined;
}>();

const emit = defineEmits<{
  (e: "scrollToRef", position: Position, preIndex: number): void;
}>();

function scrollToRef(item: any) {
  console.log(item, props.targetTabName, {
    fileName: props.targetTabName,
    index: item.index,
  });
  emit(
    "scrollToRef",
    {
      fileName: props.targetTabName,
      index: item.index,
    },
    -1
  );
}
</script>

<template>
  <List class="list" border size="small">
    <template v-for="item in outLine">
      <ListItem>
        <div @click="scrollToRef(item)">
          {{ item.itemName }} at line:{{ item.index }}
        </div>
      </ListItem>
    </template>
  </List>
</template>

<style scoped>
.list {
  width: 100%;
}
</style>
