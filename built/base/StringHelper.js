"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StringHelper {
    /**
     * 重复一个字符串
     * @param str 目标字符串
     * @param count 重复的次数
     */
    static Repeat(str, count) {
        let result = [];
        for (let i = 0; i < count; i++)
            result.push(str);
        return result.join("");
    }
    static SplitByIndexes(str, indexes) {
        let result = [];
        let currentIndex = 0;
        let currentIndexIndex = 0;
        let currentArray = [];
        var length = str.length;
        while (currentIndex < length) {
            if (currentIndex === 0) {
                currentArray.push(str[currentIndex]);
            }
            else if (currentIndex === indexes[currentIndexIndex]) {
                result.push(currentArray.join(""));
                currentArray = [str[currentIndex]];
                currentIndexIndex++;
            }
            else {
                currentArray.push(str[currentIndex]);
            }
            currentIndex++;
        }
        if (currentArray.length !== 0)
            result.push(currentArray.join(""));
        return result;
    }
    static Insert(str, index, paddingStr) {
        let array = StringHelper.SplitByIndexes(str, [index]);
        return array.join(paddingStr);
    }
    static ReplaceRange(str, startIndex, count, paddingString) {
        let endIndex = startIndex + count;
        let array = StringHelper.SplitByIndexes(str, [startIndex, endIndex]);
        array[1] = paddingString;
        return array.join("");
    }
    static PaddingLeft(str, paddingStr, length) {
        let result = str;
        while (result.length < length) {
            result = paddingStr + result;
        }
        return result;
    }
}
exports.StringHelper = StringHelper;
