import { suggestionsHTML } from '../src/client/js/suggestionsHTML';

describe("Tesing suggestionsHTML functionality", () => {
    test('Testing suggestionsHTML() function', () => {
        expect(suggestionsHTML).toBeDefined();
    });
    test('Testing suggestionsHTML with no input', () => {
        expect(suggestionsHTML([])).toEqual('');
    });
    test('Testing suggestionsHTML return value', () => {
        const cityName = 'Denver';
        const input = [{
            name: cityName,
            geonameId: 1235,
            adminName1: 'Colorado'
        }];
        const matcher = /<li.+Denver.*<\/li>/;
        expect(suggestionsHTML(input)).toMatch(matcher);
    });
});