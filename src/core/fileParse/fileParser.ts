import { parseRpgFile } from "./RpgFileParser";
import { parseDdsFile } from "./DDSFileParser";
import { ParsedLine } from "../../types/parsedRpgFile";
import { saveFieldInfoList, saveFieldInfoList_A } from "../FieldInfoParser"

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