import { dateString } from '../src/client/js/dateString';

describe('Testing dateString functionality', () => {
    test('Testing dateString() function', () => {
        expect(dateString).toBeDefined();
    });
    test('Testing dateString() with wrong input type', () => {
        const input = new Array(4).fill('value');
        // @ts-ignore
        expect(dateString(input)).toBe(input);
    });
    test('Testing dateString return value', () => {
        const today = new Date();
        const resultPattern = /\d{4}-[01]\d-[0-3]\d/;
        expect(dateString(today)).toMatch(resultPattern);
    });
});