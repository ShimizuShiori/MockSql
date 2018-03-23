import { IValueGenerator } from "./IValueGenerator";
export interface FactoryFunc<TKey, TResult> {
    (key: TKey): TResult;
}

export class ValueGeneratorFactory {
    private static map: Map<
        string,
        FactoryFunc<string, IValueGenerator>
    > = new Map<string, FactoryFunc<string, IValueGenerator>>();

    public static RegistGenerator(
        key: string,
        func: FactoryFunc<string, IValueGenerator>
    ): void {
        ValueGeneratorFactory.map.set(key, func);
    }

    public static GetGenerator(key: string, inject: any): IValueGenerator {
        let result = ValueGeneratorFactory.map.get(key)(key);
        for (var key in inject) {
            result[key] = inject[key];
        }
        return result;
    }
}
