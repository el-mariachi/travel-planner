
/**
 * @jest-environment jsdom
 */
import { getCountry } from '../src/client/js/getCountry';
const realFetch = window.fetch;
const fakeFetch = jest.fn();
fakeFetch.mockImplementation(request => {
    const queryParts = request.split('/');
    const query = queryParts[queryParts.length - 1];
    if (!query || query === '' || query === 'undefined') {
        return Promise.resolve({
            json: () => ({ status: 400 })
        });
    } else if (query === 'cn' || query === 'CN') {
        return Promise.resolve({
            json: () => ({
                name: 'China',
                capital: 'Beijing',
                currencies: [
                    {
                        name: "Chinese yuan",
                    }
                ],
                languages: [
                    {
                        name: "Chinese",
                    }
                ]
            })
        });
    }
});
beforeAll(() => {
    window.fetch = fakeFetch;
});

afterAll(() => {
    window.fetch = realFetch;
});

describe('Testing getCountry functionality', () => {
    test('getCountry should be defined', () => {
        expect(getCountry).toBeDefined();
    });
    test('getCountry should throw with no input', async () => {
        // @ts-ignore
        await expect(getCountry()).rejects.toThrow();
    });
    test('getCountry should return correct data', async () => {
        const country = await getCountry('CN');
        const expected = {
            name: 'China',
            capital: 'Beijing',
            currencies: [{ name: expect.any(String) }],
            languages: [{ name: expect.any(String) }],
        };
        expect(country).toMatchObject(expected);
    });
});