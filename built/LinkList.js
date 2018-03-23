"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LinkList = /** @class */ (function () {
    function LinkList() {
        this.count = 0;
    }
    LinkList.prototype.Add = function (item) {
        if (this.count == 0) {
            this.firstNode = {
                Value: item,
                Next: null
            };
            this.lastNode = this.firstNode;
            this.count = 1;
        }
        else {
            var node = {
                Value: item,
                Next: null
            };
            this.lastNode.Next = node;
            this.lastNode = node;
            this.count++;
        }
    };
    LinkList.prototype.First = function () {
        return this.FirstNode().Value;
    };
    LinkList.prototype.FirstNode = function () {
        return this.firstNode;
        ;
    };
    LinkList.prototype.IsLast = function (node) {
        return this.lastNode === node;
    };
    return LinkList;
}());
exports.LinkList = LinkList;
