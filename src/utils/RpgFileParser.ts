import { substr_by_bytes } from "./StringUtils"
import { ParsedLine } from "../types/parsedRpgFile"

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
                    formContent: {
                        Reserved: substr_by_bytes(rl, 6, 4),
                        From_File_Name: substr_by_bytes(rl, 10, 8),
                        To_File_Name: substr_by_bytes(rl, 18, 8),
                        Array_or_Table_Name1: substr_by_bytes(rl, 26, 6),
                        Entries_per_Record: substr_by_bytes(rl, 32, 3),
                        Entries_per_Array_or_Table: substr_by_bytes(rl, 35, 4),
                        Length_of_Entry1: substr_by_bytes(rl, 39, 3),
                        Data_Format1: substr_by_bytes(rl, 42, 1),
                        Decimal_Positions1: substr_by_bytes(rl, 43, 1),
                        Sequence1: substr_by_bytes(rl, 44, 1),
                        Second_Array_Description: substr_by_bytes(rl, 45, 12), //

                        Array_or_Table_Name2: substr_by_bytes(rl, 45, 6),
                        Length_of_Entry2: substr_by_bytes(rl, 51, 3),
                        Data_Format2: substr_by_bytes(rl, 54, 1),
                        Decimal_Positions2: substr_by_bytes(rl, 55, 1),
                        Sequence2: substr_by_bytes(rl, 56, 1),

                        Comments: substr_by_bytes(rl, 57, 23),
                    }
                });
            } else if (rl[5] === 'C') {
                // Calculation_Specification
                parsedRpgFile.push({
                    index: i,
                    rawRl: rl,
                    formType: "C",
                    formTypeSpecifications: "Calculation_Specification",
                    formContent: {
                        Control_Level_Indicators: substr_by_bytes(rl, 6, 2),
                        N01: substr_by_bytes(rl, 8, 3),
                        N02: substr_by_bytes(rl, 11, 3),
                        N03: substr_by_bytes(rl, 14, 3),
                        Factor1: substr_by_bytes(rl, 17, 7),
                        Reserved1: substr_by_bytes(rl, 24, 3),
                        Opcde: substr_by_bytes(rl, 27, 5),
                        Factor2: substr_by_bytes(rl, 32, 7),
                        Reserved2: substr_by_bytes(rl, 39, 3),
                        Result_Field: substr_by_bytes(rl, 42, 6),
                        Field_Length: substr_by_bytes(rl, 48, 3),
                        Decimal_Positions: substr_by_bytes(rl, 51, 1),
                        Operation_Extender: substr_by_bytes(rl, 52, 1),
                        Resulting_Indicators_Hi: substr_by_bytes(rl, 53, 2),
                        Resulting_Indicators_Lo: substr_by_bytes(rl, 55, 2),
                        Resulting_Indicators_Eq: substr_by_bytes(rl, 57, 2),
                        Comments: substr_by_bytes(rl, 59, 20),
                    }
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
                            Reserved2: substr_by_bytes(rl, 41, 23),
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