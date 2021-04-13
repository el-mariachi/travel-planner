import { debounce } from "../src/client/js/debounce";

test('Testing debounce function', () => {
    const testFn = jest.fn();
    const debouncedFn = debounce(testFn, 300);
    debouncedFn();
    debouncedFn();
    setTimeout(() => {
        debouncedFn();
    }, 50);
    expect(testFn).toHaveBeenCalledTimes(0);
    setTimeout(() => {
        expect(testFn).toHaveBeenCalledTimes(1);
    }, 400);
});