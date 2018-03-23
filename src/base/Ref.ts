/**
 * 将转类型包装为引用类型的容器
 */
export class Ref<T> {
    private value: T;

    public get Value(): T {
        return this.value;
    }

    public set Value(val: T) {
        this.value = val;
    }
}
