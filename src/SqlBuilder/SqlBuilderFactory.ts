import { FactoryFunc } from "../Generators/ValueGeneratorFactory";
import { ISqlBuilder } from "./ISqlBuilder";
export class SqlBuilderFactory {
    private static map = new Map<string, FactoryFunc<string, ISqlBuilder>>();

    public static ResigtSqlBuilder(
        key: string,
        func: FactoryFunc<string, ISqlBuilder>
    ) {
        SqlBuilderFactory.map.set(key, func);
    }

    public static GetSqlBuilder(key: string): ISqlBuilder {
        return SqlBuilderFactory.map.get(key)(key);
    }
}
