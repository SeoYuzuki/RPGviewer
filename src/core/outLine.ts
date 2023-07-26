import { ParsedLine, OutLineItem } from "../types/parsedRpgFile";

/**
 * 取得大綱元件列表
 * @param lines
 * @returns
 */
function getOutLineItemList(lines: ParsedLine[]): OutLineItem[] {
  let arr: OutLineItem[] = [];
  if (lines) {
    let lastFormType = "";
    for (let line of lines) {
      if (line.formType === "comments" || line.formType === "unknown") {
        continue;
      }

      if (line.formType !== lastFormType) {
        lastFormType = line.formType;
        arr.push({ itemName: "formType:" + line.formType, index: line.index });
      }
      if (line.contentMap.get("Opcde")?.value === "BEGSR") {
        arr.push({
          itemName: "sr:" + line.contentMap.get("Factor1")?.value,
          index: line.index,
        });
      }
    }
  }
  return arr;
}

export { getOutLineItemList };
