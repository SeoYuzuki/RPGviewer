import { substr_by_bytes } from "../utils/StringUtils"
import { ParsedLine, RPGContent } from "../types/parsedRpgFile"

/** https://www.ibm.com/docs/en/rdfi/9.6.0?topic=rpg400-language-reference#ToC_286 */

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
    contentMap.set('Comments', { value: substr_by_bytes(rl, 59, 20) });

    return contentMap;
}

function ezCutUtil(rl: string) {
    return (a: number, b: number): string => {
        return substr_by_bytes(rl, a - 1, b - a + 1);
    }
}

/**
 * Input spec record identification (I prompt)
 */
function parseRecordIdentificationEntries_I(rl: string): Map<string, RPGContent> {
    let ezCut = ezCutUtil(rl);

    let contentMap: Map<string, RPGContent> = new Map();
    contentMap.set('HEAD_COMMENT', { value: ezCut(1, 5), class: "comments" });
    contentMap.set('Form Type', { value: ezCut(6, 6), view: "KeywordField", dic: "Form_Type_Dic" });
    contentMap.set('File Name', { value: ezCut(7, 14) });
    contentMap.set('Logical Relationship', { value: ezCut(14, 16) });
    contentMap.set('Number', { value: ezCut(17, 17) });
    contentMap.set('Option', { value: ezCut(18, 18) });
    contentMap.set('Record Identifying Indicator', { value: ezCut(19, 20) });
    /** Positions 21-41 (Record Identification Codes) */
    contentMap.set('Position1', { value: ezCut(21, 24) });
    contentMap.set('Not1', { value: ezCut(25, 25) });
    contentMap.set('Code Part1', { value: ezCut(26, 26) });
    contentMap.set('Character1', { value: ezCut(27, 27) });
    contentMap.set('Position2', { value: ezCut(28, 31) });
    contentMap.set('Not2', { value: ezCut(32, 32) });
    contentMap.set('Code Part2', { value: ezCut(33, 33) });
    contentMap.set('Character2', { value: ezCut(34, 34) });
    contentMap.set('Position3', { value: ezCut(35, 38) });
    contentMap.set('Not3', { value: ezCut(39, 39) });
    contentMap.set('Code Part3', { value: ezCut(40, 40) });
    contentMap.set('Character3', { value: ezCut(41, 41) });

    contentMap.set('Reserved', { value: ezCut(42, 42) });
    return contentMap;
}

/**
 * Input spec field description (J prompt)
 */
function parseFieldDescriptionEntries_J(rl: string): Map<string, RPGContent> {
    let ezCut = ezCutUtil(rl);

    let contentMap: Map<string, RPGContent> = new Map();
    contentMap.set('Data Format', { value: ezCut(43, 43) });
    contentMap.set('Field Location', { value: ezCut(44, 51) });
    contentMap.set('Decimal Positions', { value: ezCut(52, 52) });

    contentMap.set('Field Name', { value: ezCut(53, 58) });
    contentMap.set('Control Level', { value: ezCut(59, 60) });
    contentMap.set('Matching Fields', { value: ezCut(61, 62) });
    contentMap.set('Field Record Relation', { value: ezCut(63, 64) });
    contentMap.set('Field Indicators - Program Described', { value: ezCut(65, 70) });
    contentMap.set('Reserved', { value: ezCut(71, 74) });
    contentMap.set('Comments', { value: ezCut(75, 80) });

    return contentMap;
}

/**
 * Input spec record identification external (IX prompt)
 * @param rl 
 */
function parseRecordIdentificationEntries_IX(rl: string): Map<string, RPGContent> {
    let ezCut = ezCutUtil(rl);

    let contentMap: Map<string, RPGContent> = new Map();
    contentMap.set('HEAD_COMMENT', { value: ezCut(1, 5), class: "comments" });
    contentMap.set('Form Type', { value: ezCut(6, 6), view: "KeywordField", dic: "Form_Type_Dic" });
    contentMap.set('File Name', { value: ezCut(7, 14) });
    contentMap.set('Logical Relationship', { value: ezCut(14, 16) });
    contentMap.set('Number', { value: ezCut(17, 17) });
    contentMap.set('Option', { value: ezCut(18, 18) });
    contentMap.set('Record Identifying Indicator', { value: ezCut(19, 20) });
    /** Positions 21-41 (Record Identification Codes) */
    contentMap.set('Position1', { value: ezCut(21, 24) });
    contentMap.set('Not1', { value: ezCut(25, 25) });
    contentMap.set('Code Part1', { value: ezCut(26, 26) });
    contentMap.set('Character1', { value: ezCut(27, 27) });
    contentMap.set('Position2', { value: ezCut(28, 31) });
    contentMap.set('Not2', { value: ezCut(32, 32) });
    contentMap.set('Code Part2', { value: ezCut(33, 33) });
    contentMap.set('Character2', { value: ezCut(34, 34) });
    contentMap.set('Position3', { value: ezCut(35, 38) });
    contentMap.set('Not3', { value: ezCut(39, 39) });
    contentMap.set('Code Part3', { value: ezCut(40, 40) });
    contentMap.set('Character3', { value: ezCut(41, 41) });

    contentMap.set('Reserved', { value: ezCut(42, 42) });
    return contentMap;
}


