/**
 * 欄位資訊
 */
class FieldInfo {
    position: number;
    fieldName: string | undefined;    // 不該空
    reason: string; // 預計刪除

    info: {
        /** 提示框內容 */
        content: string,
        title: string,
        /** 該欄位的class */
        class?: string
    }
}

export { FieldInfo };