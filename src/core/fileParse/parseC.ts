import { RPGContent } from "../../types/parsedRpgFile";
import { ezCutUtil, isBlank, isNotBlank, substr_by_bytes } from "../../utils/StringUtils"

/** parse Calculation Specification
 * 
 * Position 6 (Form Type)
 * Positions 7-8 (Control Level)
 * Control Level Indicators
 * Last Record Indicator
 * Subroutine Identifier
 * AND/OR Lines Identifier
 * Positions 9-17 (Indicators)
 * Positions 18-27 (Factor 1)
 * Positions 28-32 (Operation)
 * Positions 33-42 (Factor 2)
 * Positions 43-48 (Result Field)
 * Positions 49-51 (Field Length)
 * Position 52 (Decimal Positions)
 * Position 53 (Operation Extender)
 * Positions 54-59 (Resulting Indicators)
 * Positions 60-74 (Comments)
 * Positions 75-80 (Comments)
 * 
 * @param rl 原始行字串
 */
function parseCalculationSpecification(rl: string): Map<string, RPGContent> {
    let ezCut = ezCutUtil(rl);
    let contentMap: Map<string, RPGContent> = new Map();
    contentMap.set('HEAD_COMMENT', { value: ezCut(1, 5), class: "comments" });
    contentMap.set('Form_Type', { value: ezCut(6, 6), view: "KeywordField", dic: "Form_Type_Dic" });
    contentMap.set('Control_Level_Indicators', { value: ezCut(7, 8) });
    contentMap.set('N01', { value: ezCut(9, 11) });
    contentMap.set('N02', { value: ezCut(12, 14) });
    contentMap.set('N03', { value: ezCut(15, 17) });
    contentMap.set('Factor1', { value: ezCut(18, 27), view: "ParameterField" });
    // contentMap.set('Reserved1', { value: substr_by_bytes(rl, 24, 3) });
    contentMap.set('Opcde', { value: ezCut(28, 32), view: "KeywordField", dic: "Opcde_Dic", class: "opcde" });
    contentMap.set('Factor2', { value: ezCut(33, 42), view: "ParameterField" });
    // contentMap.set('Reserved2', { value: substr_by_bytes(rl, 39, 3) });
    contentMap.set('Result_Field', { value: ezCut(43, 48), view: "ParameterField" });
    contentMap.set('Field_Length', { value: ezCut(49, 51) });
    contentMap.set('Decimal_Positions', { value: ezCut(52, 52) });
    contentMap.set('Operation_Extender', { value: ezCut(53, 53) });
    contentMap.set('Resulting_Indicators_Hi', { value: ezCut(54, 55) });
    contentMap.set('Resulting_Indicators_Lo', { value: ezCut(56, 57) });
    contentMap.set('Resulting_Indicators_Eq', { value: ezCut(58, 59) });
    contentMap.set('Comments1', { value: ezCut(60, 74), class: "comments" });
    contentMap.set('Comments2', { value: ezCut(75, 80), class: "comments" });

    return contentMap;
}
export default parseCalculationSpecification;