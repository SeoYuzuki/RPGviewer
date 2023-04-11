import { RPGContent } from "../types/parsedRpgFile";
import { isBlank, isNotBlank, substr_by_bytes } from "../utils/StringUtils"

/** parse Extension Specification
 * 
 * @param rl 原始行字串
 */
function parseExtensionSpecification(rl: string): Map<string, RPGContent> {
    let contentMap: Map<string, RPGContent> = new Map();
    contentMap.set('HEAD_COMMENT', { value: substr_by_bytes(rl, 0, 5), class: "comments" });
    contentMap.set('Form_Type', { value: substr_by_bytes(rl, 5, 1), view: "KeywordField", dic: "Form_Type_Dic" });
    contentMap.set('Reserved', { value: substr_by_bytes(rl, 6, 4) });
    contentMap.set('From_File_Name', { value: substr_by_bytes(rl, 10, 8) });
    contentMap.set('To_File_Name', { value: substr_by_bytes(rl, 18, 8) });
    contentMap.set('Array_or_Table_Name1', { value: substr_by_bytes(rl, 26, 6), view: "ParameterField" });
    contentMap.set('Entries_per_Record', { value: substr_by_bytes(rl, 32, 3) });
    contentMap.set('Entries_per_Array_or_Table', { value: substr_by_bytes(rl, 35, 4) });
    contentMap.set('Length_of_Entry1', { value: substr_by_bytes(rl, 39, 3) });
    contentMap.set('Data_Format1', { value: substr_by_bytes(rl, 42, 1) });
    contentMap.set('Decimal_Positions1', { value: substr_by_bytes(rl, 43, 1), view: "ParameterField" });
    contentMap.set('Sequence1', { value: substr_by_bytes(rl, 44, 1) });
    contentMap.set('Array_or_Table_Name2', { value: substr_by_bytes(rl, 45, 6), view: "ParameterField" });
    contentMap.set('Length_of_Entry2', { value: substr_by_bytes(rl, 51, 3) });
    contentMap.set('Data_Format2', { value: substr_by_bytes(rl, 54, 1) });
    contentMap.set('Decimal_Positions2', { value: substr_by_bytes(rl, 55, 1) });
    contentMap.set('Sequence2', { value: substr_by_bytes(rl, 56, 1) });
    contentMap.set('Comments', { value: substr_by_bytes(rl, 57, 23), class: "comments" });
    return contentMap;
};

export default parseExtensionSpecification;