/**
 * @jest-environment jsdom
 */
import { ClientLib } from "./ClientLib";
import { Trip } from "../Trip";
import { Storage } from "../Storage";
import { Form, IMyFormElement } from "../Form";
import { CountryInfo } from '../CountryInfo';
import { TripHead } from '../TripHead';
import { WeatherReport } from '../WeatherReportVC';
import { dateString } from "../dateString";

import { getCountry } from '../getCountry';
import { getWeather } from '../getWeather';
import { getImage } from '../getImage';

const waitForExpect = require("wait-for-expect");


declare global {
    namespace NodeJS {
        interface Global {
            Client: ClientLib;
        }
    }
}
const mockCountryInfo = jest.fn();
jest.mock('../CountryInfo', () => {
    return {
        CountryInfo: jest.fn(() => {
            return {
                setProps: mockCountryInfo
            }
        })
    }
});
jest.mock('../TripHead');
const mockWeatherReport = jest.fn();
jest.mock('../WeatherReportVC', () => {
    return {
        WeatherReport: jest.fn(() => {
            return {
                setProps: mockWeatherReport
            }
        })
    }
});
jest.mock('../Form');
jest.mock('../Storage', () => {
    const originalModule = jest.requireActual('../Storage');
    return {
        ...originalModule,
        }
});
Storage.prototype.newTrip = jest.fn();
Storage.prototype.delete = jest.fn();

jest.mock('../getCountry'); // using manual mock
jest.mock('../getWeather'); // using manual mock
jest.mock('../getImage'); // using manual mock

const mockClient: ClientLib = jest.fn();
mockClient.form = new Form(document.createElement('form') as IMyFormElement);
mockClient.appStore = new Storage(document.createElement('div'), {key: 'key'});


beforeAll(() => {
    global.Client = mockClient;
});

beforeEach(() => {
    (getWeather as unknown as jest.Mock).mockClear();
});
afterAll(() => {
    jest.resetAllMocks();
});

const formData = {
    lat: 32.23,
    lng: 23.32,
    from: dateString(new Date()),
    // to: dateString(new Date()),
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

    // mockClient.trip = trip;
    test('should not render initially', () => {
        expect(spyRender).toHaveBeenCalledTimes(0);
        spyRender.mockRestore();
    });
    it('should call the forecast route', () => {
        trip.eventBus().emit('flow:new-data', formData);
        const { name, countryName, adminName1, countryCode, lat, lng, from, submitNo } = formData;
        expect(getWeather).toHaveBeenCalledTimes(1);
        expect(getWeather).toHaveBeenCalledWith('/.netlify/functions/app/api/forecast', { lat, lng, from, submitNo });
        // expect(getImage).toHaveBeenCalledWith(name, countryName, submitNo);
        expect(getImage).toHaveBeenCalledWith(`${name} ${adminName1} ${countryName}`, countryCode, submitNo);
        expect(mode.textContent).toBe('Weather forecast');
    });
    it('should call WeatherReport', () => {
        expect(WeatherReport).toHaveBeenCalledTimes(1);
        expect(mockWeatherReport).toHaveBeenCalledTimes(1);
    });
    // xit('should call the historical route', () => {
    //     formData.from = formData.to = '2007-11-11';
    //     trip.eventBus().emit('flow:new-data', formData);
    //     const { lat, lng, from, submitNo } = formData;
    //     expect(getWeather).toHaveBeenCalledTimes(1);
    //     expect(getWeather).toHaveBeenCalledWith('/.netlify/functions/app/api/forecast', { lat, lng, from, submitNo });
    //     expect(mode.textContent).toBe('Recorded weather');
    // });
    // xit('should call the average historical route', () => {
    //     formData.from = formData.to = dateString(new Date().setDate(new Date().getDate() + 20) as unknown as Date);
    //     trip.eventBus().emit('flow:new-data', formData);
    //     const { lat, lng, from, submitNo } = formData;
    //     expect(getWeather).toHaveBeenCalledTimes(1);
    //     expect(getWeather).toHaveBeenCalledWith('/.netlify/functions/app/api/forecast', { lat, lng, from, submitNo });
    //     expect(mode.textContent).toBe('Usual weather');
    // });
    it('should display error if getWeather fails', async () => {
        mockWeatherReport.mockClear();
        (getWeather as unknown as jest.Mock).mockImplementation(() => {
            return Promise.reject({ message: 'Weather error' });
        });
        trip.eventBus().emit('flow:new-data', formData);
        await waitForExpect(() => {
            expect(mockWeatherReport).toHaveBeenCalledWith({ error: 'Weather error' });
        });
    });
    it('should display error if getCountry fails', async () => {
        mockCountryInfo.mockClear();
        (getCountry as unknown as jest.Mock).mockImplementation(() => {
            return Promise.reject();
        });
        trip.eventBus().emit('flow:new-data', formData);
        await waitForExpect(() => {
            expect(mockCountryInfo).toHaveBeenCalledWith({ error: 'Country info unavailable' });
        });
    });
    it('should populate country info', () => {
        mockCountryInfo.mockClear();
        trip.eventBus().emit('flow:new-data', Object.assign(formData, { countryInfo: 'country info' }));
        expect(mockCountryInfo).toHaveBeenCalledTimes(1);
        expect(mockCountryInfo).toHaveBeenCalledWith('country info');
    });
    it('should save', () => {
        const click = new Event('click');
        saveBtn.dispatchEvent(click);
        expect(div.classList.contains('trip--saved')).toBeTruthy();
        
        expect(mockClient.appStore.newTrip).toHaveBeenCalledTimes(1);
    });
    it('should delete', () => {
        const click = new Event('click');
        removeBtn.dispatchEvent(click);
        expect(div.classList.contains('trip--saved')).toBeFalsy();
        expect(mockClient.appStore.delete).toHaveBeenCalledTimes(1);
    });
});