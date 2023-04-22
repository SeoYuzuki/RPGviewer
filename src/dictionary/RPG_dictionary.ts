import { FormType } from "../types/FormType";

interface Dic {
    readonly keyword: string
    readonly title: string
    readonly content: string
    readonly website: string
}

interface KeywordsDic {
    readonly Form_Type_Dic: Dic[];
    readonly Opcde_Dic: Dic[];
    readonly Record_Identifying_Indicator_Dic: Dic[];
    readonly Data_Type_Dic: Dic[];
    readonly File_Designation_Dic: Dic[];
    readonly Data_Type_And_Keyboard_Shift: Dic[];
}

/**
 * https://www.ibm.com/docs/en/rdfi/9.6.0?topic=rpg400-language-reference#ToC
 */
const opcdeDictionary: Dic[] = [
    {
        keyword: "PLIST",
        title: "PLIST (Identify a Parameter List)",
        content: `The declarative PLIST operation defines a unique symbolic name for a parameter list to be specified in a CALL operation.

        You can specify a PLIST operation anywhere within calculations, including within total calculations and between subroutines. The control level entry (positions 7 and 8) can be blank or can contain an L1 through L9 indicator, an LR indicator, or an L0 entry to group the statement in the appropriate section of the program. The PLIST operation must be immediately followed by at least one PARM operation. Conditioning indicator entries (positions 9 through 17) are not allowed.`,
        website: "https://www.ibm.com/docs/en/rdfi/9.6.0?topic=SSAE4W_9.6.0/com.ibm.etools.iseries.langref.doc/evferlsh320.htm#HDRZZPLIST"
    },
    {
        keyword: "PARM",
        title: "PARM (Identify Parameters)",
        content: "The declarative PARM operation defines the parameters that compose a parameter list (PLIST). PARM operations can appear anywhere in calculations as long as they immediately follow the PLIST or CALL operation they refer to. PARM statements must be in the order expected by the called program. One PARM statement, or as many as 255 PARM statements, can follow a PLIST or CALL.",
        website: "https://www.ibm.com/docs/en/rdfi/9.6.0?topic=SSAE4W_9.6.0/com.ibm.etools.iseries.langref.doc/evferlsh319.htm#HDRZZPARM"
    },
    {
        keyword: "SETLL",
        title: "SETLL (Set Lower Limit)",
        content: "The SETLL operation positions a file at the next record that has a key or relative record number that is greater than or equal to the search argument (key or relative record number) specified in factor 1. The file must be a full procedural file (identified by an F in position 16 of the file description specifications).",
        website: "https://www.ibm.com/docs/en/rdfi/9.6.0?topic=SSAE4W_9.6.0/com.ibm.etools.iseries.langref.doc/evferlsh334.htm#HDRZZSETLL"
    },
    {
        keyword: "EXSR",
        title: "EXSR (Invoke Subroutine)",
        content: "The EXSR operation causes the RPG/400 subroutine named in factor 2 to be processed. The subroutine name must be a unique symbolic name and must appear as factor 1 of a BEGSR operation. The EXSR operation can appear anywhere in the calculation specifications. Whenever it appears, the subroutine that is named is processed. After operations in the subroutine are processed, the statement following the EXSR operation is processed except when a GOTO within the subroutine is given to a label outside the subroutine or when the subroutine is an exception/error subroutine with an entry in factor 2 of the ENDSR operation.",
        website: "https://www.ibm.com/docs/en/SSAE4W_9.6.0/com.ibm.etools.iseries.langref.doc/evferlsh291.htm#HDRZZEXSR"
    },
    {
        keyword: "ACQ",
        title: "ACQ (Acquire)",
        content: "The ACQ operation acquires the program device specified in factor 1 for the WORKSTN file specified in factor 2. If the device is available, ACQ attaches it to the file. If it is not available or is already attached to the file, an error occurs. If an indicator is specified in positions 56 and 57, the indicator is set on. If no indicator is specified, but the INFSR subroutine is specified, the INFSR receives control when an error/exception occurs. If no indicator or INFSR subroutine is specified, the default error/exception handler receives control when an error/exception occurs.",
        website: ""
    },
    {
        keyword: "MOVEL",
        title: "MOVEL (Move Left)",
        content: "The MOVEL operation transfers characters from factor 2 to the result field. Moving begins with the leftmost character in factor 2. You cannot specify resulting indicators if the result field is an array. You can specify them if the result field is an array element, or a nonarray field.",
        website: "https://www.ibm.com/docs/en/rdfi/9.6.0?topic=SSAE4W_9.6.0/com.ibm.etools.iseries.langref.doc/evferlsh310.htm#HDRZZMOVEL"
    },
    {
        keyword: "MULT",
        title: "MULT (Multiply)",
        content: "If factor 1 is specified, factor 1 is multiplied by factor 2 and the product is placed in the result field. Be sure that the result field is large enough to hold it. Use the following rule to determine the maximum result field length: result field length equals the length of factor 1 plus the length of factor 2. If factor 1 is not specified, factor 2 is multiplied by the result field and the product is placed in the result field. Factor 1 and factor 2 must be numeric, and each can contain one of: an array, array element, field, figurative constant, literal, named constant, subfield, or table name. The result field must be numeric, but cannot be a named constant. You can specify half adjust",
        website: "https://www.ibm.com/docs/en/rdfi/9.6.0?topic=SSAE4W_9.6.0/com.ibm.etools.iseries.langref.doc/evferlsh311.htm#HDRZZMULT"
    },
    {
        keyword: "TAG",
        title: "TAG (Tag)",
        content: "The declarative TAG operation names the label that identifies the destination of a GOTO (Go To) or CABxx (Compare and Branch) operation. ",
        website: "https://www.ibm.com/docs/en/rdfi/9.6.0?topic=SSAE4W_9.6.0/com.ibm.etools.iseries.langref.doc/evferlsh342.htm#HDRZZTAG"
    },
    {
        keyword: "CHAIN",
        title: "CHAIN (Random Retrieval from a File)",
        content: "The CHAIN operation retrieves a record from a full procedural file (F in position 16 of the file description specifications), sets a record identifying indicator on (if specified on the input specifications), and places the data from the record into the input fields.",
        website: "https://www.ibm.com/docs/en/rdfi/9.6.0?topic=SSAE4W_9.6.0/com.ibm.etools.iseries.langref.doc/evferlsh270.html#HDRZZCHAIN"
    },
];

