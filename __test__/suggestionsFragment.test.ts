/**
 * @jest-environment jsdom
 */
import { suggestionsFragment } from '../src/client/js/suggestionsFragment';

describe("Tesing suggestionsFragment functionality", () => {
    test('Testing suggestionsFragment() function', () => {
        expect(suggestionsFragment).toBeDefined();
    });
    test('Testing suggestionsFragment with no input', () => {
        const emptyFrag = document.createDocumentFragment();
        expect(suggestionsFragment([])).toEqual(emptyFrag);
    });
    test('Testing suggestionsFragment return value', () => {
        const input = [{
            name: 'Denver',
            geonameId: 1235,
            adminName1: 'Colorado',
            countryName: 'USA'
        }];
        const actual = suggestionsFragment(input);
        const actualItem = actual.firstElementChild as HTMLElement;
        expect(actualItem.nodeName).toBe('LI');
        expect(actualItem.className).toBe('locations__item');
        expect(actualItem.dataset.name).toBe('Denver');
        expect(actualItem.dataset.geonameId).toBe('1235');
        expect(actualItem.dataset.countryName).toBe('USA');
        expect(actualItem.dataset.adminName1).toBe('Colorado');
    });
});