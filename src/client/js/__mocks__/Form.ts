// this mock is for testing the Form class

import { EventBus, EventBusFunc } from "../event-bus";

// also export mocked method
export const mockHide = jest.fn();
export const mockReset = jest.fn();

export class Form {
    protected eventBus: EventBusFunc;
    constructor() {
        const eventBus = new EventBus;
        this.eventBus = () => eventBus;
        eventBus.on('hide', mockHide);
        eventBus.on('reset', mockReset);
    }
}