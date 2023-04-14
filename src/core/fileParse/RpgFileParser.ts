import { isBlank, isNotBlank, substr_by_bytes, ezCutUtil } from "../../utils/StringUtils"
import { ParsedLine, RPGContent } from "../../types/parsedRpgFile"
import parseExtensionSpecification from "../parseE"
import parseCalculationSpecification from "../parseC"
import {
    parseRecordIdentificationEntries_I
    , parseFieldDescriptionEntries_J
    , parseRecordIdentificationEntries_IX
    , parseFieldDescriptionEntries_JX
    , parseDataStructureSpecificationEntries
    , parseDataStructureSubfieldSpecifications
    , parseNamedConstantSpecifications
} from "../parseI"

import { parseContinuationLines, parseFileDescriptionSpecification } from "../parseF"

/** https://www.ibm.com/docs/en/rdfi/9.6.0?topic=rpg400-language-reference#ToC_286 */

const parseRpgFile = function (_rpgFile: string): ParsedLine[] {
    let rpgFile = _rpgFile.split('\r\n');
    let parsedRpgFile: ParsedLine[] = [];
    for (let i = 0; i < rpgFile.length; i++) {
        let rl = rpgFile[i];
        // C卡
        if (rl[6] !== '*') {
            if (rl[5] === 'F') {
                let ezCut = ezCutUtil(rl);
                if (ezCut(53, 53) !== 'K') {
                    parsedRpgFile.push({
                        index: i,
                        rawRl: rl,
                        formType: "F",
                        formTypeSpecifications: "File_Description",
                        contentMap: parseFileDescriptionSpecification(rl)
                    });
                } else if (ezCut(53, 53) === 'K') {
                    parsedRpgFile.push({
                        index: i,
                        rawRl: rl,
                        formType: "F",
                        formTypeSpecifications: "Continuation_Lines",
                        contentMap: parseContinuationLines(rl)
                    });
                }
                else {
                    parsedRpgFile.push({
                        index: i,
                        rawRl: rl,
                        formType: "unknown2",
                        contentMap: new Map()
                    });
                }
            } else if (rl[5] === 'E') {
                // Extension Specification 
                parsedRpgFile.push({
                    index: i,
                    rawRl: rl,
                    formType: "E",
                    formTypeSpecifications: "Extension_Specification",
                    contentMap: parseExtensionSpecification(rl),
                });
            } else if (rl[5] === 'C') {
                // Calculation_Specification
                parsedRpgFile.push({
                    index: i,
                    rawRl: rl,
                    formType: "C",
                    formTypeSpecifications: "Calculation_Specification",
                    contentMap: parseCalculationSpecification(rl)
                });
            } else if (rl[5] === 'I') {
                let ezCut = ezCutUtil(rl);
                if (isBlank(ezCut(15, 18)) && isBlank(ezCut(42, 74)) && isNotBlank(ezCut(7, 14)) && ezCut(19, 20) != 'DS') {
                    /** Input spec record identification external (IX prompt) */
                    parsedRpgFile.push({
                        index: i,
                        rawRl: rl,
                        formType: "I",
                        formTypeSpecifications: "Record_Identification_External",
                        contentMap: parseRecordIdentificationEntries_IX(rl)
                    });
                    let j = 1;
                    for (; ; j++) {
                        let tempRl = rpgFile[i + j];
                        let tempEzCut = ezCutUtil(tempRl);
                        if (tempRl[6] === '*') {
                            parsedRpgFile.push({
                                index: i + j,
                                rawRl: tempRl,
                                formType: "comments",
                                contentMap: new Map()
                            });
                            continue;
                        } else if (substr_by_bytes(tempRl, 18, 2) === 'DS'
                            || tempEzCut(6, 6) !== 'I'
                            || isNotBlank(tempEzCut(15, 18))
                            || !(isBlank(tempEzCut(7, 20)) && isBlank(tempEzCut(44, 52)) && isBlank(tempEzCut(59, 74)))
                        ) {
                            break;
                        }
                        /** Input spec field description external (JX prompt) */
                        parsedRpgFile.push({
                            index: i + j,
                            rawRl: tempRl,
                            formType: "I",
                            formTypeSpecifications: "Field_Description_External",
                            contentMap: parseFieldDescriptionEntries_JX(tempRl)
                        });
                    }
                    i = i + j - 1;
                } else if (
                    isBlank(ezCut(42, 74))
                    // && isNotBlank(ezCut(7, 14))
                    && ezCut(19, 20) != 'DS') {
                    /** Input spec record identification (I prompt) */
                    parsedRpgFile.push({
                        index: i,
                        rawRl: rl,
                        formType: "I",
                        formTypeSpecifications: "Record_Identification",
                        contentMap: parseRecordIdentificationEntries_I(rl)
                    });
                    let j = 1;
                    for (; ; j++) {
                        let tempRl = rpgFile[i + j];
                        let tempEzCut = ezCutUtil(tempRl);
                        if (tempRl[6] === '*') {
                            parsedRpgFile.push({
                                index: i + j,
                                rawRl: tempRl,
                                formType: "comments",
                                contentMap: new Map()
                            });
                            continue;
                        } else if (
                            !(isBlank(tempEzCut(7, 42))//not sure
                                && isNotBlank(tempEzCut(53, 58))
                                && isBlank(tempEzCut(71, 74))
                            )
                        ) {
                            break;
                        }
                        /** Input spec field description (J prompt) */
                        parsedRpgFile.push({
                            index: i + j,
                            rawRl: tempRl,
                            formType: "I",
                            formTypeSpecifications: "Field_Description",
                            contentMap: parseFieldDescriptionEntries_J(tempRl)
                        });
                    }
                    i = i + j - 1;
                } else if (ezCut(19, 20) == 'DS') {
                    // Data Structure
                    // Positions 19 and 20 must contain DS to indicate a data structure.
                    parsedRpgFile.push({
                        index: i,
                        rawRl: rl,
                        formType: "I",
                        formTypeSpecifications: "Data_Structure",
                        contentMap: parseDataStructureSpecificationEntries(rl)
                    });
                    // Data Structure Subfield
                    // Specifications for subfields, if used, must follow the data structure specification statement to which they apply.                    
                    // 開一個子迴圈來分別處理subfields, 做完後後再把 i 加回去
                    let j = 1;
                    for (; ; j++) {
                        let tempRl = rpgFile[i + j];
                        let tempEzCut = ezCutUtil(tempRl);
                        if (tempRl[6] === '*') {
                            parsedRpgFile.push({
                                index: i + j,
                                rawRl: tempRl,
                                formType: "comments",
                                contentMap: new Map()
                            });
                            continue;
                        }
                        if (
                            !(tempEzCut(6, 6) === 'I'
                                && isBlank(tempEzCut(7, 7))/** Reserved1 */
                                && (tempEzCut(8, 8) === 'I'
                                    || (
                                        (
                                            isBlank(tempEzCut(8, 8))
                                            && isBlank(tempEzCut(21, 30))
                                            && isBlank(tempEzCut(31, 42))
                                        )
                                        ||
                                        (
                                            isBlank(tempEzCut(8, 8))
                                            && isNotBlank(tempEzCut(21, 30))
                                            && isBlank(tempEzCut(31, 52))
                                            && isNotBlank(tempEzCut(53, 58))
                                            && isBlank(tempEzCut(59, 74))
                                        )
                                    )
                                )
                                && isBlank(tempEzCut(9, 20))/** Reserved2 */
                                && isNotBlank(tempEzCut(53, 58))/** Field Name */
                                && isBlank(tempEzCut(59, 74))/** Reserved4 */
                            )
                        ) {
                            break;
                        }
                        parsedRpgFile.push({
                            index: i + j,
                            rawRl: tempRl,
                            formType: "I",
                            formTypeSpecifications: "Data_Structure_Subfield",
                            contentMap: parseDataStructureSubfieldSpecifications(tempRl)
                        });
                    }
                    i = i + j - 1;
                } else if (
                    isBlank(ezCut(7, 20))
                    && isBlank(ezCut(44, 52))
                    && isBlank(ezCut(59, 74))
                ) {
                    /** Named Constant Specifications */
                    parsedRpgFile.push({
                        index: i,
                        rawRl: rl,
                        formType: "I",
                        formTypeSpecifications: "Named_Constant",
                        contentMap: parseNamedConstantSpecifications(rl)
                    });
                } else {
                    // 不知怎麼解析的I卡
                    parsedRpgFile.push({
                        index: i,
                        rawRl: rl,
                        formType: "unknown",
                        contentMap: new Map()
                    });
                }
            } else {
                parsedRpgFile.push({
                    index: i,
                    rawRl: rl,
                    formType: "unknown",
                    contentMap: new Map()
                });
            }
        } else {
            // line comments
            parsedRpgFile.push({
                index: i,
                rawRl: rl,
                formType: "comments",
                contentMap: new Map()
            });
        }
    }

    return parsedRpgFile;
};



export { parseRpgFile }