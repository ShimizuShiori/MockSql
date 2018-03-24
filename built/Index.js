"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TypeHelper_1 = require("./base/TypeHelper");
const Main_1 = require("./Main");
let path = process.argv[2];
if (TypeHelper_1.TypeHelper.IsNullOrUndefined(path)) {
    console.error("ERROR : 没有指定参数");
}
else {
    try {
        Main_1.default(path);
    }
    catch (e) {
        console.error("ERROR : " + e);
    }
}
