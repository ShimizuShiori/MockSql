//TypeHelper.ts

export class TypeHelper {
    static IsNull(value: any): boolean {
        return value === null;
    }

    static IsUndefined(value: any): boolean {
        return TypeHelper.GetType(value) === "undefined";
    }

    static IsNullOrUndefined(value: any): boolean {
        return TypeHelper.IsNull(value) || TypeHelper.IsUndefined(value);
    }

    static IsString(value: any): value is string {
        return TypeHelper.GetType(value) === "string";
    }

    static IsNumber(value: any): value is number {
        return TypeHelper.GetType(value) === "number";
    }

    static IsBoolean(value: any): value is boolean {
        return TypeHelper.GetType(value) === "boolean";
    }

    static IsObject(value: any): value is object {
        return TypeHelper.GetType(value) === "object";
    }

    static IsFunction(value: any): value is Function {
        return TypeHelper.GetType(value) === "function";
    }

    static IsArray(value: any): value is any[] {
        return Array.isArray(value);
    }

    static IsDate(value: any): value is Date {
        return TypeHelper.IsClass(value, Date);
    }

    static IsClass<T>(value: any, cls: T): value is T {
        return value instanceof (cls as any);
    }

    static GetType(value: any): string {
        return typeof value;
    }
}
