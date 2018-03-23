"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NumberHelper_1 = require("../base/NumberHelper");
const StringHelper_1 = require("../base/StringHelper");
class DatetimeValueGenerator {
    constructor() {
        this.MinDate = "2000-01-01";
        this.MaxDate = "2018-01-01";
    }
    GetName() {
        return "DateTime";
    }
    Generate() {
        let minDate = new Date(this.MinDate);
        let maxDate = new Date(this.MaxDate);
        let range = maxDate.valueOf() - minDate.valueOf() + 1;
        let randomValue = NumberHelper_1.NumberHelper.Random(minDate.valueOf(), range);
        let rDate = new Date(randomValue);
        return [
            rDate.getFullYear(),
            "-",
            StringHelper_1.StringHelper.PaddingLeft((rDate.getMonth() + 1).toString(), "0", 2),
            "-",
            StringHelper_1.StringHelper.PaddingLeft(rDate.getDate().toString(), "0", 2),
            " ",
            StringHelper_1.StringHelper.PaddingLeft(rDate.getHours().toString(), "0", 2),
            ":",
            StringHelper_1.StringHelper.PaddingLeft(rDate.getMinutes().toString(), "0", 2),
            ":",
            StringHelper_1.StringHelper.PaddingLeft(rDate.getSeconds().toString(), "0", 2),
            ".",
            StringHelper_1.StringHelper.PaddingLeft(rDate.getMilliseconds().toString(), "0", 3)
        ].join("");
    }
}
exports.DatetimeValueGenerator = DatetimeValueGenerator;
