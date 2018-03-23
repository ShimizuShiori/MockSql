import { ValueGeneratorFactory } from "./Generators/ValueGeneratorFactory";
import { StringValueGenerator } from "./Generators/StringValueGenerator";
import { IValueGenerator } from "./Generators/IValueGenerator";
import { SqlBuilderFactory } from "./SqlBuilder/SqlBuilderFactory";
import { MSSQLBuilder } from "./SqlBuilder/MSSQLBuilder";
import { IntValueGenerator } from "./Generators/IntValueGenerator";
import { BooleanValueGenerator } from "./Generators/BooleanGenerator";
import { DatetimeValueGenerator } from "./Generators/DatetimeValueGenerator";
import { FieldInfo } from "./FieldInfo";
import fs = require("fs");

declare interface generatorSetting {
    type: string;
    inject: any;
}

declare interface FieldSetting {
    name: string;
    type: string;
    generator: generatorSetting;
}

declare interface taskSetting {
    dbType: string;
    tableName: string;
    fields: FieldSetting[];
}

ValueGeneratorFactory.RegistGenerator(
    "String",
    key => new StringValueGenerator()
);
ValueGeneratorFactory.RegistGenerator("Int", key => new IntValueGenerator());
ValueGeneratorFactory.RegistGenerator(
    "Boolean",
    key => new BooleanValueGenerator()
);
ValueGeneratorFactory.RegistGenerator(
    "Datetime",
    key => new DatetimeValueGenerator()
);
SqlBuilderFactory.ResigtSqlBuilder("MSSQL", key => new MSSQLBuilder());

export default function(taskPath: string) {
    let json = fs.readFileSync(taskPath, "utf8");
    let taskSettings = JSON.parse(json) as taskSetting;

    let sqlBuilder = SqlBuilderFactory.GetSqlBuilder(taskSettings.dbType);
    let fields = taskSettings.fields.map<FieldInfo>(x => {
        return {
            Name: x.name,
            Type: x.type,
            Generator: ValueGeneratorFactory.GetGenerator(
                x.generator.type,
                x.generator.inject
            )
        };
    });

    let values: string[][] = [];
    for (let i = 0; i < 1000; i++) {
        let singleRowValues: string[] = [];
        singleRowValues = fields.map(x => x.Generator.Generate());
        values.push(singleRowValues);
    }

    console.log(sqlBuilder.Build(taskSettings.tableName, fields, values));
}
