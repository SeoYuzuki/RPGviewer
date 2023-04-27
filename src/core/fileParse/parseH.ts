import { RPGContent } from "../../types/parsedRpgFile";
import { ezCutUtil, isBlank, isNotBlank, substr_by_bytes } from "../../utils/StringUtils"

/** Control Specification
 * 
 * Position 6 (Form Type)
 * Positions 7-14 (Reserved)
 * Position 15 (Debug)
 * Positions 16-17 (Reserved)
 * Position 18 (Currency Symbol)
 * Position 19 (Date Format)
 * Position 20 (Date Edit)
 * Position 21 (Decimal Notation)
 * Positions 22-25 (Reserved)
 * Position 26 (Alternate Collating Sequence)
 * Positions 27-39 (Reserved)
 * Position 40 (Sign Handling)
 * Position 41 (Forms Alignment)
 * Position 42 (Reserved)
 * Position 43 (File Translation)
 * Positions 44-56 (Reserved)
 * Position 57 (Transparency Check)
 * Positions 58-74 (Reserved)
 * Positions 75-80 (Program Identification)
 * 
 * @param rl 原始行字串
 */
function parseControlSpecification(rl: string): Map<string, RPGContent> {
    let ezCut = ezCutUtil(rl);
    let contentMap: Map<string, RPGContent> = new Map();
    contentMap.set('HEAD_COMMENT', { value: ezCut(1, 5), class: "comments" });
    contentMap.set('Form_Type', { value: ezCut(6, 6), view: "KeywordField", dic: "Form_Type_Dic" });
    contentMap.set('Reserved1', { value: ezCut(7, 14) });
    contentMap.set('Debug', { value: ezCut(15, 15) });
    contentMap.set('Reserved2', { value: ezCut(16, 17) });
    contentMap.set('Currency Symbol', { value: ezCut(18, 18) });
    contentMap.set('Date Format', { value: ezCut(19, 19), view: "KeywordField", dic: "Date_Format" });
    contentMap.set('Date Edit', { value: ezCut(20, 20) });
    contentMap.set('Decimal Notation', { value: ezCut(21, 21) });
    contentMap.set('Reserved3', { value: ezCut(22, 25) });
    contentMap.set('Alternate Collating Sequence', { value: ezCut(26, 26) });
    contentMap.set('Reserved4', { value: ezCut(27, 39) });
    contentMap.set('Sign Handling', { value: ezCut(40, 40) });
    contentMap.set('Forms Alignment', { value: ezCut(41, 41) });
    contentMap.set('Reserved5', { value: ezCut(42, 42) });
    contentMap.set('File Translation', { value: ezCut(43, 43) });
    contentMap.set('Reserved6', { value: ezCut(44, 56) });
    contentMap.set('Transparency Check', { value: ezCut(57, 57) });
    contentMap.set('Reserved7', { value: ezCut(58, 74) });
    contentMap.set('Program Identification', { value: ezCut(75, 80) });

    return contentMap;
}
export default parseControlSpecification;