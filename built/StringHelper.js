"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StringHelper = /** @class */ (function () {
    function StringHelper() {
    }
    /**
     * 重复一个字符串
     * @param str 目标字符串
     * @param count 重复的次数
     */
    StringHelper.Repeat = function (str, count) {
        var result = [];
        for (var i = 0; i < count; i++)
            result.push(str);
        return result.join("");
    };
    StringHelper.SplitByIndexes = function (str, indexes) {
        var result = [];
        var currentIndex = 0;
        var currentIndexIndex = 0;
        var currentArray = [];
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
    };
    StringHelper.Insert = function (str, index, paddingStr) {
        var array = StringHelper.SplitByIndexes(str, [index]);
        return array.join(paddingStr);
    };
    StringHelper.ReplaceRange = function (str, startIndex, count, paddingString) {
        var endIndex = startIndex + count;
        var array = StringHelper.SplitByIndexes(str, [startIndex, endIndex]);
        array[1] = paddingString;
        return array.join("");
    };
    return StringHelper;
}());
exports.StringHelper = StringHelper;
