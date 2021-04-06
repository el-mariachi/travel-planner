/**
 * @jest-environment jsdom
 */
import { CountryInfo } from '../src/client/js/CountryInfo';

test('Testing CountryInfo props change', () => {
    const spy = jest.spyOn(CountryInfo.prototype, 'componentDidUpdate');
    spy.mockImplementation(() => false);
    const div = document.createElement('div');
    const info = new CountryInfo(div, { error: 'error' });
    info.setProps({ languages: ['English'] })
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
});