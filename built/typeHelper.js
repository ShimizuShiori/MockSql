"use strict";
//TypeHelper.ts
Object.defineProperty(exports, "__esModule", { value: true });
var TypeHelper = /** @class */ (function () {
    function TypeHelper() {
    }
    TypeHelper.IsNull = function (value) {
        return value === null;
    };
    TypeHelper.IsUndefined = function (value) {
        return TypeHelper.GetType(value) === "undefined";
    };
    TypeHelper.IsNullOrUndefined = function (value) {
        return TypeHelper.IsNull(value) || TypeHelper.IsUndefined(value);
    };
    TypeHelper.IsString = function (value) {
        return TypeHelper.GetType(value) === "string";
    };
    TypeHelper.IsNumber = function (value) {
        return TypeHelper.GetType(value) === "number";
    };
    TypeHelper.IsBoolean = function (value) {
        return TypeHelper.GetType(value) === "boolean";
    };
    TypeHelper.IsObject = function (value) {
        return TypeHelper.GetType(value) === "object";
    };
    TypeHelper.IsFunction = function (value) {
        return TypeHelper.GetType(value) === "function";
    };
    TypeHelper.IsArray = function (value) {
        return Array.isArray(value);
    };
    TypeHelper.IsDate = function (value) {
        return TypeHelper.IsClass(value, Date);
    };
    TypeHelper.IsClass = function (value, cls) {
        return value instanceof cls;
    };
    TypeHelper.GetType = function (value) {
        return typeof value;
    };
    return TypeHelper;
}());
exports.TypeHelper = TypeHelper;
