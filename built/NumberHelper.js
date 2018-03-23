"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NumberHelper = /** @class */ (function () {
    function NumberHelper() {
    }
    NumberHelper.TryParse = function (str, ref) {
        var num = Number.parseInt(str);
        if (Number.isNaN(num))
            return false;
        ref.Value = num;
        return true;
    };
    return NumberHelper;
}());
exports.NumberHelper = NumberHelper;
