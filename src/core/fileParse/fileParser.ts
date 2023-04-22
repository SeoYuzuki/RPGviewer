import { parseRpgFile } from "./RpgFileParser";
import { parseDdsFile } from "./DDSFileParser";
import { FileInfo, ParsedLine } from "../../types/parsedRpgFile";
import { getContentByFile } from "../../utils/A1Utils";
import { saveFieldInfoList, saveFieldInfoList_A, publicFieldInfoMap } from "../FieldInfoParser"
import { ref } from "vue";

function parseFile(rawFile: string, name: string, fileExtension: string): ParsedLine[] {
    let parsedFile: ParsedLine[] = [];
    if (["dds", "pf"].includes(fileExtension)) {
        parsedFile = parseDdsFile(rawFile);
        saveFieldInfoList_A(parsedFile, name, "public");
    } else if (["rpg"].includes(fileExtension)) {
        parsedFile = parseRpgFile(rawFile);
        // 檢查是否有值得彈出提示或是超連結的欄位
        saveFieldInfoList(parsedFile, name, "private");
    } else {
        console.log("not support file extension", fileExtension);
    }

    return parsedFile;
}




export { parseFile }

