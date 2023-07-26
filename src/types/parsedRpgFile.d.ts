import { KeywordsDic } from "../dictionary/RPG_dictionary";
import { FormType } from "./FormType";

/**
 * 解析後的行
 */
class ParsedLine {
  index: number;
  rawRl: string;
  formType: FormType;
  /** 該行的欄位MAP */
  contentMap: Map<string, RPGContent>;
  formTypeSpecifications?: string;
  formContent?: any;
}

/**
 * 整檔資訊
 */
class FileInfo {
  parsedLineList: ParsedLine[];
  /** 檔名，也是key */
  fileName: string;
  /** 檔案原始名 */
  fileRawName: string;
  /** 副檔名 */
  fileExtension: string;
  /** 大綱 */
  outLine: OutLineItem[];
}

/**
 * 欄位資訊
 */
class RPGContent {
  /** 欄位內容(字串) */
  readonly value: string;
  /** 欄位使用到的渲染元件 */
  readonly view?: string;
  /** 欄位使用到的字典 */
  readonly dic?: keyof KeywordsDic;
  /** 欄位的class */
  readonly class?: string;
}

/**
 * 大綱元件
 */
class OutLineItem {
  itemName: string;
  index: number;
}

export { RPGContent, ParsedLine, FileInfo, OutLineItem };
