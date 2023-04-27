/**
 * 欄位資訊
 */
class FieldInfo {
    position: Position;
    fieldName: string | undefined;    // 不該空
    info: {
        /** 提示框內容 */
        content: string,
        title: string,
        /** 該欄位的class */
        class?: string,
    }
}

class Position {
    fileName: string;
    index: number;
}

export { FieldInfo, Position };