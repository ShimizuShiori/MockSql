"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NumberHelper_1 = require("../base/NumberHelper");
var StringValueGeneratorType;
(function (StringValueGeneratorType) {
    StringValueGeneratorType["Random"] = "Random";
    StringValueGeneratorType["Enum"] = "Enum";
})(StringValueGeneratorType = exports.StringValueGeneratorType || (exports.StringValueGeneratorType = {}));
class StringValueGenerator {
    constructor() {
        this.MinLength = 10;
        this.MaxLength = 100;
        this.Type = StringValueGeneratorType.Random;
        this.Options = [];
        this.words = "qwertytuiopasdfghjklzxcvbnm ,.".split("");
    }
    GetName() {
        return "String";
    }
    Generate() {
        if (this.Type === StringValueGeneratorType.Enum)
            return this.GenerateByEnum();
        else
            return this.GenerateByRandom();
    }
    GenerateByEnum() {
        return this.Options[NumberHelper_1.NumberHelper.Random(0, this.Options.length)];
    }
    GenerateByRandom() {
        let length = NumberHelper_1.NumberHelper.Random(this.MinLength, this.MaxLength - this.MinLength);
        let rlt = [];
        while (rlt.length < length) {
            rlt.push(this.words[NumberHelper_1.NumberHelper.Random(0, this.words.length)]);
        }
        return rlt.join("");
    }
}
exports.StringValueGenerator = StringValueGenerator;
