<script setup lang="ts">
import { ref, computed } from "vue";
import {
  Keywords_Dic,
  KeywordsDic,
  Dic,
} from "../../dictionary/RPG_dictionary";
const props = withDefaults(
  defineProps<{
    keyword: string;
    dictionary: keyof KeywordsDic | undefined;
    span_class?: string;
  }>(),
  { span_class: "default_keyword" }
);

let keywordInfo: Dic | undefined;
if (props.dictionary) {
  keywordInfo = Keywords_Dic[props.dictionary].find(
    (e: any) => e.keyword === props.keyword
  );
}

function openUrl() {
  if (keywordInfo) {
    window.open(keywordInfo.website, "_blank")?.focus();
  }
}
</script>

<template>
  <Poptip
    v-if="keywordInfo"
    :title="keywordInfo.title"
    class="poptip"
    width="300"
    word-wrap
  >
    <span :class="span_class">{{ keyword }}</span>
    <template #content>
      <Ellipsis :text="keywordInfo.content" :length="150" tooltip />
      <Icon
        type="md-information-circle"
        :href="keywordInfo.website"
        @click="openUrl"
      />
    </template>
  </Poptip>
  <template v-else>
    <span :class="span_class">
      {{ keyword }}
    </span>
  </template>
</template>

<style scoped>
/* C type */
.opcde {
  color: #9ab5ff;
}

.default_keyword {
  color: #769bff;
}
</style>
