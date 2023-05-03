import { RPGContent } from "../../types/parsedRpgFile";
import { isBlank, isNotBlank, substr_by_bytes, ezCutUtil } from "../../utils/StringUtils"

/**
 * Input spec record identification (I prompt)
 */
function parseRecordIdentificationEntries_I(rl: string): Map<string, RPGContent> {
    let ezCut = ezCutUtil(rl);

    let contentMap: Map<string, RPGContent> = new Map();
    contentMap.set('HEAD_COMMENT', { value: ezCut(1, 5), class: "comments" });
    contentMap.set('Form Type', { value: ezCut(6, 6), view: "KeywordField", dic: "Form_Type_Dic" });
    contentMap.set('File Name', { value: ezCut(7, 14), view: "ParameterField" });
    contentMap.set('Sequence', { value: ezCut(15, 16) });
    contentMap.set('Number', { value: ezCut(17, 17) });
    contentMap.set('Option', { value: ezCut(18, 18) });
    contentMap.set('Record Identifying Indicator', { value: ezCut(19, 20) });
    /** Positions 21-41 (Record Identification Codes) */
    contentMap.set('Position1', { value: ezCut(21, 24) });
    contentMap.set('Not1', { value: ezCut(25, 25) });
    contentMap.set('Code Part1', { value: ezCut(26, 26) });
    contentMap.set('Character1', { value: ezCut(27, 27) });
    contentMap.set('Position2', { value: ezCut(28, 31) });
    contentMap.set('Not2', { value: ezCut(32, 32) });
    contentMap.set('Code Part2', { value: ezCut(33, 33) });
    contentMap.set('Character2', { value: ezCut(34, 34) });
    contentMap.set('Position3', { value: ezCut(35, 38) });
    contentMap.set('Not3', { value: ezCut(39, 39) });
    contentMap.set('Code Part3', { value: ezCut(40, 40) });
    contentMap.set('Character3', { value: ezCut(41, 41) });

    contentMap.set('Reserved', { value: ezCut(42, 42) });
    contentMap.set('Reserved?', { value: ezCut(43, 74) });
    contentMap.set('Comments', { value: ezCut(75, 80), class: "comments" });
    return contentMap;
}

/**
 * Input spec field description (J prompt)
 */
function parseFieldDescriptionEntries_J(rl: string): Map<string, RPGContent> {
    let ezCut = ezCutUtil(rl);

    let contentMap: Map<string, RPGContent> = new Map();
    contentMap.set('HEAD_COMMENT', { value: ezCut(1, 5), class: "comments" });
    contentMap.set('Form Type', { value: ezCut(6, 6), view: "KeywordField", dic: "Form_Type_Dic" });
    contentMap.set('Reserved?', { value: ezCut(7, 42) });
    contentMap.set('Data Format', { value: ezCut(43, 43) });
    if (/^\d+$/.test(ezCut(44, 47).trim()) && /^\d+$/.test(ezCut(48, 51).trim())) {
        contentMap.set('Field Location1', { value: ezCut(44, 47), view: "ParameterField" });
        contentMap.set('Field Location2', { value: ezCut(48, 51), view: "ParameterField" });
    } else {
        contentMap.set('Field Location', { value: ezCut(44, 51) });
    }
    contentMap.set('Decimal Positions', { value: ezCut(52, 52) });
    contentMap.set('Field Name', { value: ezCut(53, 58), view: "ParameterField" });
    contentMap.set('Control Level', { value: ezCut(59, 60) });
    contentMap.set('Matching Fields', { value: ezCut(61, 62) });
    contentMap.set('Field Record Relation', { value: ezCut(63, 64) });
    contentMap.set('Field Indicators - Program Described', { value: ezCut(65, 70) });
    contentMap.set('Reserved', { value: ezCut(71, 74) });
    contentMap.set('Comments', { value: ezCut(75, 80), class: "comments" });

    return contentMap;
}

/**
 * Input spec record identification external (IX prompt)
 * @param rl 
 */
