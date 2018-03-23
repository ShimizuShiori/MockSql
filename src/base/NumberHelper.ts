import { Ref } from "./Ref";
export class NumberHelper {
    public static TryParse(str: string, ref: Ref<number>): boolean {
        let num = Number.parseInt(str);
        if (Number.isNaN(num)) return false;
        ref.Value = num;
        return true;
    }
    public static Random(startNumber: number, range: number): number {
        return Math.floor(Math.random() * range) + startNumber;
    }
}
