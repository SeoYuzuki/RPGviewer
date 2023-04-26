import { parseRpgFile } from "./RpgFileParser";
import { parseDdsFile } from "./DDSFileParser";
import { FileInfo, ParsedLine } from "../../types/parsedRpgFile";
import { getContentByFile } from "../../utils/A1Utils";
import { saveFieldInfoList, saveFieldInfoList_A, publicFieldInfoMap } from "../FieldInfoParser"
import { Ref, ref } from "vue";

function getParsedLineList(rawFile: string, name: string, fileExtension: string): ParsedLine[] {
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

/** 上傳的檔案列表 */
const fileInfoMap = ref<Map<string, FileInfo>>(new Map());


async function parseFile2(file: File, tabList: Ref<FileInfo[]>): Promise<boolean> {
    try {
        let fileExtension = (/[.]/.exec(file.name) ? file.name.split(".")[1] : "")
            .trim()
            .toLowerCase();
        let name = file.name.split(".")[0].trim();
        console.log(file, fileExtension);
        let res = await getContentByFile(file);
        let fileInfo: FileInfo = {
            parsedLineList: getParsedLineList(res, name, fileExtension),
            fileRawName: file.name,
            fileName: name,
            fileExtension: fileExtension,
        };
        tabList.value = tabList.value.filter((e) => e.fileName !== name);
        tabList.value.push(fileInfo);
        fileInfoMap.value.set(file.name.split(".")[0].trim(), fileInfo);

        //   targetTabName.value = name;
    } catch (e) {
        console.log(e);
    }
    return false;
}

export { fileInfoMap, parseFile2 as parseFile }

