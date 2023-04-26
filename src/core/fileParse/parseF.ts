import { RPGContent } from "../../types/parsedRpgFile";
import { isBlank, isNotBlank, ezCutUtil } from "../../utils/StringUtils"

/**
 * 
 */
function parseFileDescriptionSpecification(rl: string): Map<string, RPGContent> {
    let ezCut = ezCutUtil(rl);
    let contentMap: Map<string, RPGContent> = new Map();
    contentMap.set('HEAD_COMMENT', { value: ezCut(1, 5), class: "comments" });
    contentMap.set('Form Type', { value: ezCut(6, 6), view: "KeywordField", dic: "Form_Type_Dic" });
    contentMap.set('File Name', { value: ezCut(7, 14), view: "ParameterField" });
    contentMap.set('File Type', { value: ezCut(15, 15), view: "KeywordField", dic: "File_Type_Dic" });
    contentMap.set('File Designation', { value: ezCut(16, 16), view: "KeywordField", dic: "File_Designation_Dic" });
    contentMap.set('End of File', { value: ezCut(17, 17) });
    contentMap.set('Sequence', { value: ezCut(18, 18) });
    contentMap.set('File Format', { value: ezCut(19, 19) });
    contentMap.set('Reserved1', { value: ezCut(20, 23) });
    contentMap.set('Record Length', { value: ezCut(24, 27) });
    contentMap.set('Limits Processing', { value: ezCut(28, 28) });
    contentMap.set('Length of Key or Record Address', { value: ezCut(29, 30) });
    contentMap.set('Record Address Type', { value: ezCut(31, 31) });
    contentMap.set('File Organization', { value: ezCut(32, 32) });
    contentMap.set('Overflow Indicator', { value: ezCut(33, 34) });
    contentMap.set('Key Field Starting Location', { value: ezCut(35, 38) });
    contentMap.set('Extension Code', { value: ezCut(39, 39) });
    contentMap.set('Device', { value: ezCut(40, 46) });
    contentMap.set('Reserved2', { value: ezCut(47, 52) });
    contentMap.set('Continuation Lines', { value: ezCut(53, 53) });
    contentMap.set('Routine', { value: ezCut(54, 59) });
    contentMap.set('Reserved3', { value: ezCut(60, 65) });
    contentMap.set('File Addition', { value: ezCut(66, 66) });
    contentMap.set('Reserved4', { value: ezCut(67, 70) });
    contentMap.set('File Conditio', { value: ezCut(71, 72) });
    contentMap.set('Reserved5', { value: ezCut(73, 74) });
    contentMap.set('Comments', { value: ezCut(75, 80), class: "comments" });

    // contentMap.set('', { value: ezCut(, ) });
    return contentMap;
}

/** Continuation Line 
 * https://www.ibm.com/docs/en/rdfi/9.6.0?topic=SSAE4W_9.6.0/com.ibm.etools.iseries.langref.doc/evferlsh65.html#HDRCLSC
*----------------------------------------------------------------*
|          Continuation Line Summary Chart                       |
*----------*----------*----------*-------------------------------*
| POSI-    | NAME     | ENTRY    | EXPLANATION                   |
| TIONS    |          |          |                               |
*----------*----------*----------*-------------------------------*
| 1-2      | Page     | Page     | Entry assigns a page number   |
|          |          | number   | to each specification form.   |
*----------*----------*----------*-------------------------------*
| 3-5      | Line     | Line     | Entry numbers the specifica-  |
|          |          | number   | tion line.                    |
*----------*----------*----------*-------------------------------*
| 6        | Form     | F        | Identification for a file     |
|          | type     |          | description specification.    |
*----------*----------*----------*-------------------------------*
| 7-18     |          | Blank    | These positions must be blank |
|          |          |          | for a separate continuation   |
|          |          |          | line.                         |
*----------*----------*----------*-------------------------------*
| 19-28    |          | External | These positions are used to   |
|          |          | name of  | specify the external name of  |
|          |          | record   | the record format that is to  |
|          |          | format   | be renamed ("RENAME") or      |
|          |          |          | ignored ("IGNORE").           |
*----------*----------*----------*-------------------------------*
| 29-46    |          | Blank    | These positions must be blank |
|          |          |          | for a separate continuation   |
|          |          |          | line.                         |
*----------*----------*----------*-------------------------------*
| 47-52    | Record   | Numeric  | For the "SFILE" options,      |
|          | number   | field    | these positions must specify  |
|          | field    | name     | the name of a Relative Record |
|          | for      |          | Number ("RECNO") field. For   |
|          | "SFILE"  |          | other continuation line       |
|          |          |          | options, these positions must |
|          |          |          | be blank.                     |
*----------*----------*----------*-------------------------------*
| 53       | Contin-  | K        | Indicates a continuation      |
|          | uation   |          | line.                         |
|          | line     |          |                               |
*----------*----------*----------*-------------------------------*
| 54-59,   |          |          | These positions are used      |
| 60-67    |          |          | together.  Positions 54       |
|          |          |          | through 59 specify the        |
|          |          |          | option, while positions 60    |
|          |          |          | through 67 provide further    |
|          |          |          | explanation of the option.    |
*----------*----------*----------*-------------------------------*
| 68-74    |          | Blank    | These positions must be blank |
|          |          |          | for a separate continuation   |
|          |          |          | line.                         |
*----------*----------*----------*-------------------------------*
| 75-80    |          | Optional | This space is available for   |
|          |          |          | comments.                     |
*----------*----------*----------*-------------------------------*
 * @param rl 
 */
function parseContinuationLines(rl: string): Map<string, RPGContent> {
    let ezCut = ezCutUtil(rl);
    let contentMap: Map<string, RPGContent> = new Map();
    contentMap.set('Page', { value: ezCut(1, 2) });
    contentMap.set('Line', { value: ezCut(3, 5) });
    contentMap.set('Form Type', { value: ezCut(6, 6), view: "KeywordField", dic: "Form_Type_Dic" });
    contentMap.set('Reserved1', { value: ezCut(7, 18) }); // must Blank
    contentMap.set('External Name', { value: ezCut(19, 28), view: "ParameterField" });
    contentMap.set('Reserved2', { value: ezCut(29, 46) }); // must Blank
    contentMap.set('Record Number Field', { value: ezCut(47, 52) });
    contentMap.set('Continuation Lines', { value: ezCut(53, 53) }); // must K
    contentMap.set('Option', { value: ezCut(54, 59) });
    contentMap.set('Option Explanation', { value: ezCut(60, 67), view: "ParameterField" });
    contentMap.set('Reserved3', { value: ezCut(68, 74) }); // must Blank
    contentMap.set('Comments', { value: ezCut(75, 80), class: "comments" });

    // contentMap.set('temp', { value: ezCut(1, 80) });
    return contentMap;
}

export { parseFileDescriptionSpecification, parseContinuationLines }