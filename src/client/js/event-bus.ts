// used to register and dispatch events between app components
export class EventBus {
    public listeners;
    constructor() {
        this.listeners = {};
    }

    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }

        this.listeners[event].push(callback);
    }

    off(event, callback) {
        if (!this.listeners[event]) {
            throw new Error(`${event} event is missing`);
        }

        this.listeners[event] = this.listeners[event].filter(
            listener => listener !== callback
        );
    }

    emit(event, ...args) {
        if (!this.listeners[event]) {
            throw new Error(`${event} event is missing`);
        }

        this.listeners[event].forEach(function (listener) {
            listener(...args);
        });
    }
}
