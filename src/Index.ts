import { TypeHelper } from "./base/TypeHelper";
import Main from "./Main";
import TaskBuilder from "./TaskBuilder";

let action: string = process.argv[2];

let tableName: string = process.argv[3];

if (
    TypeHelper.IsNullOrUndefined(tableName) ||
    TypeHelper.IsNullOrUndefined(action)
) {
    console.error("ERROR : 没有指定参数，mocksql [action] [path]");
} else {
    try {
        doAction(action);
    } catch (e) {
        console.error("ERROR : " + e);
    }
}

function doAction(action: string) {
    if (action === "sql") Main(tableName + ".json");
    else if (action === "task") TaskBuilder(tableName + ".txt");
}
