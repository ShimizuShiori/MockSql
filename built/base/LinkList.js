"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LinkList {
    constructor() {
        this.count = 0;
    }
    Add(item) {
        if (this.count == 0) {
            this.firstNode = {
                Value: item,
                Next: null
            };
            this.lastNode = this.firstNode;
            this.count = 1;
        }
        else {
            let node = {
                Value: item,
                Next: null
            };
            this.lastNode.Next = node;
            this.lastNode = node;
            this.count++;
        }
    }
    First() {
        return this.FirstNode().Value;
    }
    FirstNode() {
        return this.firstNode;
        ;
    }
    IsLast(node) {
        return this.lastNode === node;
    }
}
exports.LinkList = LinkList;
