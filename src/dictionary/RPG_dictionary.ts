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
}

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
]



const Constants = [
    '*BLANK', '*BLANKS', '*ZERO', '*ZEROS', '*HIVAL', '*LOVAL', '*ALL', '*ON', '*OFF', '*DATE', 'UDATE',
    '*MONTH', 'UMONTH', '*DAY', 'UDAY', '*YEAR', 'UYEAR', '*CANCL', '*DETC', '*DETL', '*GETIN', '*INIT',
    '*OFL', '*TERM', '*TOTC', '*TOTL', '*DEFN', '*ENTRY', '*INZSR', '*LDA', '*LIKE', '*LOCK', '*NAMVAR',
    '*OFF', '*ON', '*PDA', '*PSSR', '*FILE', '*EQUATE', '*PLACE'
]


const Keywords_Dic: KeywordsDic = {
    'Form_Type_Dic': Form_Type_Dic,
    'Opcde_Dic': opcdeDictionary,
    'Record_Identifying_Indicator_Dic': Record_Identifying_Indicator_Dic,
    "Data_Type_Dic": Data_Type_Dic
}

export type { KeywordsDic, FormTypeBar };
export { opcdeDictionary, Keywords_Dic, FORM_TYPE_BAR_LIST, Constants };

