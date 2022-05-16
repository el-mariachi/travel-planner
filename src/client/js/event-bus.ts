// used to register and dispatch events between app components
interface IListener {
    [k: string]: Function[]
}
export interface EventBusFunc {
    (): EventBus;
}
export class EventBus {
    public listeners: IListener;
    constructor() {
        this.listeners = {};
    }

    on(event: string, callback: Function): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }

        this.listeners[event].push(callback);
    }

    off(event: string, callback: Function): void {
        if (!this.listeners[event]) {
            throw new Error(`${event} event is missing`);
        }

        this.listeners[event] = this.listeners[event].filter(
            listener => listener !== callback
        );
    }

    emit(event: string, ...args: any) {
        if (!this.listeners[event]) {
            throw new Error(`${event} event is missing`);
        }

        this.listeners[event].forEach(function (listener) {
            listener(...args);
        });
    }
}
