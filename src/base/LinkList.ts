export interface LinkNode<T> {

    Value: T;
    Next: LinkNode<T>;
}

export class LinkList<T>{

    private firstNode: LinkNode<T>;
    private lastNode: LinkNode<T>;
    private count: number = 0;

    public Add(item: T) {
        if (this.count == 0) {
            this.firstNode = {
                Value: item,
                Next: null
            };
            this.lastNode = this.firstNode;
            this.count = 1;
        }
        else {
            let node: LinkNode<T> = {
                Value: item,
                Next: null
            };
            this.lastNode.Next = node;
            this.lastNode = node;
            this.count++;
        }
    }

    public First(): T {
        return this.FirstNode().Value;
    }

    public FirstNode(): LinkNode<T> {
        return this.firstNode;;
    }

    public IsLast(node: LinkNode<T>): boolean {
        return this.lastNode === node;
    }
}