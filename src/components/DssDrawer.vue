<script setup lang="ts">
import { FileInfo, ParsedLine } from "../types/parsedRpgFile";

const props = defineProps<{
  dssInfoMap: Map<string, FileInfo>;
}>();
const emit = defineEmits<{
  (e: "openTab", name: string): void;
}>();

function showModal(key: string) {
  emit("openTab", key);
}
</script>

<template>
  <template v-for="[key, value] in dssInfoMap">
    <p @click="showModal(key)">{{ value.fileName }}</p>
  </template>
</template>

<style scoped></style>
