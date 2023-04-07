import { isNotBlank, isBlank } from "./StringUtils"
import { ParsedLine } from "../types/parsedRpgFile"
import { FieldInfo } from "../types/FieldInfo";

const getFieldInfoList = function (parsedRpgFile: ParsedLine[]): FieldInfo[] {
    let noCommentsRpg = parsedRpgFile.filter(e => { return e.formType !== 'comments' });
    let fieldInfoList: FieldInfo[] = [];
    for (let count = 0; count < noCommentsRpg.length; count++) {
        let rl: ParsedLine = noCommentsRpg[count];
        // C卡
        if (rl.formType === 'C') {
            // 變數初始化位置
            if (rl.formContent.Field_Length.trim() > 0) {
                fieldInfoList.push({
                    position: rl.index,
                    fieldName: rl.formContent.Result_Field,
                    reason: "Field_Length",
                    info: {
                        content: "A field with a length of " + rl.formContent.Field_Length + ',' + rl.formContent.Decimal_Positions,
                        title: ""
                    },
                });
            }
            // BEGSR: 表示function名稱
            if (rl.formContent.Opcde === 'BEGSR') {
                fieldInfoList.push({
                    position: rl.index,
                    fieldName: rl.formContent.Factor1,
                    reason: "BEGSR",

                    info: {
                        content: "Subroutine.",
                        title: ""
                    },
                });
            }
            //
            if (rl.formContent.Opcde === 'KLIST') {
                let kfld = [];
                for (let k = 1; ; k++) {
                    let temp_rl = noCommentsRpg[count + k];
                    if (temp_rl.formContent?.Opcde === 'KFLD ') {
                        kfld.push(temp_rl.formContent.Result_Field);
                    } else {
                        break;
                    }
                }

                fieldInfoList.push({
                    position: rl.index,
                    fieldName: rl.formContent.Factor1,
                    reason: "KLIST",

                    info: {
                        content: "KLIST with KFLD: " + kfld,
                        title: ""
                    },
                });
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
            fieldInfoList.push({
                position: rl.index,
                fieldName: rl.formContent.Array_or_Table_Name1,
                reason: "E_Array_or_Table_Name1",

                info: {
                    content: (
                        "It's a Array or Table.\r\n" +
                        "Entries per Record:" +
                        rl.formContent.Entries_per_Record +
                        "\r\n" +
                        "Entries per Array or Table:" +
                        rl.formContent.Entries_per_Array_or_Table +
                        "\r\n" +
                        "Length of Entry:" +
                        rl.formContent.Length_of_Entry1 +
                        "\r\n"
                    ),
                    title: ""
                }
            });
        }
    }

    return fieldInfoList;
}

export { getFieldInfoList }