const Form_Type_Dic: Dic[] = [
    {
        keyword: "C",
        title: "Calculation Specifications",
        content: "Calculation specifications indicate the operations to be done on the data in a program.",
        website: "https://www.ibm.com/docs/en/rdfi/9.6.0?topic=SSAE4W_9.6.0/com.ibm.etools.iseries.langref.doc/evferlsh175.htm#HDRCALCUL"
    },
    {
        keyword: "I",
        title: "Input Specifications",
        content: "For a program described input file, input specifications describe the types of records within the file, the sequence of the types of records, the fields within a record, the data within the field, indicators based on the contents of the fields, control fields, fields used for matching records, and fields used for sequence checking. For an externally described file, input specifications are optional and can be used to add RPG/400 functions to the external description. Input specifications are also used to describe data structures and named constants.",
        website: "https://www.ibm.com/docs/en/rdfi/9.6.0?topic=SSAE4W_9.6.0/com.ibm.etools.iseries.langref.doc/evferlsh94.htm#HDRINSPEC"
    },
    {
        keyword: "E",
        title: "Extension Specifications",
        content: "Extension specifications describe all record address files, arrays, and tables. A maximum of 200 arrays and tables can be used in a program.",
        website: "https://www.ibm.com/docs/en/rdfi/9.6.0?topic=SSAE4W_9.6.0/com.ibm.etools.iseries.langref.doc/evferlsh68.htm#HDREXTSPEC"
    },
    {

        keyword: "F",
        title: "File Description Specifications",
        content: 'File description specifications identify each file used by a program. One file-description specification statement is required for each file in the program.',
        website: 'https://www.ibm.com/docs/en/rdfi/9.6.0?topic=SSAE4W_9.6.0/com.ibm.etools.iseries.langref.doc/evferlsh34.html#HDRFILEDES'
    },
    {

        keyword: "O",
        title: "Output Specifications",
        content: 'Output specifications describe the record and the format of fields in a program described output file and when the record is to be written. Output specifications are optional for an externally described file. Output specifications can be divided into two categories: record identification and control (positions 7 through 37), and field description and control (positions 23 through 70). These specifications are entered on the RPG/400 Output Specifications.',
        website: 'https://www.ibm.com/docs/en/rdfi/9.6.0?topic=SSAE4W_9.6.0/com.ibm.etools.iseries.langref.doc/evferlsh190.html#HDROUTSPEC'
    }
]

const Record_Identifying_Indicator_Dic: Dic[] = [
    {
        keyword: "DS",
        title: "Data Structure",
        content: "DS indicate a data structure.",
        website: "https://www.ibm.com/docs/en/rdfi/9.6.0?topic=SSAE4W_9.6.0/com.ibm.etools.iseries.langref.doc/evferlsh144.htm#HDRISS1920"
    }
]

