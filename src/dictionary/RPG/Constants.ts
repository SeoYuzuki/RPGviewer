/**
 * RPG IV Words with Special Functions/Reserved Words
 * https://www.ibm.com/docs/en/i/7.2?topic=words-rpg-iv-special-functionsreserved
 */

type ReservedWord = {
    key: string;
    regex: string;
    info: string;
    url?: string;
}

// TODO
const Reserved_Words: ReservedWord[] = [
];


const Constants = [
    '*BLANK', '*BLANKS', '*ZERO', '*ZEROS', '*HIVAL', '*LOVAL', '*ALL', '*ON', '*OFF', '*DATE', 'UDATE',
    '*MONTH', 'UMONTH', '*DAY', 'UDAY', '*YEAR', 'UYEAR', '*CANCL', '*DETC', '*DETL', '*GETIN', '*INIT',
    '*OFL', '*TERM', '*TOTC', '*TOTL', '*DEFN', '*ENTRY', '*INZSR', '*LDA', '*LIKE', '*LOCK', '*NAMVAR',
    '*OFF', '*ON', '*PDA', '*PSSR', '*FILE', '*EQUATE', '*PLACE'
]

export { Constants }