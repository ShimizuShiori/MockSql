"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NumberHelper_1 = require("../base/NumberHelper");
class BooleanValueGenerator {
    constructor() {
        this.Rate = 50;
    }
    GetName() {
        return "Boolean";
    }
    Generate() {
        let num = NumberHelper_1.NumberHelper.Random(0, 100);
        return num < this.Rate ? "1" : "0";
    }
}
exports.BooleanValueGenerator = BooleanValueGenerator;
