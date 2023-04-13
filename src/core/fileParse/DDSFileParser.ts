import { ParsedLine, RPGContent } from "../../types/parsedRpgFile";
import { isBlank, isNotBlank, substr_by_bytes, ezCutUtil } from "../../utils/StringUtils"

const parseDdsFile = function (ddsFile: string) {
    let ddsRawLines: string[] = ddsFile.split('\r\n');
    let parsedRpgFile: ParsedLine[] = [];
    for (let i = 0; i < ddsRawLines.length; i++) {
        let rl = ddsRawLines[i];
        let ezCut = ezCutUtil(rl);
        if (ezCut(7, 7) !== '*') { // if * at position 7 makes the entire line a comment.
            if (ezCut(6, 6) === 'A') {
                let contentMap: Map<string, RPGContent> = new Map();
                contentMap.set('HEAD_COMMENT', { value: ezCut(1, 5), class: "comments" });
                contentMap.set('Form Type', { value: ezCut(6, 6), view: "KeywordField", dic: "Form_Type_Dic" });
                contentMap.set('Condition', { value: ezCut(7, 16) });

                contentMap.set('Type of Name', { value: ezCut(17, 17) }); // R Record format name, H Help specification, Blank Field name
                contentMap.set('Reserved1', { value: ezCut(18, 18) });
                contentMap.set('Name', { value: ezCut(19, 28) });
                contentMap.set('Reference', { value: ezCut(29, 29) });
                contentMap.set('Length', { value: ezCut(30, 34) });
                /**
                 * Entry keyboard shifts    Meaning                     Data type permitted
                   Blank                    Default    
                   X                        Alphabetic only             Character
                   A                        Alphanumeric shift          Character
                   N                        Numeric shift               Character or numeric
                   S                        Signed numeric              Numeric
                   Y                        Numeric only                Numeric
                   W                        Katakana (for Japan only)   Character
                   I                        Inhibit keyboard entry      Character or numeric
                   D                        Digits only                 Character or numeric
                   M                        Numeric only                character Character
                   Data type
                   F                        Floating point              Numeric
                   L                        Date
                   T                        Time
                   Z                        Timestamp
                 */
                contentMap.set('Data type and keyboard shift', { value: ezCut(35, 35) });

                contentMap.set('Decimal positions', { value: ezCut(36, 37) });
                contentMap.set('Usage', { value: ezCut(38, 38) }); // Blank or O , I,B,H,M,P
                contentMap.set('Location', { value: ezCut(39, 44) });
                contentMap.set('DDS keyword entries', { value: ezCut(45, 80) });

                parsedRpgFile.push({
                    index: i,
                    rawRl: rl,
                    formType: "A",
                    formTypeSpecifications: "Data_Description",
                    contentMap: contentMap
                });
            }
        } else {
            // line comments
            parsedRpgFile.push({
                index: i,
                rawRl: rl,
                formType: "comments",
            });
        }
    }

    return parsedRpgFile;
}

export { parseDdsFile }