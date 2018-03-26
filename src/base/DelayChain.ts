import { TypeHelper } from "./TypeHelper";
import { LinkNode, LinkList } from "./LinkList";

const ERROR_FILTED: string = "Filted",
    ERROR_BREAK: string = "Break",
    ERROR_FULL: string = "Full",
    ERROR_CAN_NOT_NEXT: string = "CanNotNext";

enum HandlerType {
    Filter,
    Mapper,
    Split
}

interface HandlerInfo {
    Type: HandlerType;
    Handler: Function;
}

export interface GroupResult<TKey, TItem> {
    Key: TKey;
    Items: TItem[];
}

export class DelayChain<TSource> {
    private generator: IGenerator<TSource>;
    private handlers: LinkList<HandlerInfo> = new LinkList<HandlerInfo>();
    private takeCount: number = -1;
    private skipCount: number = -1;

    private constructor(generator: IGenerator<any>) {
        this.generator = generator;
    }

    static FromArray<TItem>(array: TItem[]): DelayChain<TItem> {
        return new DelayChain<TItem>(new ArrayGenerator(array));
    }

    static From<T>(source: IGenerator<T> | T[]): DelayChain<T> {
        if (TypeHelper.IsArray(source)) {
            return DelayChain.FromArray<T>(source);
        } else {
            return new DelayChain<T>(source);
        }
    }

    public As<TOther>(): DelayChain<TOther> {
        let rlt: DelayChain<TOther> = new DelayChain<TOther>(this.generator);
        rlt.handlers = this.handlers;
        rlt.takeCount = this.takeCount;
        rlt.skipCount = this.skipCount;
        return rlt;
    }

    public Select<TResult>(
        handler: (source: TSource) => TResult
    ): DelayChain<TResult> {
        let rlt: DelayChain<TResult> = this.As<TResult>();
        rlt.handlers.Add({
            Type: HandlerType.Mapper,
            Handler: handler
        });
        return rlt;
    }

    public Where(handler: (item: TSource) => boolean): DelayChain<TSource> {
        this.handlers.Add({
            Type: HandlerType.Filter,
            Handler: handler
        });
        return this;
    }

    public Split<TResult>(
        handler: (item: TSource) => TResult[]
    ): DelayChain<TResult> {
        let rlt = this.As<TResult>();
        rlt.handlers.Add({
            Type: HandlerType.Split,
            Handler: handler
        });
        return rlt;
    }

    public Take(count: number): DelayChain<TSource> {
        this.takeCount = count;
        return this;
    }

    public Skip(count: number): DelayChain<TSource> {
        this.skipCount = count;
        return this;
    }

    public ToArray(): TSource[] {
        let result = new DelayChainResult<TSource>(
            this.handlers,
            this.skipCount,
            this.takeCount
        );
        return result.ToArray(this.generator);
    }

    public Summary<T>(handler: (ctx: T, item: TSource) => void, ctx: T) {
        let result = new DelayChainResult<TSource>(
            this.handlers,
            this.skipCount,
            this.takeCount
        );
        result.OnSingleResultGenerated = x => {
            handler(ctx, x);
        };
        result.ToArray(this.generator);
        return ctx;
    }

    public First(): TSource {
        return this.Take(1).ToArray()[0];
    }

    public FirstOrDefault(def: TSource): TSource {
        let rlt = this.Take(1).ToArray();
        if (rlt.length > 0) return rlt[0];
        return def;
    }

    public GroupBy<TKey>(
        keyGetter: (item: TSource) => TKey
    ): DelayChain<GroupResult<TKey, TSource>> {
        let curResult = this.ToArray();
        let result: GroupResult<TKey, TSource>[] = [];
        curResult.forEach(item => {
            let key = keyGetter(item);
            let existsItem = result.filter(x => x.Key === key);
            if (existsItem.length > 0) {
                existsItem[0].Items.push(item);
            } else {
                result.push({
                    Key: key,
                    Items: [item]
                });
            }
        });
        return DelayChain.FromArray(result);
    }
}

export class DelayChainResult<TSource> {
    private array: TSource[] = [];
    private handlers: LinkList<HandlerInfo>;
    private skip: number;
    private take: number;

    public OnSingleResultGenerated: (rlt: TSource) => void;

    constructor(handlers: LinkList<HandlerInfo>, skip: number, take: number) {
        this.handlers = handlers;
        this.skip = skip;
        this.take = take;
    }

    private PushResult(item: TSource) {
        if (this.skip > 0) {
            this.skip--;
        }
        this.array.push(item);
        if (TypeHelper.IsFunction(this.OnSingleResultGenerated))
            this.OnSingleResultGenerated(item);
        if (this.array.length === this.take) throw ERROR_FULL;
    }

    public PutItem(item: any, handlerNode: LinkNode<HandlerInfo>) {
        if (TypeHelper.IsNullOrUndefined(handlerNode)) {
            this.array.push(item);
            return;
        }
        try {
            let temp: any = item;
            let curHandler = handlerNode;
            while (!TypeHelper.IsNullOrUndefined(curHandler)) {
                switch (curHandler.Value.Type) {
                    case HandlerType.Mapper:
                        temp = curHandler.Value.Handler(temp);
                        break;
                    case HandlerType.Filter:
                        if (curHandler.Value.Handler(temp) === false) {
                            throw ERROR_FILTED;
                        }
                        break;
                    case HandlerType.Split: {
                        let tempArray: any[] = curHandler.Value.Handler(temp);
                        if (this.handlers.IsLast(curHandler)) {
                            tempArray.forEach(x => {
                                this.PushResult(x);
                            });
                        } else {
                            tempArray.forEach(x => {
                                this.PutItem(x, curHandler.Next);
                            });
                        }
                        throw ERROR_FILTED;
                    }
                }
                curHandler = curHandler.Next;
            }
            this.PushResult(temp);
        } catch (e) {
            if (e !== ERROR_FILTED) throw e;
        }
    }

    public ToArray(generator: IGenerator<TSource>): TSource[] {
        if (this.take === 0) return this.array;
        try {
            while (true) {
                let x = generator.Next();
                this.PutItem(x, this.handlers.FirstNode());
            }
        } catch (e) {
            if (e !== ERROR_FULL && e !== ERROR_CAN_NOT_NEXT) throw e;
        }
        return this.array;
    }
}

export interface IGenerator<T> {
    Next(): T;
}

export class ArrayGenerator<T> implements IGenerator<T> {
    private array: T[];
    private index: number = 0;

    constructor(array: T[]) {
        this.array = array;
    }

    Next(): T {
        if (this.index < this.array.length) {
            return this.array[this.index++];
        }
        throw ERROR_CAN_NOT_NEXT;
    }
}

export class SequenceGenerator implements IGenerator<number> {
    private start: number;
    private step: number;
    private max: number;
    private curNumber: number;

    constructor(start: number, max: number, step: number = 1) {
        this.start = start;
        this.max = max;
        this.step = step;
        this.curNumber = this.start;
    }

    Next(): number {
        if (this.curNumber > this.max) throw ERROR_CAN_NOT_NEXT;
        let rlt = this.curNumber;
        this.curNumber += this.step;
        return rlt;
    }
}
