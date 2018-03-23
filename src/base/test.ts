import { StringHelper } from "./StringHelper";
import { NumberHelper } from "./NumberHelper";
import { Ref } from "./Ref";
let str: string = "abcdefghijkl";

console.log(StringHelper.Insert(str, 2, "123"));
console.log(StringHelper.ReplaceRange(str, 2, 2, "111"));

let r: Ref<number> = new Ref<number>();
console.log(NumberHelper.TryParse("1", r));
console.log(r);

console.log(NumberHelper.TryParse("2", r));
console.log(r);

console.log(NumberHelper.TryParse("ab", r));
console.log(r);