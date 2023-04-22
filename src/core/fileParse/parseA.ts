import { RPGContent } from "../../types/parsedRpgFile";
import { isBlank, isNotBlank, substr_by_bytes, ezCutUtil } from "../../utils/StringUtils"


// Positional entries for physical and logical files (positions 1 through 44)
// https://www.ibm.com/docs/en/i/7.1?topic=dplfud-positional-entries-physical-logical-files-positions-1-through-44

// Positional entries for display files (positions 1 through 44)
// https://www.ibm.com/docs/en/i/7.1?topic=ddfd-positional-entries-display-files-positions-1-through-44

/**
 * 
 */
function parseDDS_PF(rl: string): Map<string, RPGContent> {
    let ezCut = ezCutUtil(rl);

    let contentMap: Map<string, RPGContent> = new Map();
    contentMap.set('HEAD_COMMENT', { value: ezCut(1, 5), class: "comments" });
    contentMap.set('Form Type', { value: ezCut(6, 6), view: "KeywordField", dic: "Form_Type_Dic" });
    contentMap.set('Condition', { value: ezCut(7, 16) }); // Leave these positions blank unless you use them for comment text.

    /**
Name entry      Description                                 Type of file
R               Specifies a record format name              All
blank           Specifies a field name                      All
K               Specifies a key field name                  Physical and logical only
S               Specifies a select field name               Logical only
O               Specifies an omit field name                Logical only
J               Specifies this as a join specification      Join logical only
H               Specifies this as a help specification      Display only
     */
    contentMap.set('Type of Name', { value: ezCut(17, 17), class: "record" });
    contentMap.set('Reserved1', { value: ezCut(18, 18) });
    contentMap.set('Name', { value: ezCut(19, 28), view: "ParameterField" });
    contentMap.set('Reference', { value: ezCut(29, 29) });
    contentMap.set('Length', { value: ezCut(30, 34) });
    /**
     * Entry keyboard shifts    Meaning                     Data type permitted
       Blank                    Default    
       X                        Alphabetic only             Character
       A                        Alphanumeric shift          Character
       N                        Numeric shift               Character or numeric
       S                        Signed numeric              Numeric
       Y                        Numeric only                Numeric
       W                        Katakana (for Japan only)   Character
       I                        Inhibit keyboard entry      Character or numeric
       D                        Digits only                 Character or numeric
       M                        Numeric only                character Character
       Data type
       F                        Floating point              Numeric
       L                        Date
       T                        Time
       Z                        Timestamp
     */
    contentMap.set('Data type and keyboard shift', { value: ezCut(35, 35), view: "KeywordField", dic: "Data_Type_And_Keyboard_Shift" });

    contentMap.set('Decimal positions', { value: ezCut(36, 37) });
    contentMap.set('Usage', { value: ezCut(38, 38) }); // Blank or O , I,B,H,M,P
    contentMap.set('Location', { value: ezCut(39, 44) });
    contentMap.set('DDS keyword entries', { value: ezCut(45, 80) });
    return contentMap;
}

/**
 * 描述連續行 只有functions欄位有資料的行 
 * 不確定這樣劃分是否會有問題 須注意!
 * @param rl 
 * @returns 
 */
function parseDDS_FunctionsLine(rl: string): Map<string, RPGContent> {
    let ezCut = ezCutUtil(rl);

    let contentMap: Map<string, RPGContent> = new Map();
    contentMap.set('HEAD_COMMENT', { value: ezCut(1, 5), class: "comments" });
    contentMap.set('Form Type', { value: ezCut(6, 6), view: "KeywordField", dic: "Form_Type_Dic" });
    contentMap.set('Reserved?', { value: ezCut(7, 44) });
    contentMap.set('DDS keyword entries', { value: ezCut(45, 80) });
    return contentMap;
}



export {
    parseDDS_PF,
    parseDDS_FunctionsLine
};