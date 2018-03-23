import { IValueGenerator } from "./IValueGenerator";
import { NumberHelper } from "../base/NumberHelper";

export class BooleanValueGenerator implements IValueGenerator {
    public Rate: number = 50;

    GetName(): string {
        return "Boolean";
    }
    Generate(): string {
        let num = NumberHelper.Random(0, 100);
        return num < this.Rate ? "1" : "0";
    }
}