const File_Designation_Dic: Dic[] = [
    {
        keyword: " ",
        title: "Output file",
        content: "Output file.",
        website: "https://www.ibm.com/docs/en/rdfi/9.6.0?topic=SSAE4W_9.6.0/com.ibm.etools.iseries.langref.doc/evferlsh39.html#HDRF16"
    },
    {
        keyword: "P",
        title: "Primary file",
        content: "When several files are processed by cycle processing, one must be designated as the primary file. In multifile processing, processing of the primary file takes precedence. Only one primary file is allowed per program.",
        website: "https://www.ibm.com/docs/en/rdfi/9.6.0?topic=SSAE4W_9.6.0/com.ibm.etools.iseries.langref.doc/evferlsh39.html#HDRF16"
    },
    {
        keyword: "S",
        title: "Secondary File",
        content: "When more than one file is used during cycle-controlled programming, secondary files are input files. The processing of secondary files is determined by the order in which they are specified in the file-description specifications and on the rules of multifile logic.",
        website: "https://www.ibm.com/docs/en/rdfi/9.6.0?topic=SSAE4W_9.6.0/com.ibm.etools.iseries.langref.doc/evferlsh39.html#HDRF16"
    },
    {
        keyword: "R",
        title: "Record Address File",
        content: "A record-address file is a sequentially organized file used to select records from another file. Only one file in a program can be specified as a record-address file. This file is described on the file-description and extension specifications and not on the input specifications. The file processed by the record-address file must also be specified on the extension specifications and must be a primary, secondary, or full procedural file.",
        website: "https://www.ibm.com/docs/en/rdfi/9.6.0?topic=SSAE4W_9.6.0/com.ibm.etools.iseries.langref.doc/evferlsh39.html#HDRF16"
    },
    {
        keyword: "T",
        title: "Array or table file",
        content: "Array and table files specified by a T in position 16 are loaded at program initialization time. The array or table file can be input or combined. Leave this entry blank for array or table output files. You cannot specify SPECIAL as the device for array and table input files. You cannot specify an externally described file as an array or table file.",
        website: "https://www.ibm.com/docs/en/rdfi/9.6.0?topic=SSAE4W_9.6.0/com.ibm.etools.iseries.langref.doc/evferlsh39.html#HDRF16"
    },
    {
        keyword: "F",
        title: "Full Procedural File",
        content: "This entry is used when the input is controlled by calculation operations. File operation codes such as CHAIN or READ are used to do input functions.",
        website: "https://www.ibm.com/docs/en/rdfi/9.6.0?topic=SSAE4W_9.6.0/com.ibm.etools.iseries.langref.doc/evferlsh39.html#HDRF16"
    }
];

const Data_Type_Dic: Dic[] = [
    {
        keyword: "C",
        title: "Constant",
        content: "C indicate a constant.",
        website: "https://www.ibm.com/docs/en/rdfi/9.6.0?topic=SSAE4W_9.6.0/com.ibm.etools.iseries.langref.doc/evferlsh167.html#HDRINS43"
    },
    {
        keyword: " ",
        title: "Constant(Blank)",
        content: "Blank indicate a continuation line.",
        website: "https://www.ibm.com/docs/en/rdfi/9.6.0?topic=SSAE4W_9.6.0/com.ibm.etools.iseries.langref.doc/evferlsh167.html#HDRINS43"
    }
]

const Data_Type_And_Keyboard_Shift: Dic[] = [
    { keyword: " ", title: "Default", content: "", website: "https://www.ibm.com/docs/en/i/7.1?topic=35-valid-entries-display-files" },
    { keyword: "X", title: "Alphabetic only", content: "Character", website: "https://www.ibm.com/docs/en/i/7.1?topic=35-valid-entries-display-files" },
    { keyword: "A", title: "Alphanumeric shift", content: "Character", website: "https://www.ibm.com/docs/en/i/7.1?topic=35-valid-entries-display-files" },
    { keyword: "N", title: "Numeric shift", content: "Character or numeric", website: "https://www.ibm.com/docs/en/i/7.1?topic=35-valid-entries-display-files" },
    { keyword: "S", title: "Signed numeric", content: "Numeric", website: "https://www.ibm.com/docs/en/i/7.1?topic=35-valid-entries-display-files" },
    { keyword: "Y", title: "Numeric only", content: "Numeric", website: "https://www.ibm.com/docs/en/i/7.1?topic=35-valid-entries-display-files" },
    { keyword: "W", title: "Katakana (for Japan only)", content: "Character", website: "https://www.ibm.com/docs/en/i/7.1?topic=35-valid-entries-display-files" },
    { keyword: "I", title: "Inhibit keyboard entry", content: "Character or numeric", website: "https://www.ibm.com/docs/en/i/7.1?topic=35-valid-entries-display-files" },
    { keyword: "D", title: "Digits only", content: "Character or numeric", website: "https://www.ibm.com/docs/en/i/7.1?topic=35-valid-entries-display-files" },
    { keyword: "M", title: "Numeric only", content: "character Character", website: "https://www.ibm.com/docs/en/i/7.1?topic=35-valid-entries-display-files" },
    { keyword: "F", title: "Floating point", content: "Numeric", website: "https://www.ibm.com/docs/en/i/7.1?topic=35-valid-entries-display-files" },
    { keyword: "L", title: "Date", content: "", website: "https://www.ibm.com/docs/en/i/7.1?topic=35-valid-entries-display-files" },
    { keyword: "T", title: "Time", content: "", website: "https://www.ibm.com/docs/en/i/7.1?topic=35-valid-entries-display-files" },
    { keyword: "Z", title: "Timestamp", content: "", website: "https://www.ibm.com/docs/en/i/7.1?topic=35-valid-entries-display-files" },
];


