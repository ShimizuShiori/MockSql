import { TypeHelper } from "./base/TypeHelper";
import Main from "./Main";

let path: string = process.argv[2];

if (TypeHelper.IsNullOrUndefined(path)) {
    console.error("ERROR : 没有指定参数");
} else {
    try {
        Main(path);
    } catch (e) {
        console.error("ERROR : " + e);
    }
}