function parseRecordIdentificationEntries_IX(rl: string): Map<string, RPGContent> {
    let ezCut = ezCutUtil(rl);

    let contentMap: Map<string, RPGContent> = new Map();
    contentMap.set('HEAD_COMMENT', { value: ezCut(1, 5), class: "comments" });
    contentMap.set('Form Type', { value: ezCut(6, 6), view: "KeywordField", dic: "Form_Type_Dic" });
    contentMap.set('Record Name', { value: ezCut(7, 14), view: "ParameterField" });
    contentMap.set('Reserved1', { value: ezCut(15, 18) });
    contentMap.set('Record Identifying Indicator', { value: ezCut(19, 20) });
    contentMap.set('Record Identification Code', { value: ezCut(21, 41) }); // must be blank
    contentMap.set('Reserved2', { value: ezCut(42, 74) });
    contentMap.set('Comments', { value: ezCut(75, 80), class: "comments" });
    return contentMap;
}


/**
 * Input spec field description external (JX prompt)
 * @TODO https://www.ibm.com/docs/en/rdfi/9.6.0?topic=SSAE4W_9.6.0/com.ibm.etools.iseries.langref.doc/evferlsh126.html#HDRIED
 * @param rl 
 */
function parseFieldDescriptionEntries_JX(rl: string): Map<string, RPGContent> {
    let ezCut = ezCutUtil(rl);

    let contentMap: Map<string, RPGContent> = new Map();
    contentMap.set('HEAD_COMMENT', { value: ezCut(1, 5), class: "comments" });
    contentMap.set('Form Type', { value: ezCut(6, 6), view: "KeywordField", dic: "Form_Type_Dic" });
    contentMap.set('Reserved1', { value: ezCut(7, 20) });
    contentMap.set('External Field Name', { value: ezCut(21, 30), view: "ParameterField" });
    contentMap.set('Reserved2', { value: ezCut(31, 52) });
    contentMap.set('Field Name', { value: ezCut(53, 58), view: "ParameterField" });
    contentMap.set('Control Level', { value: ezCut(59, 60) });
    contentMap.set('Matching Fields', { value: ezCut(61, 62) });
    contentMap.set('Reserved3', { value: ezCut(63, 64) });
    contentMap.set('Externally Described Field Indicators', { value: ezCut(65, 70) });
    contentMap.set('Reserved4', { value: ezCut(71, 74) });
    contentMap.set('Comments', { value: ezCut(75, 80), class: "comments" });
    return contentMap;
}

/**
 * Data structure input specification (DS prompt)
 * @param rl 
 */
function parseDataStructureSpecificationEntries(rl: string): Map<string, RPGContent> {
    let ezCut = ezCutUtil(rl);

    let contentMap: Map<string, RPGContent> = new Map();
    contentMap.set('HEAD_COMMENT', { value: ezCut(1, 5), class: "comments" });
    contentMap.set('Form Type', { value: ezCut(6, 6), view: "KeywordField", dic: "Form_Type_Dic" });
    if (isBlank(ezCut(7, 12))) {
        contentMap.set('Data Structure Name', { value: ezCut(7, 12) });
    } else {
        contentMap.set('Data Structure Name', { value: ezCut(7, 12), view: "ParameterField" });
    }
    contentMap.set('Reserved1', { value: ezCut(13, 16) });
    contentMap.set('External Description', { value: ezCut(17, 17) });
    contentMap.set('Option', { value: ezCut(18, 18) });
    contentMap.set('Record Identifying Indicator', { value: ezCut(19, 20), view: "KeywordField", dic: "Record_Identifying_Indicator_Dic" }); // DS 
    contentMap.set('External File Name', { value: ezCut(21, 30) });
    contentMap.set('Reserved2', { value: ezCut(31, 43) });
    contentMap.set('Data Structure Occurrences', { value: ezCut(44, 47) });
    contentMap.set('Length', { value: ezCut(48, 51) });
    contentMap.set('Reserved3', { value: ezCut(52, 74) });
    contentMap.set('Comments', { value: ezCut(75, 80), class: "comments" });

    return contentMap;
}

/**
 * Data structure subfield input spec (SS prompt)
 * @param rl 
 */
