import { DelayChain, GroupResult } from "./base/DelayChain";
import { StringValueGeneratorType } from "./Generators/StringValueGenerator";
import test = require("./base/test");
import { FieldSetting } from "./Main";
import { TaskSetting, GeneratorSetting } from "./Main";
import { FieldInfo } from "./FieldInfo";
import { RangeInfo } from "./Generators/IntValueGenerator";
import fs = require("fs");
import os = require("os");

export default function(path: string) {
    let report = fs.readFileSync(path, "utf8");

    interface SQLFieldInfo {
        Name: string;
        Type: string;
        Computed: boolean;
        Length: number;
        IsId: boolean;
        GeneratorType: string;
    }

    let dc = DelayChain.FromArray([report])
        .Split(x => x.split(os.EOL))
        .Select(x => x.split("\t"))
        .Select<SQLFieldInfo>(x => {
            return {
                Name: x[0],
                Type: x[1],
                Computed: x[2] !== "no",
                Length: parseInt(x[3]),
                IsId: x[0].toLowerCase() === "id",
                GeneratorType: ""
            };
        })
        .Select<SQLFieldInfo>(x => {
            switch (x.Type) {
                case "bit":
                    x.GeneratorType = "Boolean";
                    break;
                case "char":
                case "varchar":
                case "nchar":
                case "nvarchar":
                    x.GeneratorType = "String";
                    break;
                case "datetime":
                    x.GeneratorType = "Datetime";
                    break;
                case "int":
                case "tinyiny":
                case "float":
                case "decimal":
                    x.GeneratorType = "Int";
                    break;
            }
            return x;
        })
        .Where(x => !x.IsId)
        .Where(x => x.GeneratorType !== "")
        .GroupBy(x => x.GeneratorType);

    let taskSettings: TaskSetting = {
        Generators: [],
        Fields: [],
        TableName: "",
        DbType: "MSSQL",
        RowCount: 100
    };
    taskSettings.$schema = "./task.schema.json";

    function handlerString(x: GroupResult<string, SQLFieldInfo>) {
        DelayChain.FromArray(x.Items)
            .GroupBy(x => x.Length)
            .Select(x => {
                let rlt = {};
                let gName = `String_1_${x.Key}`;
                let ThisGenerator: GeneratorSetting = {
                    Name: gName,
                    Type: "String",
                    Inject: {
                        MinLength: 1,
                        MaxLength: x.Key,
                        Type: "Random"
                    }
                };
                let fields: FieldSetting[] = DelayChain.FromArray(x.Items)
                    .Select<FieldSetting>(x => {
                        return {
                            Name: x.Name,
                            Type: x.Type,
                            GeneratorName: gName
                        };
                    })
                    .ToArray();
                return {
                    G: ThisGenerator,
                    F: fields
                };
            })
            .ToArray()
            .forEach(x => {
                taskSettings.Generators.push(x.G);
                taskSettings.Fields = taskSettings.Fields.concat(x.F);
            });
    }

    dc.ToArray().forEach(x => {
        if (x.Key === "String") {
            handlerString(x);
            return;
        }
        let gName = `${x.Key}`;
        let g: GeneratorSetting = {
            Name: gName,
            Type: x.Key,
            Inject: {}
        };
        taskSettings.Generators.push(g);
        switch (x.Key) {
            case "Int": {
                g.Inject = {
                    Type: "Random",
                    SourceType: "Range",
                    RangeInfo: {
                        Min: 0,
                        Max: 10000,
                        Step: 1
                    }
                };
                break;
            }
            case "Boolean": {
                g.Inject = {
                    Rate: 50
                };
                break;
            }
            case "Datetime": {
                g.Inject = {
                    MinDate: "2000-01-01",
                    MaxDate: "2999-12-31"
                };
                break;
            }
        }
        taskSettings.Generators.push(g);
        taskSettings.Fields = taskSettings.Fields.concat(
            x.Items.map<FieldSetting>(x => {
                return {
                    Name: x.Name,
                    Type: x.Type,
                    GeneratorName: gName
                };
            })
        );
    });

    console.log(JSON.stringify(taskSettings));
}
