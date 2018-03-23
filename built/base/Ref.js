"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 将转类型包装为引用类型的容器
 */
class Ref {
    get Value() {
        return this.value;
    }
    set Value(val) {
        this.value = val;
    }
}
exports.Ref = Ref;
