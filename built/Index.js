"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TypeHelper_1 = require("./base/TypeHelper");
const Main_1 = require("./Main");
const TaskBuilder_1 = require("./TaskBuilder");
let action = process.argv[2];
let tableName = process.argv[3];
if (TypeHelper_1.TypeHelper.IsNullOrUndefined(tableName) ||
    TypeHelper_1.TypeHelper.IsNullOrUndefined(action)) {
    console.error("ERROR : 没有指定参数，mocksql [action] [path]");
}
else {
    try {
        doAction(action);
    }
    catch (e) {
        console.error("ERROR : " + e);
    }
}
function doAction(action) {
    if (action === "sql")
        Main_1.default(tableName + ".json");
    else if (action === "task")
        TaskBuilder_1.default(tableName + ".txt");
}
