"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 将转类型包装为引用类型的容器
 */
var Ref = /** @class */ (function () {
    function Ref() {
    }
    Object.defineProperty(Ref.prototype, "Value", {
        get: function () {
            return this.value;
        },
        set: function (val) {
            this.value = val;
        },
        enumerable: true,
        configurable: true
    });
    return Ref;
}());
exports.Ref = Ref;
