const FormTypes = ['I', 'C', 'E', 'F', 'comments', 'unknown'] as const;


export type FormType = typeof FormTypes[number];