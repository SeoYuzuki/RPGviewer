import { RPGContent } from "../../types/parsedRpgFile";
import { ezCutUtil } from "../../utils/StringUtils"

/** parse Extension Specification
 * 
 * https://www.ibm.com/docs/en/rdfi/9.6.0?topic=SSAE4W_9.6.0/com.ibm.etools.iseries.langref.doc/evferlsh69.html#HDREXTSPSS
 * 
Position 6 (Form Type)
Positions 7-10 (Reserved)
Positions 11-18 (From File Name)
Positions 19-26 (To File Name)
Positions 27-32 and 46-51 (Array or Table Name)
Positions 33-35 (Entries per Record)
Positions 36-39 (Entries per Array or Table)
Positions 40-42 and 52-54 (Length of Entry)
Positions 43 and 55 (Data Format)
Positions 44 and 56 (Decimal Positions)
Position 45 and 57 (Sequence)
Positions 46-57 (Second Array Description)
Positions 58-59 (Comments)
Positions 60-80 (Comments)
 * @param rl 原始行字串
 */
function parseExtensionSpecification(rl: string): Map<string, RPGContent> {
    let ezCut = ezCutUtil(rl);
    let contentMap: Map<string, RPGContent> = new Map();
    contentMap.set('HEAD_COMMENT', { value: ezCut(1, 5), class: "comments" });
    contentMap.set('Form_Type', { value: ezCut(6, 6), view: "KeywordField", dic: "Form_Type_Dic" });
    contentMap.set('Reserved', { value: ezCut(7, 10) });
    contentMap.set('From_File_Name', { value: ezCut(11, 18) });
    contentMap.set('To_File_Name', { value: ezCut(19, 26) });
    contentMap.set('Array_or_Table_Name1', { value: ezCut(27, 32), view: "ParameterField" });
    contentMap.set('Entries_per_Record', { value: ezCut(33, 35) });
    contentMap.set('Entries_per_Array_or_Table', { value: ezCut(36, 39) });
    contentMap.set('Length_of_Entry1', { value: ezCut(40, 42) });
    contentMap.set('Data_Format1', { value: ezCut(43, 43) });
    contentMap.set('Decimal_Positions1', { value: ezCut(44, 44), view: "ParameterField" });
    contentMap.set('Sequence1', { value: ezCut(45, 45) });
    contentMap.set('Array_or_Table_Name2', { value: ezCut(46, 51), view: "ParameterField" });
    contentMap.set('Length_of_Entry2', { value: ezCut(52, 54) });
    contentMap.set('Data_Format2', { value: ezCut(55, 55) });
    contentMap.set('Decimal_Positions2', { value: ezCut(56, 56) });
    contentMap.set('Sequence2', { value: ezCut(57, 57) });
    contentMap.set('Comments', { value: ezCut(58, 80), class: "comments" });
    return contentMap;
};

export default parseExtensionSpecification;