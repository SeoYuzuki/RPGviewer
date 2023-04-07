// array 是否相同 不計排序
const arraysEqual = function (a: any[], b: any[]) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    a = a.sort();
    b = b.sort();
    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
};

/**
 * 讀檔
 * @param {*} file 檔案
 */
const getContentByFile = async function (file: File): Promise<string> {
    return new Promise(resolve => {
        if (!file.name.includes(".rpg") && !file.name.includes(".txt")) {
            //this.$Message.warning("不合規副檔名");
            resolve("fail");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            // this.$Message.warning("讀檔");
            resolve(reader.result ? reader.result.toString() : "");
        };
        reader.onerror = err => {
            //this.$Message.warning("讀檔錯誤");
            console.log("readFile error");
        };
        reader.readAsText(file);
    });
};




export { arraysEqual, getContentByFile }