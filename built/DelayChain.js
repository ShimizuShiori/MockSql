"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TypeHelper_1 = require("./TypeHelper");
var LinkList_1 = require("./LinkList");
var ERROR_FILTED = "Filted", ERROR_BREAK = "Break", ERROR_FULL = "Full", ERROR_CAN_NOT_NEXT = "CanNotNext";
var HandlerType;
(function (HandlerType) {
    HandlerType[HandlerType["Filter"] = 0] = "Filter";
    HandlerType[HandlerType["Mapper"] = 1] = "Mapper";
    HandlerType[HandlerType["Split"] = 2] = "Split";
})(HandlerType || (HandlerType = {}));
var DelayChain = /** @class */ (function () {
    function DelayChain(generator) {
        this.handlers = new LinkList_1.LinkList();
        this.takeCount = -1;
        this.skipCount = -1;
        this.generator = generator;
    }
    DelayChain.FromArray = function (array) {
        return new DelayChain(new ArrayGenerator(array));
    };
    DelayChain.From = function (generator) {
        return new DelayChain(generator);
    };
    DelayChain.prototype.As = function () {
        var rlt = new DelayChain(this.generator);
        rlt.handlers = this.handlers;
        rlt.takeCount = this.takeCount;
        rlt.skipCount = this.skipCount;
        return rlt;
    };
    DelayChain.prototype.Select = function (handler) {
        var rlt = this.As();
        rlt.handlers.Add({
            Type: HandlerType.Mapper,
            Handler: handler
        });
        return rlt;
    };
    DelayChain.prototype.Where = function (handler) {
        this.handlers.Add({
            Type: HandlerType.Filter,
            Handler: handler
        });
        return this;
    };
    DelayChain.prototype.Split = function (handler) {
        var rlt = this.As();
        rlt.handlers.Add({
            Type: HandlerType.Split,
            Handler: handler
        });
        return rlt;
    };
    DelayChain.prototype.Take = function (count) {
        this.takeCount = count;
        return this;
    };
    DelayChain.prototype.Skip = function (count) {
        this.skipCount = count;
        return this;
    };
    DelayChain.prototype.ToArray = function () {
        var result = new DelayChainResult(this.handlers, this.skipCount, this.takeCount);
        return result.ToArray(this.generator);
    };
    DelayChain.prototype.First = function () {
        return this.Take(1).ToArray()[0];
    };
    DelayChain.prototype.FirstOrDefault = function (def) {
        var rlt = this.Take(1).ToArray();
        if (rlt.length > 0)
            return rlt[0];
        return def;
    };
    DelayChain.prototype.GroupBy = function (keyGetter) {
        var curResult = this.ToArray();
        var result = [];
        curResult.forEach(function (item) {
            var key = keyGetter(item);
            var existsItem = result.filter(function (x) { return x.Key === key; });
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
    };
    return DelayChain;
}());
exports.DelayChain = DelayChain;
var DelayChainResult = /** @class */ (function () {
    function DelayChainResult(handlers, skip, take) {
        this.array = [];
        this.handlers = handlers;
        this.skip = skip;
        this.take = take;
    }
    DelayChainResult.prototype.PushResult = function (item) {
        if (this.skip > 0) {
            this.skip--;
        }
        this.array.push(item);
        if (this.array.length === this.take)
            throw ERROR_FULL;
    };
    DelayChainResult.prototype.PutItem = function (item, handlerNode) {
        var _this = this;
        if (TypeHelper_1.TypeHelper.IsNullOrUndefined(handlerNode))
            return;
        try {
            var temp = item;
            var curHandler_1 = handlerNode;
            while (!TypeHelper_1.TypeHelper.IsNullOrUndefined(curHandler_1)) {
                switch (curHandler_1.Value.Type) {
                    case HandlerType.Mapper:
                        temp = curHandler_1.Value.Handler(temp);
                        break;
                    case HandlerType.Filter:
                        if (curHandler_1.Value.Handler(temp) === false) {
                            throw ERROR_FILTED;
                        }
                        break;
                    case HandlerType.Split:
                        {
                            var tempArray = curHandler_1.Value.Handler(temp);
                            if (this.handlers.IsLast(curHandler_1)) {
                                tempArray.forEach(function (x) {
                                    _this.PushResult(x);
                                });
                            }
                            else {
                                tempArray.forEach(function (x) {
                                    _this.PutItem(x, curHandler_1.Next);
                                });
                            }
                            throw ERROR_FILTED;
                        }
                }
                curHandler_1 = curHandler_1.Next;
            }
            this.PushResult(temp);
        }
        catch (e) {
            if (e !== ERROR_FILTED)
                throw e;
        }
    };
    DelayChainResult.prototype.ToArray = function (generator) {
        if (this.take === 0)
            return this.array;
        try {
            while (true) {
                var x = generator.Next();
                this.PutItem(x, this.handlers.FirstNode());
            }
        }
        catch (e) {
            if (e !== ERROR_FULL
                && e !== ERROR_CAN_NOT_NEXT)
                throw e;
        }
        return this.array;
    };
    return DelayChainResult;
}());
exports.DelayChainResult = DelayChainResult;
var ArrayGenerator = /** @class */ (function () {
    function ArrayGenerator(array) {
        this.index = 0;
        this.array = array;
    }
    ArrayGenerator.prototype.Next = function () {
        if (this.index < this.array.length) {
            return this.array[this.index++];
        }
        throw ERROR_CAN_NOT_NEXT;
    };
    return ArrayGenerator;
}());
exports.ArrayGenerator = ArrayGenerator;
var SequenceGenerator = /** @class */ (function () {
    function SequenceGenerator(start, max, step) {
        if (step === void 0) { step = 1; }
        this.start = start;
        this.max = max;
        this.step = step;
        this.curNumber = this.start;
    }
    SequenceGenerator.prototype.Next = function () {
        if (this.curNumber > this.max)
            throw ERROR_CAN_NOT_NEXT;
        var rlt = this.curNumber;
        this.curNumber += this.step;
        return rlt;
    };
    return SequenceGenerator;
}());
exports.SequenceGenerator = SequenceGenerator;
