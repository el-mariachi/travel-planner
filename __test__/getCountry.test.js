import 'regenerator-runtime/runtime';
import { getCountry } from '../src/client/js/getCountry';

describe('Testing getCountry functionality', () => {
    test('getCountry should be defined', () => {
        expect(getCountry).toBeDefined();
    });
    test('getCountry should throw with no input', async () => {
        await expect(getCountry()).rejects.toThrow();
    });
    test('getCountry should return correct data', async () => {
        const country = await getCountry('China');
        const expected = {
            name: 'China',
            capital: 'Beijing'
        };
        expect(country).toMatchObject(expected);
    });
});