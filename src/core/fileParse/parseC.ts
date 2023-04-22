import { RPGContent } from "../../types/parsedRpgFile";
import { isBlank, isNotBlank, substr_by_bytes } from "../../utils/StringUtils"

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
    let contentMap: Map<string, RPGContent> = new Map();
    contentMap.set('HEAD_COMMENT', { value: substr_by_bytes(rl, 0, 5), class: "comments" });
    contentMap.set('Form_Type', { value: substr_by_bytes(rl, 5, 1), view: "KeywordField", dic: "Form_Type_Dic" });
    contentMap.set('Control_Level_Indicators', { value: substr_by_bytes(rl, 6, 2) });
    contentMap.set('N01', { value: substr_by_bytes(rl, 8, 3) });
    contentMap.set('N02', { value: substr_by_bytes(rl, 11, 3) });
    contentMap.set('N03', { value: substr_by_bytes(rl, 14, 3) });
    contentMap.set('Factor1', { value: substr_by_bytes(rl, 17, 7), view: "ParameterField" });
    contentMap.set('Reserved1', { value: substr_by_bytes(rl, 24, 3) });
    contentMap.set('Opcde', { value: substr_by_bytes(rl, 27, 5), view: "KeywordField", dic: "Opcde_Dic", class: "opcde" });
    contentMap.set('Factor2', { value: substr_by_bytes(rl, 32, 7), view: "ParameterField" });
    contentMap.set('Reserved2', { value: substr_by_bytes(rl, 39, 3) });
    contentMap.set('Result_Field', { value: substr_by_bytes(rl, 42, 6), view: "ParameterField" });
    contentMap.set('Field_Length', { value: substr_by_bytes(rl, 48, 3) });
    contentMap.set('Decimal_Positions', { value: substr_by_bytes(rl, 51, 1) });
    contentMap.set('Operation_Extender', { value: substr_by_bytes(rl, 52, 1) });
    contentMap.set('Resulting_Indicators_Hi', { value: substr_by_bytes(rl, 53, 2) });
    contentMap.set('Resulting_Indicators_Lo', { value: substr_by_bytes(rl, 55, 2) });
    contentMap.set('Resulting_Indicators_Eq', { value: substr_by_bytes(rl, 57, 2) });
    contentMap.set('Comments', { value: substr_by_bytes(rl, 59, 20), class: "comments" });

    return contentMap;
}
export default parseCalculationSpecification;