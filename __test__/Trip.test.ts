/**
 * @jest-environment jsdom
 */
// import 'regenerator-runtime/runtime';

import { ClientLib } from "./ClientLib";
import { Trip } from "../src/client/js/Trip";
// @ts-ignore
import { Storage, mockSave, mockDelete } from "../src/client/js/Storage";
// @ts-ignore
import { Form, mockHide, mockReset } from "../src/client/js/Form";
// import { Primitive } from "../src/client/js/Primitive";
import { CountryInfo } from '../src/client/js/CountryInfo';
import { TripHead } from '../src/client/js/TripHead';
import { WeatherReport } from '../src/client/js/WeatherReport';
import { dateString } from "../src/client/js/dateString";

import { getCountry } from '../src/client/js/getCountry';
import { getWeather } from '../src/client/js/getWeather';
import { getImage } from '../src/client/js/getImage';
// import { Button } from '../src/client/js/Button';
// import { EventBus } from "../src/client/js/event-bus";

// jest.mock('../src/client/js/Primitive');
const mockCountryInfo = jest.fn((props) => { });
jest.mock('../src/client/js/CountryInfo', () => {
    return {
        CountryInfo: jest.fn(() => {
            return {
                setProps: mockCountryInfo
            }
        })
    }
});
jest.mock('../src/client/js/TripHead');
const mockWeatherReport = jest.fn((props) => { });
jest.mock('../src/client/js/WeatherReport', () => {
    return {
        WeatherReport: jest.fn(() => {
            return {
                setProps: mockWeatherReport
            }
        })
    }
});
jest.mock('../src/client/js/Form');
jest.mock('../src/client/js/Storage');

jest.mock('../src/client/js/getCountry');
jest.mock('../src/client/js/getWeather');
jest.mock('../src/client/js/getImage');

const mockClient: ClientLib = jest.fn();
mockClient.form = new Form(document.createElement('form'));
mockClient.appStore = new Storage(document.createElement('div'), {key: 'key'});

beforeAll(() => {
    global.Client = mockClient;
});

beforeEach(() => {
    // Primitive.mockClear();
    // WeatherReport.mockClear();
    // mockWeatherReport.mockClear();
    (getWeather as unknown as jest.Mock).mockClear();
});

const formData = {
    lat: 32.23,
    lng: 23.32,
    from: dateString(new Date()),
    to: dateString(new Date()),
    name: 'Beijing',
    adminName1: 'Beijing',
    countryName: 'China',
    locationFullName: 'Beijing, Beijing, China',
    countryCode: 'CN',
    submitNo: 1,
    saved: false
};

describe('Testing Tip functionality', () => {
    // setup dom nodes
    const div = document.createElement('div');
    div.className = 'trip';
    const countryEl = document.createElement('div');
    countryEl.className = 'trip--meta-country';
    div.appendChild(countryEl);
    const headEl = document.createElement('div');
    headEl.className = 'trip__head';
    div.appendChild(headEl);
    const mode = document.createElement('h2');
    mode.id = 'mode';
    div.appendChild(mode);
    const weatherEl = document.createElement('div');
    weatherEl.id = 'weather';
    div.appendChild(weatherEl);
    const closeBtn = document.createElement('button');
    closeBtn.className = 'trip--control-close';
    div.appendChild(closeBtn);
    const saveBtn = document.createElement('button');
    saveBtn.className = 'trip--control-save';
    div.appendChild(saveBtn);
    const removeBtn = document.createElement('button');
    removeBtn.className = 'trip--control-remove';
    div.appendChild(removeBtn);
    const units = document.createElement('div');
    units.className = 'units';
    div.appendChild(units);
    const trip_image = document.createElement('div');
    trip_image.className = 'trip__image';
    div.appendChild(trip_image);

    const spyRender = jest.spyOn(Trip.prototype, 'render');
    // create new Trip instance
    const trip = new Trip(div);
    test('should not render initially', () => {
        expect(spyRender).toHaveBeenCalledTimes(0);
        spyRender.mockRestore();
    });
    it('should call the forecast route', () => {
        trip.eventBus().emit('flow:new-data', formData);
        const { name, countryName, lat, lng, from, submitNo } = formData;
        expect(getWeather).toHaveBeenCalledTimes(1);
        expect(getWeather).toHaveBeenCalledWith('/api/forecast', { lat, lng, from, submitNo });
        expect(getImage).toHaveBeenCalledWith(name, countryName, submitNo);
        expect(mode.textContent).toBe('Weather forecast');
    });
    it('should call WeatherReport', () => {
        expect(WeatherReport).toHaveBeenCalledTimes(1);
        expect(mockWeatherReport).toHaveBeenCalledTimes(1);
    });
    it('should call the historical route', () => {
        formData.from = formData.to = '2007-11-11';
        trip.eventBus().emit('flow:new-data', formData);
        const { lat, lng, from, submitNo } = formData;
        expect(getWeather).toHaveBeenCalledTimes(1);
        expect(getWeather).toHaveBeenCalledWith('/api/historical', { lat, lng, from, submitNo });
        expect(mode.textContent).toBe('Recorded weather');
    });
    it('should call the average historical route', () => {
        formData.from = formData.to = dateString(new Date().setDate(new Date().getDate() + 20));
        trip.eventBus().emit('flow:new-data', formData);
        const { lat, lng, from, submitNo } = formData;
        expect(getWeather).toHaveBeenCalledTimes(1);
        expect(getWeather).toHaveBeenCalledWith('/api/historical/average', { lat, lng, from, submitNo });
        expect(mode.textContent).toBe('Usual weather');
    });
    it('should display error if getWeather fails', (done) => {
        mockWeatherReport.mockClear();
        (getWeather as unknown as jest.Mock).mockImplementation(() => {
            return Promise.reject({ message: 'Weather error' });
        });
        trip.eventBus().emit('flow:new-data', formData);
        setTimeout(() => {
            expect(mockWeatherReport).toHaveBeenCalledWith({ error: 'Weather error' });
            done();
        }, 100);
    });
    it('should display error if getCountry fails', (done) => {
        mockCountryInfo.mockClear();
        (getCountry as unknown as jest.Mock).mockImplementation(() => {
            return Promise.reject();
        });
        trip.eventBus().emit('flow:new-data', formData);
        setTimeout(() => {
            expect(mockCountryInfo).toHaveBeenCalledWith({ error: 'Country info unavailable' });
            done();
        }, 100);
    });
    it('should populate country info', (done) => {
        mockCountryInfo.mockClear();
        trip.eventBus().emit('flow:new-data', Object.assign(formData, { countryInfo: 'country info' }));
        setTimeout(() => {
            expect(mockCountryInfo).toHaveBeenCalledWith('country info');
            done();
        }, 100);
    });
    it('should save', () => {
        const click = new Event('click');
        saveBtn.dispatchEvent(click);
        expect(div.classList.contains('trip--saved')).toBeTruthy();
        expect(mockSave).toHaveBeenCalledTimes(1);
    });
    it('should delete', () => {
        const click = new Event('click');
        removeBtn.dispatchEvent(click);
        expect(div.classList.contains('trip--saved')).toBeFalsy();
        expect(mockDelete).toHaveBeenCalledTimes(1);
    });
});