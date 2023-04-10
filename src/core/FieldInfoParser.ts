import { isNotBlank, isBlank } from "../utils/StringUtils"
import { ParsedLine, RPGContent } from "../types/parsedRpgFile"
import { FieldInfo } from "../types/FieldInfo";

const getFieldInfoList = function (parsedRpgFile: ParsedLine[]): FieldInfo[] {
    let noCommentsRpg = parsedRpgFile.filter(e => { return e.formType !== 'comments' });
    let fieldInfoList: FieldInfo[] = [];
    for (let count = 0; count < noCommentsRpg.length; count++) {
        let rl: ParsedLine = noCommentsRpg[count];
        // C卡
        if (rl.formType === 'C') {
            if (rl.contentMap) {
                let map: Map<String, RPGContent> = rl.contentMap;
                // 變數初始化位置
                if (map.get("Field_Length")?.value?.trim()) {
                    fieldInfoList.push({
                        position: rl.index,
                        fieldName: map.get("Result_Field")?.value ?? "",
                        reason: "Field_Length",
                        info: {
                            content: "A field with a length of " +
                                map.get("Field_Length")?.value + ',' +
                                map.get("Decimal_Positions")?.value,
                            title: ""
                        },
                    });
                }
                // BEGSR: 表示function名稱
                if (map.get("Opcde")?.value === 'BEGSR') {
                    fieldInfoList.push({
                        position: rl.index,
                        fieldName: map.get("Factor1")?.value ?? "",
                        reason: "BEGSR",

                        info: {
                            content: "Subroutine.",
                            title: ""
                        },
                    });
                }

                /** KLIST */
                if (map.get("Opcde")?.value === 'KLIST') {
                    let kfld = [];
                    for (let k = 1; ; k++) {
                        let temp_rl = noCommentsRpg[count + k];
                        if (temp_rl.contentMap?.get("Opcde")?.value === 'KFLD ') {
                            kfld.push(temp_rl.contentMap.get("Result_Field")?.value);
                        } else {
                            break;
                        }
                    }

                    fieldInfoList.push({
                        position: rl.index,
                        fieldName: map.get("Factor1")?.value ?? "",
                        reason: "KLIST",

                        info: {
                            content: "KLIST with KFLD: " + kfld,
                            title: ""
                        },
                    });
                }
            }
        } else if (rl.formType === 'I') {
            if (rl.formTypeSpecifications === "Data_Structure" && isNotBlank(rl.formContent.Data_Structure_Name)) {
                fieldInfoList.push({
                    position: rl.index,
                    fieldName: rl.formContent.Data_Structure_Name,
                    reason: "I_Data_Structure",

                    info: {
                        content: "Data structure.",
                        title: "",
                        class: 'data_structure'
                    }
                });
            }
            else if (rl.formTypeSpecifications === "Data_Structure_Subfield") {
                let Data_Structure_Name = "";
                for (let k = 1; ; k++) {
                    let temp_rl = noCommentsRpg[count - k];
                    if (temp_rl.formTypeSpecifications === 'Data_Structure') {
                        Data_Structure_Name = temp_rl.formContent.Data_Structure_Name;
                        break;
                    }
                }

                fieldInfoList.push({
                    position: rl.index,
                    fieldName: rl.formContent.Field_Name,
                    reason: "I_Subfield",

                    info: {
                        content: isBlank(Data_Structure_Name) ? "Subfield." : "Subfield from structure " + Data_Structure_Name,
                        title: ""
                    }
                });
            } else if (rl.formTypeSpecifications === "Record_Identification") {
                fieldInfoList.push({
                    position: rl.index,
                    fieldName: rl.formContent.Record_Name,
                    reason: "I_RECORD",

                    info: {
                        content: "Record.",
                        title: "",
                        class: "record"
                    }
                });
            } else if (rl.formTypeSpecifications === "Field_Description") {
                let Record_Name = "";
                for (let k = 1; ; k++) {
                    let temp_rl = noCommentsRpg[count - k];
                    if (temp_rl.formTypeSpecifications === 'Record_Identification') {
                        Record_Name = temp_rl.formContent.Record_Name;
                        break;
                    }
                }

                fieldInfoList.push({
                    position: rl.index,
                    fieldName: rl.formContent.Field_Name,
                    reason: "I_Field_Description",

                    info: {
                        content: "A field from record named " +
                            Record_Name +
                            ". Original field name is " +
                            rl.formContent.External_Field_Name,
                        title: ""
                    }
                });
            } else if (rl.formTypeSpecifications === "Named_Constant") {
                fieldInfoList.push({
                    position: rl.index,
                    fieldName: rl.formContent.Constant_Name,
                    reason: "I_Constant_Name",

                    info: {
                        content: "This is a constant whose value is " + rl.formContent.Constant,
                        title: ""
                    }
                });
            }
        } else if (rl.formType === 'E') {
            if (rl.contentMap) {
                let map: Map<String, RPGContent> = rl.contentMap;
                if (map.get("Array_or_Table_Name1")) {
                    fieldInfoList.push({
                        position: rl.index,
                        fieldName: map.get("Array_or_Table_Name1")?.value ?? "",
                        reason: "E_Array_or_Table_Name1",

                        info: {
                            content: (
                                "It's a Array or Table.\r\n" +
                                "Entries per Record:" +
                                map.get("Entries_per_Record")?.value +
                                "\r\n" +
                                "Entries per Array or Table:" +
                                map.get("Entries_per_Array_or_Table")?.value +
                                "\r\n" +
                                "Length of Entry:" +
                                map.get("Length_of_Entry1")?.value +
                                "\r\n"
                            ),
                            title: ""
                        }
                    });
                }
            }
        }
    }

    return fieldInfoList;
}

export { getFieldInfoList }