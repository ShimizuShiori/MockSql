"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TypeHelper_1 = require("./TypeHelper");
const LinkList_1 = require("./LinkList");
const ERROR_FILTED = "Filted", ERROR_BREAK = "Break", ERROR_FULL = "Full", ERROR_CAN_NOT_NEXT = "CanNotNext";
var HandlerType;
(function (HandlerType) {
    HandlerType[HandlerType["Filter"] = 0] = "Filter";
    HandlerType[HandlerType["Mapper"] = 1] = "Mapper";
    HandlerType[HandlerType["Split"] = 2] = "Split";
})(HandlerType || (HandlerType = {}));
class DelayChain {
    constructor(generator) {
        this.handlers = new LinkList_1.LinkList();
        this.takeCount = -1;
        this.skipCount = -1;
        this.generator = generator;
    }
    static FromArray(array) {
        return new DelayChain(new ArrayGenerator(array));
    }
    static From(source) {
        if (TypeHelper_1.TypeHelper.IsArray(source)) {
            return DelayChain.FromArray(source);
        }
        else {
            return new DelayChain(source);
        }
    }
    As() {
        let rlt = new DelayChain(this.generator);
        rlt.handlers = this.handlers;
        rlt.takeCount = this.takeCount;
        rlt.skipCount = this.skipCount;
        return rlt;
    }
    Select(handler) {
        let rlt = this.As();
        rlt.handlers.Add({
            Type: HandlerType.Mapper,
            Handler: handler
        });
        return rlt;
    }
    Where(handler) {
        this.handlers.Add({
            Type: HandlerType.Filter,
            Handler: handler
        });
        return this;
    }
    Split(handler) {
        let rlt = this.As();
        rlt.handlers.Add({
            Type: HandlerType.Split,
            Handler: handler
        });
        return rlt;
    }
    Take(count) {
        this.takeCount = count;
        return this;
    }
    Skip(count) {
        this.skipCount = count;
        return this;
    }
    ToArray() {
        let result = new DelayChainResult(this.handlers, this.skipCount, this.takeCount);
        return result.ToArray(this.generator);
    }
    Summary(handler, ctx) {
        let result = new DelayChainResult(this.handlers, this.skipCount, this.takeCount);
        result.OnSingleResultGenerated = x => {
            handler(ctx, x);
        };
        result.ToArray(this.generator);
        return ctx;
    }
    First() {
        return this.Take(1).ToArray()[0];
    }
    FirstOrDefault(def) {
        let rlt = this.Take(1).ToArray();
        if (rlt.length > 0)
            return rlt[0];
        return def;
    }
    GroupBy(keyGetter) {
        let curResult = this.ToArray();
        let result = [];
        curResult.forEach(item => {
            let key = keyGetter(item);
            let existsItem = result.filter(x => x.Key === key);
            if (existsItem.length > 0) {
                existsItem[0].Items.push(item);
            }
            else {
                result.push({
                    Key: key,
                    Items: [item]
                });
            }
        });
        return DelayChain.FromArray(result);
    }
}
exports.DelayChain = DelayChain;
class DelayChainResult {
    constructor(handlers, skip, take) {
        this.array = [];
        this.handlers = handlers;
        this.skip = skip;
        this.take = take;
    }
    PushResult(item) {
        if (this.skip > 0) {
            this.skip--;
        }
        this.array.push(item);
        if (TypeHelper_1.TypeHelper.IsFunction(this.OnSingleResultGenerated))
            this.OnSingleResultGenerated(item);
        if (this.array.length === this.take)
            throw ERROR_FULL;
    }
    PutItem(item, handlerNode) {
        if (TypeHelper_1.TypeHelper.IsNullOrUndefined(handlerNode)) {
            this.array.push(item);
            return;
        }
        try {
            let temp = item;
            let curHandler = handlerNode;
            while (!TypeHelper_1.TypeHelper.IsNullOrUndefined(curHandler)) {
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
                        let tempArray = curHandler.Value.Handler(temp);
                        if (this.handlers.IsLast(curHandler)) {
                            tempArray.forEach(x => {
                                this.PushResult(x);
                            });
                        }
                        else {
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
        }
        catch (e) {
            if (e !== ERROR_FILTED)
                throw e;
        }
    }
    ToArray(generator) {
        if (this.take === 0)
            return this.array;
        try {
            while (true) {
                let x = generator.Next();
                this.PutItem(x, this.handlers.FirstNode());
            }
        }
        catch (e) {
            if (e !== ERROR_FULL && e !== ERROR_CAN_NOT_NEXT)
                throw e;
        }
        return this.array;
    }
}
exports.DelayChainResult = DelayChainResult;
class ArrayGenerator {
    constructor(array) {
        this.index = 0;
        this.array = array;
    }
    Next() {
        if (this.index < this.array.length) {
            return this.array[this.index++];
        }
        throw ERROR_CAN_NOT_NEXT;
    }
}
exports.ArrayGenerator = ArrayGenerator;
class SequenceGenerator {
    constructor(start, max, step = 1) {
        this.start = start;
        this.max = max;
        this.step = step;
        this.curNumber = this.start;
    }
    Next() {
        if (this.curNumber > this.max)
            throw ERROR_CAN_NOT_NEXT;
        let rlt = this.curNumber;
        this.curNumber += this.step;
        return rlt;
    }
}
exports.SequenceGenerator = SequenceGenerator;
