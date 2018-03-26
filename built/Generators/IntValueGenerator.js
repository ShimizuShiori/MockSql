"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NumberHelper_1 = require("../base/NumberHelper");
var IntValueGeneratorType;
(function (IntValueGeneratorType) {
    IntValueGeneratorType["Sequence"] = "Sequence";
    IntValueGeneratorType["Random"] = "Random";
})(IntValueGeneratorType = exports.IntValueGeneratorType || (exports.IntValueGeneratorType = {}));
var IntValueGeneratorSourceType;
(function (IntValueGeneratorSourceType) {
    IntValueGeneratorSourceType["Range"] = "Range";
    IntValueGeneratorSourceType["List"] = "List";
})(IntValueGeneratorSourceType = exports.IntValueGeneratorSourceType || (exports.IntValueGeneratorSourceType = {}));
class IntValueGenerator {
    constructor() {
        this.Type = IntValueGeneratorType.Sequence;
        this.SourceType = IntValueGeneratorSourceType.Range;
        this.RangeInfo = {
            Min: 1,
            Max: 10000,
            Step: 1
        };
        this.List = [];
        this.currentIndex = -1;
    }
    GetName() {
        return "Int";
    }
    Generate() {
        this.InitList();
        if (this.Type === IntValueGeneratorType.Sequence)
            return this.GenerateBySequence().toString();
        else
            return this.GenerateByRandom().toString();
    }
    GenerateBySequence() {
        if (this.currentIndex === -1) {
            this.currentIndex = 0;
        }
        else if (this.currentIndex === this.List.length - 1) {
            this.currentIndex = 0;
        }
        else {
            this.currentIndex++;
        }
        return this.List[this.currentIndex];
    }
    GenerateByRandom() {
        return this.List[NumberHelper_1.NumberHelper.Random(0, this.List.length)];
    }
    InitList() {
        if (this.SourceType === IntValueGeneratorSourceType.List)
            return;
        for (let i = this.RangeInfo.Min; i <= this.RangeInfo.Max; i += this.RangeInfo.Step)
            this.List.push(i);
    }
}
exports.IntValueGenerator = IntValueGenerator;
