import { EventBus } from "../src/client/js/event-bus";

describe('Testing EventBus', () => {
    const bus = new EventBus()
    const eventName = 'myEvent';
    const callbackFn = jest.fn();
    beforeEach(() => {
        callbackFn.mockClear();
    });
    test('should init the this.listeners to {}', () => {
        expect(bus.listeners).toEqual({});
    });
    test('should add an (array) entry to listeners', () => {
        bus.on(eventName, callbackFn);
        expect(Array.isArray(bus.listeners[eventName])).toBeTruthy();
    });
    test('should throw when asked to emit a nonexisitng event', () => {
        expect(() => {
            bus.emit('nonExisting')
        }).toThrow();
    });
    test('should call the function with args', () => {
        const callbackArgs = ['a', 1, { b: 3 }]
        bus.emit(eventName, callbackArgs);
        expect(callbackFn).toHaveBeenCalledTimes(1);
        expect(callbackFn).toHaveBeenCalledWith(callbackArgs);
    });
    test('should throw when asked to remove a nonexisting event', () => {
        expect(() => {
            bus.off('nonExisting');
        }).toThrow();
    });
    test('should not remove listeners if not passed as a second argument', () => {
        bus.off(eventName);
        bus.emit(eventName);
        expect(callbackFn).toHaveBeenCalledTimes(1);
    });
    test('should be able to remove listener', () => {
        bus.off(eventName, callbackFn);
        bus.emit(eventName);
        expect(callbackFn).toHaveBeenCalledTimes(0);
    });
});