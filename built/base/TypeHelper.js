"use strict";
//TypeHelper.ts
Object.defineProperty(exports, "__esModule", { value: true });
class TypeHelper {
    static IsNull(value) {
        return value === null;
    }
    static IsUndefined(value) {
        return TypeHelper.GetType(value) === "undefined";
    }
    static IsNullOrUndefined(value) {
        return TypeHelper.IsNull(value) || TypeHelper.IsUndefined(value);
    }
    static IsString(value) {
        return TypeHelper.GetType(value) === "string";
    }
    static IsNumber(value) {
        return TypeHelper.GetType(value) === "number";
    }
    static IsBoolean(value) {
        return TypeHelper.GetType(value) === "boolean";
    }
    static IsObject(value) {
        return TypeHelper.GetType(value) === "object";
    }
    static IsFunction(value) {
        return TypeHelper.GetType(value) === "function";
    }
    static IsArray(value) {
        return Array.isArray(value);
    }
    static IsDate(value) {
        return TypeHelper.IsClass(value, Date);
    }
    static IsClass(value, cls) {
        return value instanceof cls;
    }
    static GetType(value) {
        return typeof value;
    }
}
exports.TypeHelper = TypeHelper;