function parseDataStructureSubfieldSpecifications(rl: string): Map<string, RPGContent> {
    let ezCut = ezCutUtil(rl);

    let contentMap: Map<string, RPGContent> = new Map();
    if (ezCut(8, 8) === 'I') {
        contentMap.set('HEAD_COMMENT', { value: ezCut(1, 5), class: "comments" });
        contentMap.set('Form Type', { value: ezCut(6, 6), view: "KeywordField", dic: "Form_Type_Dic" });
        contentMap.set('Reserved1', { value: ezCut(7, 7) });
        contentMap.set('Initialization Option', { value: ezCut(8, 8) });
        contentMap.set('Reserved2', { value: ezCut(9, 20) });
        contentMap.set('Initialization Value', { value: ezCut(21, 42), view: "ParameterField" });
        contentMap.set('Internal Data Format', { value: ezCut(43, 43) });
        if (/^\d+$/.test(ezCut(44, 47).trim()) && /^\d+$/.test(ezCut(48, 51).trim())) {
            contentMap.set('Field Location1', { value: ezCut(44, 47), view: "ParameterField" });
            contentMap.set('Field Location2', { value: ezCut(48, 51), view: "ParameterField" });
        } else {
            contentMap.set('Field Location', { value: ezCut(44, 51) });
        }
        contentMap.set('Decimal Positions', { value: ezCut(52, 52) });
        contentMap.set('Field Name', { value: ezCut(53, 58), view: "ParameterField" });
        contentMap.set('Reserved4', { value: ezCut(59, 74) });
        contentMap.set('Comments', { value: ezCut(75, 80), class: "comments" });
    } else {
        contentMap.set('HEAD_COMMENT', { value: ezCut(1, 5), class: "comments" });
        contentMap.set('Form Type', { value: ezCut(6, 6), view: "KeywordField", dic: "Form_Type_Dic" });
        contentMap.set('Reserved1', { value: ezCut(7, 7) });
        contentMap.set('Initialization Option', { value: ezCut(8, 8) });
        contentMap.set('Reserved2', { value: ezCut(9, 20) });
        contentMap.set('External Field Name', { value: ezCut(21, 30) });// 21~42 = Initialization Value, if pos 8 = 'I'
        contentMap.set('Reserved3', { value: ezCut(31, 42) }); // 
        contentMap.set('Internal Data Format', { value: ezCut(43, 43) });
        if (/^\d+$/.test(ezCut(44, 47).trim()) && /^\d+$/.test(ezCut(48, 51).trim())) {
            contentMap.set('Field Location1', { value: ezCut(44, 47), view: "ParameterField" });
            contentMap.set('Field Location2', { value: ezCut(48, 51), view: "ParameterField" });
        } else {
            contentMap.set('Field Location', { value: ezCut(44, 51) });
        }
        contentMap.set('Decimal Positions', { value: ezCut(52, 52) });
        contentMap.set('Field Name', { value: ezCut(53, 58), view: "ParameterField" });
        contentMap.set('Reserved4', { value: ezCut(59, 74) });
        contentMap.set('Comments', { value: ezCut(75, 80), class: "comments" });
    }


    return contentMap;
}

/**
 * Named Constant Specifications
 * @param rl 
 */
function parseNamedConstantSpecifications(rl: string): Map<string, RPGContent> {
    let ezCut = ezCutUtil(rl);

    let contentMap: Map<string, RPGContent> = new Map();
    contentMap.set('HEAD_COMMENT', { value: ezCut(1, 5), class: "comments" });
    contentMap.set('Form Type', { value: ezCut(6, 6), view: "KeywordField", dic: "Form_Type_Dic" });
    contentMap.set('Reserved1', { value: ezCut(7, 20) });
    contentMap.set('Constant', { value: ezCut(21, 42), view: "ParameterField" });
    contentMap.set('Data Type', { value: ezCut(43, 43) });
    contentMap.set('Reserved2', { value: ezCut(44, 52) });
    contentMap.set('Constant Name', { value: ezCut(53, 58), view: "ParameterField" });
    contentMap.set('Reserved3', { value: ezCut(59, 74) });
    contentMap.set('Comments', { value: ezCut(75, 80), class: "comments" });
    return contentMap;
}

export {
    parseRecordIdentificationEntries_I
    , parseFieldDescriptionEntries_J
    , parseRecordIdentificationEntries_IX
    , parseFieldDescriptionEntries_JX
    , parseDataStructureSpecificationEntries
    , parseDataStructureSubfieldSpecifications
    , parseNamedConstantSpecifications
};