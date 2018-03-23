import { IValueGenerator } from "./Generators/IValueGenerator";
export interface FieldInfo {
    Name: string;
    Type: string;
    Generator: IValueGenerator;
}
