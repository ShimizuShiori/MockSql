import { IValueGenerator } from "./IValueGenerator";
import { NumberHelper } from "../base/NumberHelper";

export enum StringValueGeneratorType {
    Random = "Random",
    Enum = "Enum"
}

export class StringValueGenerator implements IValueGenerator {
    public MinLength: number = 10;
    public MaxLength: number = 100;

    public Type: StringValueGeneratorType = StringValueGeneratorType.Random;

    public Options: string[] = [];

    private words: string[] = "qwertytuiopasdfghjklzxcvbnm ,.".split("");

    GetName(): string {
        return "String";
    }
    Generate(): string {
        if (this.Type === StringValueGeneratorType.Enum)
            return this.GenerateByEnum();
        else return this.GenerateByRandom();
    }

    private GenerateByEnum(): string {
        return this.Options[NumberHelper.Random(0, this.Options.length)];
    }

    private GenerateByRandom(): string {
        let length = NumberHelper.Random(
            this.MinLength,
            this.MaxLength - this.MinLength
        );
        let rlt: string[] = [];

        while (rlt.length < length) {
            rlt.push(this.words[NumberHelper.Random(0, this.words.length)]);
        }
        return rlt.join("");
    }
}
