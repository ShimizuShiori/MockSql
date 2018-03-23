"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NumberHelper {
    static TryParse(str, ref) {
        let num = Number.parseInt(str);
        if (Number.isNaN(num))
            return false;
        ref.Value = num;
        return true;
    }
    static Random(startNumber, range) {
        return Math.floor(Math.random() * range) + startNumber;
    }
}
exports.NumberHelper = NumberHelper;
