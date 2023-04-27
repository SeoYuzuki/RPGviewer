import { isNotBlank, isBlank } from "../utils/StringUtils"
import { ParsedLine, RPGContent } from "../types/parsedRpgFile"
import { FieldInfo, Position } from "../types/FieldInfo";
import { ref } from "@vue/reactivity";

/** 全域共用的欄位資訊 例如檔案本身，常數 */
const publicFieldInfoList = ref<FieldInfo[]>([]);
/** 所有引入檔案的欄位資訊 例如該檔案裏面定義的欄位 */
const allFieldInfoMap = ref<Map<string, FieldInfo[]>>(new Map());
const linkMap = ref<Map<string, string[]>>(new Map());

/**
 * 
 * @param parsedRpgFile 解析後的行列
 * @param fileName 檔名
 * @param type 
 */
const saveFieldInfoList = function (parsedRpgFile: ParsedLine[], fileName: string, type: string) {
    /** 放入自己 */
    publicFieldInfoList.value.push({
        position: {
            fileName: fileName,
            index: 0
        },
        fieldName: fileName,
        info: {
            content: "File",
            title: "",
        }
    });

    let noCommentsRpg = parsedRpgFile.filter(e => { return e.formType !== 'comments' });
    let fieldInfoList: FieldInfo[] = [];
    /** 迴圈查找檔案中的定義欄位 */
    for (let count = 0; count < noCommentsRpg.length; count++) {
        try {
            let rl: ParsedLine = noCommentsRpg[count];
            let position: Position = {
                fileName: fileName,
                index: rl.index
            };
            // C卡
            if (rl.formType === 'C') {
                let map: Map<String, RPGContent> = rl.contentMap;
                // 變數初始化位置
                if (map.get("Field_Length")?.value?.trim()) {
                    fieldInfoList.push({
                        position: position,
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
                        position: {
                            fileName: fileName,
                            index: rl.index
                        },
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
                        position: {
                            fileName: fileName,
                            index: rl.index
                        },
                        fieldName: map.get("Factor1")?.value,
                        info: {
                            content: "KLIST with KFLD: " + kfld,
                            title: ""
                        },
                    });
                }

            } else if (rl.formType === 'I') {

                let map: Map<String, RPGContent> = rl.contentMap;
                if (rl.formTypeSpecifications === "Record_Identification") {
                    fieldInfoList.push({
                        position: {
                            fileName: fileName,
                            index: rl.index
                        },
                        fieldName: map.get("File Name")?.value,
                        info: {
                            content: "File",
                            title: "",
                            class: "file"
                        }
                    });
                } else if (rl.formTypeSpecifications === "Field_Description") {
                    fieldInfoList.push({
                        position: {
                            fileName: fileName,
                            index: rl.index
                        },
                        fieldName: map.get("Field Name")?.value,
                        info: {
                            content: "field of File",
                            title: "",
                        }
                    });
                } else if (rl.formTypeSpecifications === "Record_Identification_External") {
                    // fieldInfoList.push({
                    //     position: {
                    //         fileName: fileName,
                    //         index: rl.index
                    //     },
                    //     fieldName: map.get("Record Name")?.value,
                    //     info: {
                    //         content: "Record",
                    //         class: "record",
                    //         title: "",
                    //     }
                    // });
                } else if (rl.formTypeSpecifications === "Field_Description_External") {
                    fieldInfoList.push({
                        position: {
                            fileName: fileName,
                            index: rl.index
                        },
                        fieldName: map.get("Field Name")?.value,
                        info: {
                            content: "Field of record.",
                            title: "",
                        }
                    });
                } else if (rl.formTypeSpecifications === "Data_Structure") {
                    fieldInfoList.push({
                        position: {
                            fileName: fileName,
                            index: rl.index
                        },
                        fieldName: map.get("Data Structure Name")?.value,
                        info: {
                            content: "Data Structure.",
                            class: "data-structure",
                            title: "",
                        }
                    });
                } else if (rl.formTypeSpecifications === "Data_Structure_Subfield") {
                    fieldInfoList.push({
                        position: {
                            fileName: fileName,
                            index: rl.index
                        },
                        fieldName: map.get("Field Name")?.value,
                        info: {
                            content: "Field of data structure",
                            title: "",
                        }
                    });
                } else if (rl.formTypeSpecifications === "Named_Constant") {
                    fieldInfoList.push({
                        position: {
                            fileName: fileName,
                            index: rl.index
                        },
                        fieldName: map.get("Constant Name")?.value,
                        info: {
                            content: "Constant Name",
                            title: "",
                        }
                    });
                }
            } else if (rl.formType === 'E') {
                let map: Map<String, RPGContent> = rl.contentMap;
                if (map.get("Array_or_Table_Name1")) {
                    fieldInfoList.push({
                        position: {
                            fileName: fileName,
                            index: rl.index
                        },
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

            } else if (rl.formType === 'F') {
                let map: Map<String, RPGContent> = rl.contentMap;
                if (rl.formTypeSpecifications === "File_Description") {
                    if (map.get("File Name")) {
                        if (linkMap.value.get(fileName)) {
                            linkMap.value.get(fileName)?.push(map.get("File Name")?.value.trim() ?? "")
                        } else {
                            linkMap.value.set(fileName, [map.get("File Name")?.value.trim() ?? ""])
                        }
                    }
                } else if (rl.formTypeSpecifications === "Continuation_Lines") {
                    if (map.get("Option")?.value === 'RENAME') {
                        fieldInfoList.push({
                            position: position,
                            fieldName: map.get("Option Explanation")?.value,
                            info: {
                                content: "Renamed record",
                                class: "record",
                                title: "",
                            }
                        });
                    }
                }

            }
        } catch (e) {
            console.error('parsing error', e);
        }
    }

    allFieldInfoMap.value.set(fileName, fieldInfoList);
}

const saveFieldInfoList_A = function (parsedRpgFile: ParsedLine[], fileName: string, type: string) {
    /** 放入自己 */
    publicFieldInfoList.value.push({
        position: {
            fileName: fileName,
            index: 0
        },
        fieldName: fileName,
        info: {
            content: "File",
            title: "",
        }
    });

    let noCommentsRpg = parsedRpgFile.filter(e => { return e.formType !== 'comments' });
    let fieldInfoList: FieldInfo[] = [];
    /** 迴圈查找檔案中的定義欄位 */
    for (let count = 0; count < noCommentsRpg.length; count++) {
        let rl: ParsedLine = noCommentsRpg[count];
        // A卡
        if (rl.formType === 'A') {
            let map: Map<String, RPGContent> = rl.contentMap;
            let position: Position = {
                fileName: fileName,
                index: rl.index
            };
            if (map.get("Type of Name")?.value === 'R') {
                fieldInfoList.push({
                    position: position,
                    fieldName: map.get("Name")?.value,
                    info: {
                        content: "Record",
                        class: "record",
                        title: "",
                    }
                });
            } else if (map.get("Type of Name")?.value === ' ') {
                // TODO 排除 連續LINE
                fieldInfoList.push({
                    position: position,
                    fieldName: map.get("Name")?.value,
                    info: {
                        content: "Field from " + fileName + ", length of " + map.get("Length")?.value + ',' + map.get("Decimal positions")?.value,
                        title: "",
                    }
                });
            }
        }
    }

    allFieldInfoMap.value.set(fileName, fieldInfoList);

}

export { saveFieldInfoList, saveFieldInfoList_A, publicFieldInfoList, allFieldInfoMap, linkMap }