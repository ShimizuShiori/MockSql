//EventObject

import { TypeHelper } from "./TypeHelper";
export interface EventHandler<TEventArgs> {
  (sender: object, e: TEventArgs): void;
}

export interface IEventObject {
  Bind<TEventArgs>(eventName: string, handler: EventHandler<TEventArgs>): void;
  Unbind<TEventArgs>(
    eventName: string,
    handler: EventHandler<TEventArgs>
  ): void;
  Trigger<TEventArgs>(eventName: string, e: TEventArgs): void;
  Once<TEventArgs>(eventName: string, e: TEventArgs): void;
}

export class EventObject {
  private map: any = {};
  private onceHistories: string[] = [];
  private onceArgs: any[] = [];

  private getListeners<TEventArgs>(
    eventName: string
  ): EventHandler<TEventArgs>[] {
    let listeners: EventHandler<TEventArgs>[] = [];
    listeners = this.map[eventName];
    if (TypeHelper.IsNullOrUndefined(listeners)) {
      listeners = [];
      this.map[eventName] = listeners;
    }
    return listeners;
  }

  public Bind<TEventArgs>(
    eventName: string,
    handler: EventHandler<TEventArgs>
  ): void {
    if (this.tryTriggerIfOnce(eventName, handler)) return;
    this.getListeners<TEventArgs>(eventName).push(handler);
  }

  public Unbind<TEventArgs>(
    eventName: string,
    handler: EventHandler<TEventArgs>
  ): void {
    let listeners = this.getListeners(eventName);
    let index = listeners.indexOf(handler);
    if (index == -1) return;
    listeners.splice(index, 1);
  }

  public Trigger<TEventArgs>(eventName: string, e: TEventArgs): void {
    this.getListeners<TEventArgs>(eventName).forEach(handler =>
      handler(this, e)
    );
  }

  public Once<TEventArgs>(eventName: string, e: TEventArgs): void {
    if (this.isTriggered(eventName)) return;
    this.Trigger(eventName, e);
    this.appendTriggeredEvent(eventName, e);
  }

  private isTriggered(eventName: string): boolean {
    return this.onceHistories.indexOf(eventName) !== -1;
  }

  private tryTriggerIfOnce<TEventArgs>(
    eventName: string,
    handler: EventHandler<TEventArgs>
  ): boolean {
    if (!this.isTriggered(eventName)) return false;
    handler(this, this.getTriggeredEventArgs(eventName));
  }

  private appendTriggeredEvent<TEventArgs>(eventName: string, e: TEventArgs) {
    this.onceHistories.push(eventName);
    this.onceArgs.push(e);
  }

  private getTriggeredEventArgs<TEventArgs>(eventName: string): TEventArgs {
    let index = this.onceHistories.indexOf(eventName);
    return this.onceArgs[index];
  }
}
