/**
 * @jest-environment jsdom
 */
import { CountryInfo } from '../src/client/js/CountryInfo';
import Mustache from "mustache";
import { countryInfoTemplate } from '../src/client/views/countryInfo.tmpl';
import { countryErrorTemplate } from '../src/client/views/countryError.tmpl';

describe('Testing CountryInfo functionality', () => {
    test('Testing CountryInfo receiving error', () => {
        const renderSpy = jest.spyOn(Mustache, 'render');
        const spy = jest.spyOn(CountryInfo.prototype, 'componentDidUpdate');
        spy.mockImplementation(() => false);
        const div = document.createElement('div');
        const errorArg = { error: 'error' };
        const info = new CountryInfo(div, errorArg);
        info.setProps({ languages: ['English'] })
        expect(spy).toHaveBeenCalled();
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect(renderSpy).toHaveBeenCalledWith(countryErrorTemplate, errorArg);
        spy.mockRestore();
        renderSpy.mockRestore();
    });
    test('Test CountryInfo to receive data', () => {
        const renderSpy = jest.spyOn(Mustache, 'render');
        const div = document.createElement('div');
        const countryData = {
            name: 'Botswana',
            capital: 'Gaborone',
            currencies: ['Botswana pula'],
            languages: ['English', 'Tswana'],
            flag: 'image url'
        };
        const info = new CountryInfo(div, countryData);
        expect(Mustache.render).toHaveBeenCalledWith(countryInfoTemplate, {
            name: expect.any(String),
            capital: expect.any(String),
            allCurrencies: expect.any(String),
            allLanguages: expect.any(String),
            currTitle: expect.any(String),
            langTitle: expect.any(String)
        });
        expect(info.el.querySelector('.trip__header').getAttribute('style')).toEqual(`background-image: url(${countryData.flag})`);
        renderSpy.mockRestore();
    });
});
