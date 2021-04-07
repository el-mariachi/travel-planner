import { postToBackend } from "../src/client/js/postToBackend";
import { getLocations } from "../src/client/js/getLocations";

jest.mock('../src/client/js/postToBackend');
const mockAlert = jest.fn();
const mockConsole = jest.fn();
beforeAll(() => {
    global.alert = mockAlert;
    global.console = {
        error: mockConsole
    };
});
const maxRows = 10;
const cityName = 'London';
const sampleData = Array(maxRows).fill({ name: cityName });

postToBackend.mockImplementation((endpoint, request) => {
    const { query, maxRows } = request;
    if (!query) {
        return Promise.reject('error')
    }
    return Promise.resolve(Array(maxRows).fill({ name: query }));
});

describe('Testing getImage functionality', () => {
    it('should return an array not larger than needed', () => {
        return getLocations(cityName, maxRows).then(data => {
            expect(data).toEqual(sampleData);
        });
    });
    it('should throw with no input', () => {
        return expect(getLocations()).rejects.toMatch('error');
    });
});