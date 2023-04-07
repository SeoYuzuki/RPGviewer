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
    <span class="Control_Level_Indicators">
      {{ formContent.Control_Level_Indicators }} 
    </span>
    <span class="N01">{{ formContent.N01 }}</span>
    <span class="N02">{{ formContent.N02 }}</span>
    <span class="N03">{{ formContent.N03 }}</span>
    <!-- <span class="Factor1">{{formContent.Factor1}}</span> -->
    <ParameterField
      :field-info-list="field_info"
      :field_text="formContent.Factor1"
      :index="rl.index"
      @scroll-to-ref="scrollToRef"
    >
    </ParameterField>
    <span class="">{{ formContent.Reserved1 }}</span>
    <!-- opcode -->
    <KeywordField
      :keyword="formContent.Opcde"
      dictionary="Opcde_Dic"
      span_class="opcde"
    ></KeywordField>
    <!-- <span class="Factor2">{{formContent.Factor2}}</span> -->
    <ParameterField
      :field-info-list="field_info"
      :field_text="formContent.Factor2"
      :index="rl.index"
      @scroll-to-ref="scrollToRef"
    >
    </ParameterField>
    <span class="">{{ formContent.Reserved2 }}</span>
    <!-- result field -->
    <ParameterField
      :field-info-list="field_info"
      :field_text="formContent.Result_Field"
      :index="rl.index"
      @scroll-to-ref="scrollToRef"
    >
    </ParameterField>
    <span class="Field_Length">{{ formContent.Field_Length }}</span>
    <span class="Decimal_Positions">{{ formContent.Decimal_Positions }}</span>
    <span class="Operation_Extender">{{
      formContent.Operation_Extender
    }}</span>
    <span class="Resulting_Indicators_Hi">{{
      formContent.Resulting_Indicators_Hi
    }}</span>
    <span class="Resulting_Indicators_Lo">{{
      formContent.Resulting_Indicators_Lo
    }}</span>
    <span class="Resulting_Indicators_Eq">{{
      formContent.Resulting_Indicators_Eq
    }}</span>
    <span class="comments"> {{ formContent.Comments }} </span>
  </span>
</template>

<style scoped>
.comments {
  color: #3ba000;
}
</style>
