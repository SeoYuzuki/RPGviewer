import { ParsedLine, RPGContent } from "../../types/parsedRpgFile";
import { parseDDS_PF } from "./parseA";
import { isNotBlank, substr_by_bytes, ezCutUtil } from "../../utils/StringUtils"
import isBlank from "is-blank"

const parseDdsFile = function (ddsFile: string): ParsedLine[] {
    let ddsRawLines: string[] = ddsFile.split('\r\n');
    let parsedRpgFile: ParsedLine[] = [];
    for (let i = 0; i < ddsRawLines.length; i++) {
        let rl = ddsRawLines[i];
        let ezCut = ezCutUtil(rl);
        if (ezCut(7, 7) !== '*') { // if * at position 7 makes the entire line a comment.
            if (ezCut(6, 6) === 'A') {
                if (isBlank(ezCut(7, 44))) {
                    parsedRpgFile.push({
                        index: i,
                        rawRl: rl,
                        formType: "A",
                        formTypeSpecifications: "Physical_And_logical_Files_FunctionsLine",
                        contentMap: parseDDS_PF(rl)
                    });
                } else {
                    parsedRpgFile.push({
                        index: i,
                        rawRl: rl,
                        formType: "A",
                        formTypeSpecifications: "Physical_And_logical_Files",
                        contentMap: parseDDS_PF(rl)
                    });
                }

            } else {
                parsedRpgFile.push({
                    index: i,
                    rawRl: rl,
                    formType: "unknown",
                    contentMap: new Map()
                });
            }
        } else {
            // line comments
            parsedRpgFile.push({
                index: i,
                rawRl: rl,
                formType: "comments",
                contentMap: new Map()
            });
        }
    }

    return parsedRpgFile;
}

export { parseDdsFile }