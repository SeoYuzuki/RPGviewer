const FormTypes = ['H', 'A', 'I', 'C', 'E', 'F', 'comments', 'unknown', 'unknown2'] as const;


export type FormType = typeof FormTypes[number];