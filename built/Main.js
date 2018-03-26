"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ValueGeneratorFactory_1 = require("./Generators/ValueGeneratorFactory");
const StringValueGenerator_1 = require("./Generators/StringValueGenerator");
const SqlBuilderFactory_1 = require("./SqlBuilder/SqlBuilderFactory");
const MSSQLBuilder_1 = require("./SqlBuilder/MSSQLBuilder");
const IntValueGenerator_1 = require("./Generators/IntValueGenerator");
const BooleanGenerator_1 = require("./Generators/BooleanGenerator");
const DatetimeValueGenerator_1 = require("./Generators/DatetimeValueGenerator");
const fs = require("fs");
ValueGeneratorFactory_1.ValueGeneratorFactory.RegistGenerator("String", key => new StringValueGenerator_1.StringValueGenerator());
ValueGeneratorFactory_1.ValueGeneratorFactory.RegistGenerator("Int", key => new IntValueGenerator_1.IntValueGenerator());
ValueGeneratorFactory_1.ValueGeneratorFactory.RegistGenerator("Boolean", key => new BooleanGenerator_1.BooleanValueGenerator());
ValueGeneratorFactory_1.ValueGeneratorFactory.RegistGenerator("Datetime", key => new DatetimeValueGenerator_1.DatetimeValueGenerator());
SqlBuilderFactory_1.SqlBuilderFactory.ResigtSqlBuilder("MSSQL", key => new MSSQLBuilder_1.MSSQLBuilder());
function default_1(taskPath) {
    let json = fs.readFileSync(taskPath, "utf8");
    let taskSettings = JSON.parse(json);
    let sqlBuilder = SqlBuilderFactory_1.SqlBuilderFactory.GetSqlBuilder(taskSettings.DbType);
    let fields = taskSettings.Fields.map(x => {
        let generatorSetting = taskSettings.Generators.filter(y => y.Name === x.GeneratorName)[0];
        return {
            Name: x.Name,
            Type: x.Type,
            Generator: ValueGeneratorFactory_1.ValueGeneratorFactory.GetGenerator(generatorSetting.Type, generatorSetting.Inject)
        };
    });
    let values = [];
    for (let i = 0; i < taskSettings.RowCount; i++) {
        let singleRowValues = [];
        singleRowValues = fields.map(x => x.Generator.Generate());
        values.push(singleRowValues);
    }
    console.log(sqlBuilder.Build(taskSettings.TableName, fields, values));
}
exports.default = default_1;
