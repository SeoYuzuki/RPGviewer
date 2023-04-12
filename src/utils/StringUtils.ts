/**
 * 依照charCode切割字串
 * 如果非全形字，長度為。全型長度為2
 * @param {*} 目標字串
 * @param {*} 起始位置 
 * @param {*} 切割長度 
 */
function substr_by_bytes(str: string, startInBytes: number, lengthInBytes: number): string {
    function utf8_len(s: string) {
        var charCode = s.charCodeAt(0);
        if (charCode < 128) return 1;
        else return 2;
        //if (charCode < 2048) return 2;
        //if ((55296 <= charCode) && (charCode <= 56319)) return 4; // UTF-16 high surrogate
        //if ((56320 <= charCode) && (charCode <= 57343)) return 0; // UTF-16 low surrogate
        //if (charCode < 65536) return 3;
        // throw 'Bad char';
    }
    var currCharIdx = 0;

    // Scan through the string, looking for the start of the substring
    var bytePos = 0;
    while (bytePos < startInBytes) {
        var utf8Len = utf8_len(str.charAt(currCharIdx));
        bytePos += utf8Len;
        currCharIdx++;

        // Make sure to include low surrogate
        if ((utf8Len == 4) && (bytePos == startInBytes)) {
            currCharIdx++;
        }
    }

    // We've found the substring; copy it to resultStr character by character
    var resultStr = '';
    var currLengthInBytes = 0;
    while (currLengthInBytes < lengthInBytes) {
        if (str.charAt(currCharIdx) === '') { break; }
        var utf8Len = utf8_len(str.charAt(currCharIdx));
        currLengthInBytes += utf8Len;
        resultStr += str[currCharIdx];
        currCharIdx++;

        // Make sure to include low surrogate
        if ((utf8Len == 4) && (currLengthInBytes == lengthInBytes)) {
            resultStr += str[currCharIdx];
        }
    }

    return resultStr;
}

/**
 * 以ibm網站上的描述法切割字串，帶入愈切割的字串，取得一個function，
 * 該function 可帶入第幾個位置即可切割
 * @param rl 愈切割的字串
 */
function ezCutUtil(rl: string): (a: number, b: number) => string {
    return (a: number, b: number): string => {
        return substr_by_bytes(rl, a - 1, b - a + 1);
    }
}

function isEmpty(str: string) {
    return (!str || str.length === 0);
}

function isBlank(str: string) {
    return (!str || /^\s*$/.test(str));
}

function isNotBlank(str: string) {
    return !isBlank(str);
}



export { substr_by_bytes, ezCutUtil, isEmpty, isBlank, isNotBlank }