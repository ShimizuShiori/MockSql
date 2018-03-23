"use strict";
//EventObject
Object.defineProperty(exports, "__esModule", { value: true });
var TypeHelper_1 = require("./TypeHelper");
var EventObject = /** @class */ (function () {
    function EventObject() {
        this.map = {};
        this.onceHistories = [];
        this.onceArgs = [];
    }
    EventObject.prototype.getListeners = function (eventName) {
        var listeners = [];
        listeners = this.map[eventName];
        if (TypeHelper_1.TypeHelper.IsNullOrUndefined(listeners)) {
            listeners = [];
            this.map[eventName] = listeners;
        }
        return listeners;
    };
    EventObject.prototype.Bind = function (eventName, handler) {
        if (this.tryTriggerIfOnce(eventName, handler))
            return;
        this.getListeners(eventName).push(handler);
    };
    EventObject.prototype.Unbind = function (eventName, handler) {
        var listeners = this.getListeners(eventName);
        var index = listeners.indexOf(handler);
        if (index == -1)
            return;
        listeners.splice(index, 1);
    };
    EventObject.prototype.Trigger = function (eventName, e) {
        var _this = this;
        this.getListeners(eventName).forEach(function (handler) {
            return handler(_this, e);
        });
    };
    EventObject.prototype.Once = function (eventName, e) {
        if (this.isTriggered(eventName))
            return;
        this.Trigger(eventName, e);
        this.appendTriggeredEvent(eventName, e);
    };
    EventObject.prototype.isTriggered = function (eventName) {
        return this.onceHistories.indexOf(eventName) !== -1;
    };
    EventObject.prototype.tryTriggerIfOnce = function (eventName, handler) {
        if (!this.isTriggered(eventName))
            return false;
        handler(this, this.getTriggeredEventArgs(eventName));
    };
    EventObject.prototype.appendTriggeredEvent = function (eventName, e) {
        this.onceHistories.push(eventName);
        this.onceArgs.push(e);
    };
    EventObject.prototype.getTriggeredEventArgs = function (eventName) {
        var index = this.onceHistories.indexOf(eventName);
        return this.onceArgs[index];
    };
    return EventObject;
}());
exports.EventObject = EventObject;
