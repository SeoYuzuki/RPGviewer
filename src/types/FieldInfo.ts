/**
 * 欄位資訊
 */
class FieldInfo {
    position: number;
    fieldName: string;
    reason: string;

    info: {
        /** 提示框內容 */
        content: string,
        title: string,
        /** 該欄位的class */
        class?: string
    }
}

export { FieldInfo };