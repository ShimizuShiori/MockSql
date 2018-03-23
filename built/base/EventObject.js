"use strict";
//EventObject
Object.defineProperty(exports, "__esModule", { value: true });
const TypeHelper_1 = require("./TypeHelper");
class EventObject {
    constructor() {
        this.map = {};
        this.onceHistories = [];
        this.onceArgs = [];
    }
    getListeners(eventName) {
        let listeners = [];
        listeners = this.map[eventName];
        if (TypeHelper_1.TypeHelper.IsNullOrUndefined(listeners)) {
            listeners = [];
            this.map[eventName] = listeners;
        }
        return listeners;
    }
    Bind(eventName, handler) {
        if (this.tryTriggerIfOnce(eventName, handler))
            return;
        this.getListeners(eventName).push(handler);
    }
    Unbind(eventName, handler) {
        let listeners = this.getListeners(eventName);
        let index = listeners.indexOf(handler);
        if (index == -1)
            return;
        listeners.splice(index, 1);
    }
    Trigger(eventName, e) {
        this.getListeners(eventName).forEach(handler => handler(this, e));
    }
    Once(eventName, e) {
        if (this.isTriggered(eventName))
            return;
        this.Trigger(eventName, e);
        this.appendTriggeredEvent(eventName, e);
    }
    isTriggered(eventName) {
        return this.onceHistories.indexOf(eventName) !== -1;
    }
    tryTriggerIfOnce(eventName, handler) {
        if (!this.isTriggered(eventName))
            return false;
        handler(this, this.getTriggeredEventArgs(eventName));
    }
    appendTriggeredEvent(eventName, e) {
        this.onceHistories.push(eventName);
        this.onceArgs.push(e);
    }
    getTriggeredEventArgs(eventName) {
        let index = this.onceHistories.indexOf(eventName);
        return this.onceArgs[index];
    }
}
exports.EventObject = EventObject;
