// this mock is for testing the Form class

import { EventBus, EventBusFunc } from "../event-bus";

export const mockSave = jest.fn();
export const mockDelete = jest.fn();

export class Storage {
    protected eventBus: EventBusFunc;
    constructor() {
        const eventBus = new EventBus;
        this.eventBus = () => eventBus;
        eventBus.on('flow:new-data', mockSave);
        eventBus.on('delete', mockDelete);
    }
}