/**
 * 
 */
interface FormTypeBar {
    readonly value: string;
    readonly label: FormType;
    /** bar */
    readonly bar: string;
    readonly tag?: string;
}
const FORM_TYPE_BAR_LIST: FormTypeBar[] = [
    {
        value: 'Record_Identification',
        label: 'I',
        bar: ".....IFilenameSqNORiPos1NCCPos2NCCPos3NCC.............................."
    },
    {
        value: 'Field_Description',
        label: 'I',
        bar: ".....I..............Ext-field+......................Field+L1M1..PlMnZr."
    },
    {
        value: 'Data_Structure',
        label: 'I',
        bar: ".....IDsname....NODsExt-file++.............OccrLen+...................."
    },
    {
        value: 'Data_Structure_Subfield',
        label: 'I',
        bar: ".....I....................................PFromTo++DField+L1M1FrPlMnZr."
    },
    {
        value: 'Named_Constant',
        label: 'I',
        bar: ".....I..............Namedconstant+++++++++C.........Fldnme............."
    },
    {
        value: 'Calculation_Specification',
        label: 'C',
        bar: ".....CL0N01N02N03Factor1+++OpcdeFactor2+++ResultLenDHHiLoEqComments++++"
    },
    {
        value: 'Extension_Specification',
        label: 'E',
        bar: ".....E....FromfileTofile++Name++N/rN/tbLenPDSArrnamLenPDSComments++++++"
    },
    {
        value: 'FX',
        label: 'F',
        tag: 'FX',
        bar: ".....FFilenameIPEAF........L..I........Device+......KExit++Entry+A....U"
    },
    {
        value: 'FC',
        label: 'F',
        tag: 'FC',
        bar: ".....F............Ext-record..................RcdnbrKOptionEntry+++...."
    },
    {
        value: 'Physical_And_logical_Files',
        label: 'A',
        tag: 'PF',
        bar: ".....A..........T.Name++++++RLen++TDpB......Functions++++++++++++++++++"
    },
    {
        value: 'LF',
        label: 'A',
        tag: 'LF',
        bar: ".....A..........T.Name++++++.Len++TDpB......Functions++++++++++++++++++"
    },
]



const Constants = [
    '*BLANK', '*BLANKS', '*ZERO', '*ZEROS', '*HIVAL', '*LOVAL', '*ALL', '*ON', '*OFF', '*DATE', 'UDATE',
    '*MONTH', 'UMONTH', '*DAY', 'UDAY', '*YEAR', 'UYEAR', '*CANCL', '*DETC', '*DETL', '*GETIN', '*INIT',
    '*OFL', '*TERM', '*TOTC', '*TOTL', '*DEFN', '*ENTRY', '*INZSR', '*LDA', '*LIKE', '*LOCK', '*NAMVAR',
    '*OFF', '*ON', '*PDA', '*PSSR', '*FILE', '*EQUATE', '*PLACE'
]


const Keywords_Dic: KeywordsDic = {
    Form_Type_Dic: Form_Type_Dic,
    Opcde_Dic: opcdeDictionary,
    Record_Identifying_Indicator_Dic: Record_Identifying_Indicator_Dic,
    Data_Type_Dic: Data_Type_Dic,
    File_Designation_Dic: File_Designation_Dic,
    Data_Type_And_Keyboard_Shift: Data_Type_And_Keyboard_Shift
}

export type { KeywordsDic, FormTypeBar, Dic };
export { opcdeDictionary, Keywords_Dic, FORM_TYPE_BAR_LIST, Constants };

