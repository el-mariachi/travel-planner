// this mock is for testing the Form class

import { EventBus, EventBusFunc } from "../event-bus";

// also export mocked method
export const mockDataReceived = jest.fn();
export const mockSetIndex = jest.fn();

export class Trip {
    protected eventBus: EventBusFunc;
    constructor() {
        const eventBus = new EventBus;
        this.eventBus = () => eventBus;
        eventBus.on('flow:new-data', mockDataReceived);
        eventBus.on('index', mockSetIndex);
    }
}