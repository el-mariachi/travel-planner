/**
 * @jest-environment jsdom
 */
import { ClientLib } from "./ClientLib";
import { Storage } from "../Storage";
// @ts-ignore
import { Trip, mockSetIndex, mockDataReceived } from "../Trip";
import { tripsTemplate } from "../../views/trips.tmpl";
import Mustache from "mustache";

declare global {
    namespace NodeJS {
        interface Global {
            Client: ClientLib;
        }
    }
}

jest.mock('mustache', () => {
    return {
        render: jest.fn()
    }
});
jest.mock('../Trip');
const clientMock: ClientLib = jest.fn();
clientMock.trip = new Trip(document.createElement('div'));

const renderSpy = jest.spyOn(Storage.prototype, 'render');
const saveSpy = jest.spyOn(Storage.prototype, 'saveTrips');
const loadSpy = jest.spyOn(Storage.prototype, 'loadSaved');

beforeAll(() => {
    global.Client = clientMock;
});
afterAll(() => {
    renderSpy.mockRestore();
    saveSpy.mockRestore();
    loadSpy.mockRestore();
});

const trip = {
    "lng": "113.54611",
    "lat": "22.20056",
    "geonameId": "1821274",
    "name": "Macao",
    "countryName": "Macao",
    "countryCode": "MO",
    "adminName1": "Macau",
    "locationFullName": "Macao, Macau, Macao",
    "from": "2021-04-16",
    "to": "2021-04-16",
    "submitNo": 0,
    "saved": true,
    "countryInfo": {
        "name": "Macao",
        "currencies": [
            {
                "code": "MOP",
                "name": "Macanese pataca",
                "symbol": "P"
            }
        ],
        "languages": [
            {
                "iso639_1": "zh",
                "iso639_2": "zho",
                "name": "Chinese",
                "nativeName": "中文 (Zhōngwén)"
            },
            {
                "iso639_1": "pt",
                "iso639_2": "por",
                "name": "Portuguese",
                "nativeName": "Português"
            }
        ],
        "capital": "",
        "flag": "https://restcountries.eu/data/mac.svg"
    }
}

describe('Testing the Storage class', () => {
    const div = document.createElement('div');
    const storage = new Storage(div, {key: 'localStorageKey'})
    it('should render', () => {
        expect(renderSpy).toHaveBeenCalledTimes(1);
    });
    it('should receive and save new trip', () => {
        storage.eventBus().emit('flow:new-data', trip);
        expect(saveSpy).toHaveBeenCalledTimes(1);
    });
    it('should delete by index', () => {
        // @ts-ignore
        storage._trips = [{ a: 1 }, { a: 2 }, { a: 3 }];
        storage.delete(1);
        // @ts-ignore
        expect(storage._trips).toEqual([{ a: 1, index: 0 }, { a: 3, index: 1 }]);
    });
    it('should load from localStorage if it is modified outside', () => {
        // loadSpy.mockClear();
        const storageEvent = new Event('storage');
        window.dispatchEvent(storageEvent);
        expect(loadSpy).toHaveBeenCalledTimes(1);
    });
});
