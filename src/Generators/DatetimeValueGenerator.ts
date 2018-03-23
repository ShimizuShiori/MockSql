import { IValueGenerator } from "./IValueGenerator";
import { NumberHelper } from "../base/NumberHelper";
import { StringHelper } from "../base/StringHelper";

export class DatetimeValueGenerator implements IValueGenerator {
    public MinDate: string = "2000-01-01";
    public MaxDate: string = "2018-01-01";

    GetName(): string {
        return "DateTime";
    }
    Generate(): string {
        let minDate: Date = new Date(this.MinDate);
        let maxDate: Date = new Date(this.MaxDate);
        let range = maxDate.valueOf() - minDate.valueOf() + 1;
        let randomValue = NumberHelper.Random(minDate.valueOf(), range);
        let rDate = new Date(randomValue);

        return [
            rDate.getFullYear(),
            "-",
            StringHelper.PaddingLeft((rDate.getMonth() + 1).toString(), "0", 2),
            "-",
            StringHelper.PaddingLeft(rDate.getDate().toString(), "0", 2),
            " ",
            StringHelper.PaddingLeft(rDate.getHours().toString(), "0", 2),
            ":",
            StringHelper.PaddingLeft(rDate.getMinutes().toString(), "0", 2),
            ":",
            StringHelper.PaddingLeft(rDate.getSeconds().toString(), "0", 2),
            ".",
            StringHelper.PaddingLeft(rDate.getMilliseconds().toString(), "0", 3)
        ].join("");
    }
}
