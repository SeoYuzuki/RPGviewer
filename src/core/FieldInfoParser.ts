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
                        fieldName: map.get("Result_Field")?.value,
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
                        fieldName: map.get("Factor1")?.value,
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
                        fieldName: map.get("Factor1")?.value,
                        info: {
                            content: "KLIST with KFLD: " + kfld,
                            title: ""
                        },
                    });
                }
            }
        } else if (rl.formType === 'I') {
            if (rl.contentMap) {
                let map: Map<String, RPGContent> = rl.contentMap;
                if (rl.formTypeSpecifications === "Record_Identification") {
                    fieldInfoList.push({
                        position: rl.index,
                        fieldName: map.get("File Name")?.value,
                        info: {
                            content: "File",
                            title: "",
                            class: "file"
                        }
                    });
                } else if (rl.formTypeSpecifications === "Field_Description") {
                    fieldInfoList.push({
                        position: rl.index,
                        fieldName: map.get("Field Name")?.value,
                        info: {
                            content: "field of File",
                            title: "",
                        }
                    });
                } else if (rl.formTypeSpecifications === "Record_Identification_External") {
                    fieldInfoList.push({
                        position: rl.index,
                        fieldName: map.get("Record Name")?.value,
                        info: {
                            content: "Record",
                            class: "record",
                            title: "",
                        }
                    });
                } else if (rl.formTypeSpecifications === "Field_Description_External") {
                    fieldInfoList.push({
                        position: rl.index,
                        fieldName: map.get("Field Name")?.value,
                        info: {
                            content: "Field of record.",
                            title: "",
                        }
                    });
                } else if (rl.formTypeSpecifications === "Data_Structure") {
                    fieldInfoList.push({
                        position: rl.index,
                        fieldName: map.get("Data Structure Name")?.value,
                        info: {
                            content: "Data Structure.",
                            class: "data-structure",
                            title: "",
                        }
                    });
                } else if (rl.formTypeSpecifications === "Data_Structure_Subfield") {
                    fieldInfoList.push({
                        position: rl.index,
                        fieldName: map.get("Field Name")?.value,
                        info: {
                            content: "Field Name",
                            title: "",
                        }
                    });
                } else if (rl.formTypeSpecifications === "Named_Constant") {
                    fieldInfoList.push({
                        position: rl.index,
                        fieldName: map.get("Constant Name")?.value,
                        info: {
                            content: "Constant Name",
                            title: "",
                        }
                    });
                }
            }
        } else if (rl.formType === 'E') {
            if (rl.contentMap) {
                let map: Map<String, RPGContent> = rl.contentMap;
                if (map.get("Array_or_Table_Name1")) {
                    fieldInfoList.push({
                        position: rl.index,
                        fieldName: map.get("Array_or_Table_Name1")?.value,
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
        } else if (rl.formType === 'F') {
            console.log(rl);
            if (rl.contentMap) {
                let map: Map<String, RPGContent> = rl.contentMap;
                if (map.get("File Name")) {
                    fieldInfoList.push({
                        position: rl.index,
                        fieldName: map.get("File Name")?.value,
                        info: {
                            content: "File Name",
                            title: "",
                            openDss: map.get("File Name")?.value
                        }
                    });
                }
            }
        }
    }

    return fieldInfoList;
}

export { getFieldInfoList }