<script setup lang="ts">
import { ref, computed } from "vue";
import { Poptip } from "view-ui-plus";
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

// let keywordInfo: Dic | undefined;
// if (props.dictionary) {
//   keywordInfo = Keywords_Dic[props.dictionary].find(
//     (e: any) => e.keyword === props.keyword
//   );
// }

const keywordInfo = computed(() => {
  if (props.dictionary) {
    return Keywords_Dic[props.dictionary].find(
      (e: any) => e.keyword === props.keyword
    );
  }

  return undefined;
});

function openUrl() {
  if (keywordInfo) {
    window.open(keywordInfo.value?.website, "_blank")?.focus();
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
    transfer
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
.light-yellow {
  color: #fffa68;
}
.white {
  color: #ffffff;
}

.default_keyword {
  color: #769bff;
}
</style>
