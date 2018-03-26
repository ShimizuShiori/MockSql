import { IValueGenerator } from "./IValueGenerator";
import { NumberHelper } from "../base/NumberHelper";

export enum IntValueGeneratorType {
    Sequence = "Sequence",
    Random = "Random"
}
export enum IntValueGeneratorSourceType {
    Range = "Range",
    List = "List"
}

export interface RangeInfo {
    Min: number;
    Max: number;
    Step: number;
}

export class IntValueGenerator implements IValueGenerator {
    public Type: IntValueGeneratorType = IntValueGeneratorType.Sequence;
    public SourceType: IntValueGeneratorSourceType = IntValueGeneratorSourceType.Range;
    public RangeInfo: RangeInfo = {
        Min: 1,
        Max: 10000,
        Step: 1
    };
    public List: number[] = [];

    private currentIndex: number = -1;

    GetName(): string {
        return "Int";
    }

    Generate(): string {
        this.InitList();
        if (this.Type === IntValueGeneratorType.Sequence)
            return this.GenerateBySequence().toString();
        else return this.GenerateByRandom().toString();
    }

    private GenerateBySequence(): number {
        if (this.currentIndex === -1) {
            this.currentIndex = 0;
        } else if (this.currentIndex === this.List.length - 1) {
            this.currentIndex = 0;
        } else {
            this.currentIndex++;
        }
        return this.List[this.currentIndex];
    }

    private GenerateByRandom(): number {
        return this.List[NumberHelper.Random(0, this.List.length)];
    }

    private InitList(): void {
        if (this.SourceType === IntValueGeneratorSourceType.List) return;
        for (
            let i = this.RangeInfo.Min;
            i <= this.RangeInfo.Max;
            i += this.RangeInfo.Step
        )
            this.List.push(i);
    }
}
