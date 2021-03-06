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
import cp = require('child_process');

let exec = cp.exec;

export interface GeneratorSetting {
    Name: string;
    Type: string;
    Inject: any;
}

export interface FieldSetting {
    Name: string;
    Type: string;
    GeneratorName: string;
}

export interface TaskSetting {
    Generators: GeneratorSetting[];
    Fields: FieldSetting[];
    DbType: string;
    TableName: string;
    RowCount: number;
    $schema?: string;
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
    for (let i = 0; i < taskSettings.RowCount; i++) {
        let singleRowValues: string[] = [];
        singleRowValues = fields.map(x => x.Generator.Generate());
        values.push(singleRowValues);
    }

    fs.writeFileSync(
        taskPath.split(".")[0] + ".sql",
        sqlBuilder.Build(taskSettings.TableName, fields, values)
    );

    exec(taskPath.split(".")[0] + ".sql");
}
