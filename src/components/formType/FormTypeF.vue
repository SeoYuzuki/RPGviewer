<script setup lang="ts">
import { ref, computed } from "vue";
import { ParsedLine } from "../../types/parsedRpgFile";
import ParameterField from "../fields/ParameterField.vue";
import KeywordField from "../fields/KeywordField.vue";
import { FieldInfo } from "../../types/FieldInfo";

const props = defineProps<{ rl: ParsedLine; field_info: FieldInfo[]  }>();
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
    <span v-if="rl.formTypeSpecifications == 'Record_Identification'">
      <span class="comments">{{ rl.rawRl.substring(0, 5) }}</span>
      <KeywordField
        :keyword="rl.formType"
        dictionary="Form_Type_Dic"
      ></KeywordField>
      <ParameterField
        :field-info-list="field_info"
        :field_text="formContent.Record_Name"
        :index="rl.index"
        @scroll-to-ref="scrollToRef"
      ></ParameterField>
      <span class="">{{ formContent.Reserved1 }}</span>
      <span class="Record_Identifying_Indicator">{{
        formContent.Record_Identifying_Indicator
      }}</span>
      <span class="">{{ formContent.Record_Identification_Code }}</span>
      <span class="">{{ formContent.Reserved2 }}</span>
      <span class="Comments">{{ formContent.Comments }}</span>
    </span>

    <span v-else-if="rl.formTypeSpecifications == 'Field_Description'">
      <span class="comments">{{ rl.rawRl.substring(0, 5) }}</span>
      <KeywordField
        :keyword="rl.formType"
        dictionary="Form_Type_Dic"
      ></KeywordField>
      <span class="">{{ formContent.Reserved1 }}</span>
      <span class="External_Field_Name">{{
        formContent.External_Field_Name
      }}</span>
      <span class="">{{ formContent.Reserved2 }}</span>
      <ParameterField
        :field-info-list="field_info"
        :field_text="formContent.Field_Name"
        :index="rl.index"
        @scroll-to-ref="scrollToRef"
      ></ParameterField>
      <span class="">{{ formContent.Control_Level }}</span>
      <span class="Matching_Fields">{{ formContent.Matching_Fields }}</span>
      <span class="">{{ formContent.Reserved3 }}</span>
      <span class="Externally_Described_Field_Indicators">{{
        formContent.Externally_Described_Field_Indicators
      }}</span>
      <span class="">{{ formContent.Reserved4 }}</span>
      <span class="Comments">{{ formContent.Comments }}</span>
    </span>

    <span v-else-if="rl.formTypeSpecifications == 'Data_Structure'">
      <span class="comments">{{ rl.rawRl.substring(0, 5) }}</span>
      <KeywordField
        :keyword="rl.formType"
        dictionary="Form_Type_Dic"
      ></KeywordField>
      <ParameterField
        :field-info-list="field_info"
        :field_text="formContent.Data_Structure_Name"
        :index="rl.index"
        @scroll-to-ref="scrollToRef"
      ></ParameterField>
      <span class="Reserved1">{{ formContent.Reserved1 }}</span>
      <span class="External_Description">{{
        formContent.External_Description
      }}</span>
      <span class="Option">{{ formContent.Option }}</span>
      <KeywordField
        class="Record_Identifying_Indicator"
        dictionary="Record_Identifying_Indicator_Dic"
        :keyword="formContent.Record_Identifying_Indicator"
      >
      </KeywordField>
      <span class="External_File_Name">{{
        formContent.External_File_Name
      }}</span>
      <span class="Reserved2">{{ formContent.Reserved2 }}</span>
      <span class="Data_Structure_Occurrences">{{
        formContent.Data_Structure_Occurrences
      }}</span>
      <span class="Length">{{ formContent.Length }}</span>
      <span class="Reserved">{{ formContent.Reserved }}</span>
      <span class="Comments">{{ formContent.Comments }}</span>
    </span>
    <span v-else-if="rl.formTypeSpecifications == 'Data_Structure_Subfield'">
      <span class="comments">{{ rl.rawRl.substring(0, 5) }}</span>
      <KeywordField
        :keyword="rl.formType"
        dictionary="Form_Type_Dic"
      ></KeywordField>
      <span class="">{{ formContent.Reserved1 }}</span>
      <span class="">{{ formContent.Initialization_Option }}</span>
      <span class="">{{ formContent.Reserved2 }}</span>
      <template v-if="formContent.Initialization_Option !== 'I'">
        <span name="External_Field_Name">{{
          formContent.External_Field_Name
        }}</span>
        <span name="Reserved3">{{ formContent.Reserved3 }}</span>
      </template>
      <span v-else class="static_string" name="Initialization_Value">{{
        formContent.Initialization_Value
      }}</span>
      <span class="">{{ formContent.Internal_Data_Format }}</span>
      <span class="">{{ formContent.Field_Location }}</span>
      <span class="static_number">{{ formContent.Decimal_Positions }}</span>
      <ParameterField
        :field-info-list="field_info"
        :field_text="formContent.Field_Name"
        :index="rl.index"
        @scroll-to-ref="scrollToRef"
      ></ParameterField>
      <span class="">{{ formContent.Reserved4 }}</span>
      <span class="">{{ formContent.Comments }}</span>
    </span>

    <span v-else> {{ rl.rawRl }} else </span>
  </span>
</template>

<style scoped>
.comments {
  color: #3ba000;
}
</style>
