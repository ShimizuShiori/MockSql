import { FieldInfo } from "../FieldInfo";
export interface ISqlBuilder {

    Build(tableName: string, fields: FieldInfo[], values: string[][]): string;
    
}
