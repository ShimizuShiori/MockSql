"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DelayChain_1 = require("./base/DelayChain");
const fs = require("fs");
const os = require("os");
let report = fs.readFileSync("MSSQLTableSchemaReport.txt", "utf8");
let dc = DelayChain_1.DelayChain.FromArray([report])
    .Split(x => x.split(os.EOL))
    .Select(x => x.split("\t"))
    .Select(x => {
    return {
        Name: x[0],
        Type: x[1],
        Computed: x[2] !== "no",
        Length: parseInt(x[3]),
        IsId: x[0].toLowerCase() === "id",
        GeneratorType: ""
    };
})
    .Select(x => {
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
let taskSettings = {
    Generators: [],
    Fields: [],
    TableName: "",
    DbType: "MSSQL",
    RowCount: 100
};
function handlerString(x) {
    DelayChain_1.DelayChain.FromArray(x.Items)
        .GroupBy(x => x.Length)
        .Select(x => {
        let rlt = {};
        let gName = `String_1_${x.Key}`;
        let ThisGenerator = {
            Name: gName,
            Type: "String",
            Inject: {
                MinLength: 1,
                MaxLength: x.Key,
                Type: "Random"
            }
        };
        let fields = DelayChain_1.DelayChain.FromArray(x.Items)
            .Select(x => {
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
    let g = {
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
    taskSettings.Fields = taskSettings.Fields.concat(x.Items.map(x => {
        return {
            Name: x.Name,
            Type: x.Type,
            GeneratorName: gName
        };
    }));
});
console.log(JSON.stringify(taskSettings));
