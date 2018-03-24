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

declare interface GeneratorSetting {
    Name: string;
    Type: string;
    Inject: any;
}

declare interface FieldSetting {
    Name: string;
    Type: string;
    GeneratorName: string;
}

declare interface TaskSetting {
    Generators: GeneratorSetting[];
    Fields: FieldSetting[];
    DbType: string;
    TableName:string;
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
    let taskSettings = JSON.parse(json) as TaskSetting;

    let sqlBuilder = SqlBuilderFactory.GetSqlBuilder(taskSettings.DbType);
    let fields = taskSettings.Fields.map<FieldInfo>(x => {
        let generatorSetting = taskSettings.Generators.filter(
            y => y.Name === x.GeneratorName
        )[0];

        return {
            Name: x.Name,
            Type: x.Type,
            Generator: ValueGeneratorFactory.GetGenerator(
                generatorSetting.Type,
                generatorSetting.Inject
            )
        };
    });

    let values: string[][] = [];
    for (let i = 0; i < 1000; i++) {
        let singleRowValues: string[] = [];
        singleRowValues = fields.map(x => x.Generator.Generate());
        values.push(singleRowValues);
    }

    console.log(sqlBuilder.Build(taskSettings.TableName, fields, values));
}
