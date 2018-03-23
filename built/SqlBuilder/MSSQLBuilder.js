"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MSSQLBuilder {
    Build(tableName, fields, values) {
        let stringBuilder = [];
        stringBuilder.push(`truncate table [${tableName}]`);
        stringBuilder.push("\n");
        stringBuilder.push(`insert into ${tableName} (${this.getFieldCommand(fields)})`);
        stringBuilder.push("\n");
        let selectLines = values.map(singleRow => {
            let values = singleRow.map(v => `'${v}'`).join(",");
            return `select ${values}`;
        });
        stringBuilder.push(selectLines.join("\nunion all\n"));
        stringBuilder.push("\n");
        stringBuilder.push(`select * from [${tableName}]`);
        return stringBuilder.join("");
    }
    getFieldCommand(fields) {
        return fields.map(x => `[${x.Name}]`).join(",");
    }
}
exports.MSSQLBuilder = MSSQLBuilder;
