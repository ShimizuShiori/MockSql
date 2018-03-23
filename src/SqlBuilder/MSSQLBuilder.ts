import { ISqlBuilder } from "./ISqlBuilder";
import { FieldInfo } from "../FieldInfo";

export class MSSQLBuilder implements ISqlBuilder {
    Build(tableName: string, fields: FieldInfo[], values: string[][]): string {
        let stringBuilder: string[] = [];
        stringBuilder.push(`truncate table [${tableName}]`);
        stringBuilder.push("\n");
        stringBuilder.push(
            `insert into ${tableName} (${this.getFieldCommand(fields)})`
        );
        stringBuilder.push("\n");
        let selectLines: string[] = values.map(singleRow => {
            let values = singleRow.map(v => `'${v}'`).join(",");
            return `select ${values}`;
        });
        stringBuilder.push(selectLines.join("\nunion all\n"));
        stringBuilder.push("\n");
        stringBuilder.push(`select * from [${tableName}]`);
        return stringBuilder.join("");
    }

    private getFieldCommand(fields: FieldInfo[]): string {
        return fields.map(x => `[${x.Name}]`).join(",");
    }
}
