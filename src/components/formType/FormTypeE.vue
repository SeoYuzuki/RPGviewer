<script setup lang="ts">
import { ref, computed } from "vue";
import { ParsedLine } from "../../types/parsedRpgFile";
import ParameterField from "../fields/ParameterField.vue";
import KeywordField from "../fields/KeywordField.vue";
import { FieldInfo } from "../../types/FieldInfo";

const props = defineProps<{ rl: ParsedLine; field_info: FieldInfo[] }>();
const emit = defineEmits<{
  (e: "scrollToRef", position: number, prevPosition: number): void;
}>();

let formContent = props.rl.formContent;

function scrollToRef(position: number, prevPosition: number) {
  emit("scrollToRef", position, prevPosition);
}
</script>

<template>
  <span>
    <span class="comments">{{ rl.rawRl.substring(0, 5) }}</span>
    <KeywordField
      :keyword="rl.formType"
      dictionary="Form_Type_Dic"
    ></KeywordField>

    <span class="">{{ formContent.Reserved }}</span>
    <span class="">{{ formContent.From_File_Name }}</span>
    <span class="">{{ formContent.To_File_Name }}</span>
    <ParameterField
      :field-info-list="field_info"
      :field_text="formContent.Array_or_Table_Name1"
      :index="rl.index"
      @scroll-to-ref="scrollToRef"
    ></ParameterField>
    <span class="Entries_per_Record">{{ formContent.Entries_per_Record }}</span>
    <span class="Entries_per_Array_or_Table">{{
      formContent.Entries_per_Array_or_Table
    }}</span>
    <span class="Length_of_Entry1">{{ formContent.Length_of_Entry1 }}</span>
    <span class="">{{ formContent.Data_Format1 }}</span>
    <span class="">{{ formContent.Decimal_Positions1 }}</span>
    <span class="">{{ formContent.Sequence1 }}</span>

    <span class="">{{ formContent.Array_or_Table_Name2 }}</span>
    <span class="">{{ formContent.Length_of_Entry2 }}</span>
    <span class="">{{ formContent.Data_Format2 }}</span>
    <span class="">{{ formContent.Decimal_Positions2 }}</span>
    <span class="">{{ formContent.Sequence2 }}</span>

    <span class="comments">{{ formContent.Comments }}</span>
  </span>
</template>

<style scoped>
.comments {
  color: #3ba000;
}
.non {
  color: #e4e6d9;
}

.italic {
  font-style: italic;
}
</style>
