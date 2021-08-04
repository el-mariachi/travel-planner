import { daysDiff } from '../daysDiff';

describe('Testing daysDiff functionality', () => {
    test('Testing daysDiff() function', () => {
        expect(daysDiff).toBeDefined();
    });
    test('daysDiff must return one day', () => {
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        expect(daysDiff(tomorrow, today)).toBe(1);
    });
});