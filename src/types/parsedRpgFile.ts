import { FormType } from "./FormType";

/**
 * 
 */
class ParsedLine {
    index: number;
    rawRl: string;
    formType: FormType;
    formTypeSpecifications?: string;
    formContent?: any
}

export { ParsedLine };