/**
 * Input spec field description external (JX prompt)
 * @TODO https://www.ibm.com/docs/en/rdfi/9.6.0?topic=SSAE4W_9.6.0/com.ibm.etools.iseries.langref.doc/evferlsh126.html#HDRIED
 * @param rl 
 */
function parseFieldDescriptionEntries_JX(rl: string): Map<string, RPGContent> {
    let ezCut = ezCutUtil(rl);

    let contentMap: Map<string, RPGContent> = new Map();
    return contentMap;
}

const parseRpgFile = function (_rpgFile: string) {
    let rpgFile = _rpgFile.split('\r\n');
    let parsedRpgFile: ParsedLine[] = [];
    for (let i = 0; i < rpgFile.length; i++) {
        let rl = rpgFile[i];
        // C卡
        if (rl[6] !== '*') {
            if (rl[5] === 'E') {
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
                if (substr_by_bytes(rl, 18, 2) !== 'DS'
                    && substr_by_bytes(rl, 6, 8)?.trim().length > 0 /** Record_Name存在 */
                    && rl.substring(14, 18).trim().length == 0
                ) {
                    // Record Identification Entries                  
                    parsedRpgFile.push({
                        index: i,
                        rawRl: rl,
                        formType: "I",
                        formTypeSpecifications: "Record_Identification",
                        formContent: {
                            Record_Name: substr_by_bytes(rl, 6, 8),
                            Reserved1: substr_by_bytes(rl, 14, 4),
                            Record_Identifying_Indicator: substr_by_bytes(rl, 18, 2),
                            Record_Identification_Code: substr_by_bytes(rl, 20, 21),
                            Reserved2: substr_by_bytes(rl, 41, 1),
                            Data_Format: substr_by_bytes(rl, 42, 1),
                            Field_Location: substr_by_bytes(rl, 43, 8),
                            Decimal_Positions: substr_by_bytes(rl, 51, 1),
                            Field_Name: substr_by_bytes(rl, 52, 6),
                            Control_Level: substr_by_bytes(rl, 58, 2),
                            Matching_Fields: substr_by_bytes(rl, 60, 2),
                            Field_Record_Relation: substr_by_bytes(rl, 62, 2),
                            Field_Indicators_Program_Described: substr_by_bytes(rl, 64, 6),
                            Reserved3: substr_by_bytes(rl, 70, 4),
                            Comments: substr_by_bytes(rl, 74, 6),
                        }
                    });
                    // Field Description
                    let j = 1;
                    for (; ; j++) {
                        let tempRl = rpgFile[i + j];
                        if (tempRl[6] === '*') {
                            parsedRpgFile.push({
                                index: i + j,
                                rawRl: tempRl,
                                formType: "comments",
                            });
                            continue;
                        } else if (substr_by_bytes(tempRl, 18, 2) === 'DS'
                            || tempRl[5] !== 'I'
                            || tempRl.substring(6, 20).trim().length > 0
                        ) {
                            break;
                        }
                        parsedRpgFile.push({
                            index: i + j,
                            rawRl: tempRl,
                            formType: "I",
                            formTypeSpecifications: "Field_Description",
                            formContent: {
                                Reserved1: substr_by_bytes(tempRl, 6, 14),
                                External_Field_Name: substr_by_bytes(tempRl, 20, 10),
                                Reserved2: substr_by_bytes(tempRl, 30, 22),
                                Field_Name: substr_by_bytes(tempRl, 52, 6),
                                Control_Level: substr_by_bytes(tempRl, 58, 2),
                                Matching_Fields: substr_by_bytes(tempRl, 60, 2),
                                Reserved3: substr_by_bytes(tempRl, 62, 2),
                                Externally_Described_Field_Indicators: substr_by_bytes(tempRl, 64, 6),
                                Reserved4: substr_by_bytes(tempRl, 70, 4),
                                Comments: substr_by_bytes(tempRl, 74, 6),
                            }
                        });
                    }
                    i = i + j - 1;
                } else if (substr_by_bytes(rl, 18, 2) === 'DS') {
                    // Data Structure
                    // Positions 19 and 20 must contain DS to indicate a data structure.
                    parsedRpgFile.push({
                        index: i,
                        rawRl: rl,
                        formType: "I",
                        formTypeSpecifications: "Data_Structure",
                        formContent: {
                            Data_Structure_Name: substr_by_bytes(rl, 6, 6),
                            Reserved1: substr_by_bytes(rl, 12, 4),
                            External_Description: substr_by_bytes(rl, 16, 1),
                            Option: substr_by_bytes(rl, 17, 1),
                            Record_Identifying_Indicator: substr_by_bytes(rl, 18, 2),
                            External_File_Name: substr_by_bytes(rl, 20, 10),
                            Reserved2: substr_by_bytes(rl, 30, 13),
                            Data_Structure_Occurrences: substr_by_bytes(rl, 43, 4),
                            Length: substr_by_bytes(rl, 47, 4),
                            Reserved: substr_by_bytes(rl, 51, 23),
                            Comments: substr_by_bytes(rl, 74, 6),
                        }
                    });
                    // Data Structure Subfield
                    // Specifications for subfields, if used, must follow the data structure specification statement to which they apply.                    
                    // Position 7 (Reserved)
                    // Position 8 (Initialization Option)
                    // Positions 9-20 (Reserved)
                    // Positions 21-30 (External Field Name)
                    // Positions 21-42 (Initialization Value)
                    // Positions 31-42 (Reserved)
                    // Position 43 (Internal Data Format)
                    // Positions 44-51 (Field Location)
                    // Position 52 (Decimal Positions)
                    // Positions 53-58 (Field Name)
                    // Positions 59-74 (Reserved)
                    // Positions 75-80 (Comments)
                    // 開一個子迴圈來分別處理subfields, 做完後後再把 i 加回去
                    let j = 1;
                    for (; ; j++) {
                        let tempRl = rpgFile[i + j];
                        if (tempRl[6] === '*') {
                            // parsedRpgFile.push({
                            //     index: i + j,
                            //     rawRl: tempRl,
                            //     formType: "comments",
                            // });
                            break; //continue;?
                        }
                        if (substr_by_bytes(tempRl, 18, 2) === 'DS' || tempRl[5] !== 'I') {
                            break;
                        }
                        parsedRpgFile.push({
                            index: i + j,
                            rawRl: tempRl,
                            formType: "I",
                            formTypeSpecifications: "Data_Structure_Subfield",
                            formContent: {
                                Reserved1: substr_by_bytes(tempRl, 6, 1),
                                Initialization_Option: substr_by_bytes(tempRl, 7, 1),
                                Reserved2: substr_by_bytes(tempRl, 8, 12),
                                // 1 
                                External_Field_Name: substr_by_bytes(tempRl, 20, 10),
                                Reserved3: substr_by_bytes(tempRl, 30, 12),
                                // 2
                                Initialization_Value: substr_by_bytes(tempRl, 20, 22),
                                Internal_Data_Format: substr_by_bytes(tempRl, 42, 1),
                                Field_Location: substr_by_bytes(tempRl, 43, 8),
                                Decimal_Positions: substr_by_bytes(tempRl, 51, 1),
                                Field_Name: substr_by_bytes(tempRl, 52, 6),
                                Reserved4: substr_by_bytes(tempRl, 58, 16),
                                Comments: substr_by_bytes(tempRl, 74, 6),
                            }
                        });
                    }
                    i = i + j - 1;
                } else if (substr_by_bytes(rl, 6, 14)?.trim().length == 0
                    && substr_by_bytes(rl, 43, 9)?.trim().length == 0
                    && substr_by_bytes(rl, 58, 16)?.trim().length == 0
                    && true) {
                    // Named Constant Specifications
                    // Positions 7-20 (Reserved)
                    // Positions 21-42 (Constant)
                    // Position 43 (Data Type)
                    // Positions 44-52 (Reserved)
                    // Positions 53-58 (Constant Name)
                    // Positions 59-74 (Reserved)
                    parsedRpgFile.push({
                        index: i,
                        rawRl: rl,
                        formType: "I",
                        formTypeSpecifications: "Named_Constant",
                        formContent: {
                            Reserved1: substr_by_bytes(rl, 6, 14),
                            Constant: substr_by_bytes(rl, 20, 22),
                            Data_Type: substr_by_bytes(rl, 42, 1),
                            Reserved2: substr_by_bytes(rl, 43, 9),
                            Constant_Name: substr_by_bytes(rl, 52, 6),
                            Reserved3: substr_by_bytes(rl, 58, 16),
                            Comments: substr_by_bytes(rl, 74, 6),
                        }
                    });

                } else {
                    // 不知怎麼解析的I卡
                    parsedRpgFile.push({
                        index: i,
                        rawRl: rl,
                        formType: "unknown",
                    });
                }
            } else {
                parsedRpgFile.push({
                    index: i,
                    rawRl: rl,
                    formType: "unknown",
                });
            }
        } else {
            // line comments
            parsedRpgFile.push({
                index: i,
                rawRl: rl,
                formType: "comments",
            });
        }
    }

    return parsedRpgFile;
};



export { parseRpgFile }