/**
 * @jest-environment jsdom
 */
import { ClientLib } from "./ClientLib";
import { Form, IMyFormElement } from "../src/client/js/Form";
// @ts-ignore
import { Trip, mockDataReceived } from "../src/client/js/Trip";
import { Primitive } from "../src/client/js/Primitive";
import { dateString } from "../src/client/js/dateString";
import { locationFullName } from "../src/client/js/locationFullName";

const waitForExpect = require("wait-for-expect");

const stdLocation = {
    name: 'London',
    countryName: 'United Kingdom',
    adminName1: 'England',
    lat: 12,
    lng: 15,
    geonameId: 12345,
    countryCode: 'GB'
};
declare global {
    namespace NodeJS {
        interface Global {
            Client: ClientLib;
        }
    }
}

jest.mock('../src/client/js/Primitive');
jest.mock('../src/client/js/Trip');
const clientMock: ClientLib = jest.fn();
clientMock.trip = new Trip(document.createElement('div'));

beforeAll(() => {
    global.Client = clientMock;
});
beforeEach(() => {
    (Primitive as unknown as jest.Mock).mockClear();
    mockDataReceived.mockClear();
});
jest.mock('../src/client/js/suggestionsFragment');
const mockGetLocations = jest.fn();
jest.mock('../src/client/js/getLocations');

describe('Testing Form class functionality', () => {
    // setup minimal form structure
    const div = document.createElement('form');
    const destination = document.createElement('input');
    destination.setAttribute('type', 'text');
    destination.setAttribute('name', 'destination');
    div.appendChild(destination);
    const from = document.createElement('input');
    from.setAttribute('type', 'date');
    from.setAttribute('name', 'from');
    const to = document.createElement('input');
    to.setAttribute('type', 'date');
    to.setAttribute('name', 'to');
    div.appendChild(from);
    div.appendChild(to);
    const list = document.createElement('ul');
    list.className = 'locations__inner';
    div.appendChild(list);
    const locations = document.createElement('div');
    locations.className = 'locations';
    div.appendChild(locations);
    const today = new Date();
    const todayString = dateString(today);
    const yesterday = new Date(+today - (1000 * 60 * 60 * 24));
    const yesterdayString = dateString(yesterday);
    // create the form instance with that min structure
    const form = new Form(div as IMyFormElement);
    
    it('should run prediction', async () => {
        destination.value = 'London';
        // form.predict();
        const keyUp = new Event('keyup');
        destination.dispatchEvent(keyUp);
            await waitForExpect(() => {
                expect(locations.classList.contains('locations--visible')).toBeTruthy();
                expect(list.innerHTML).toBe('<li>List Item</li>');
            });

    });
    it('should pass validation', () => {
        from.value = todayString;
        to.value = todayString;
        expect(form.validate()).toBeTruthy();
    });
    it('should not pass validation', () => {
        destination.value = 'a';
        expect(form.validate()).toBeFalsy();
        destination.value = 'London';
        to.value = yesterdayString;
        expect(form.validate()).toBeFalsy();
        from.value = yesterdayString;
        expect(form.validate()).toBeFalsy();
    });
    it('should change end date to match start date when the latter is changed', () => {
        form.from.value = todayString;
        const changeEvent = new Event('change');
        form.from.dispatchEvent(changeEvent);
        expect(to.value).toBe(todayString);
    });
    it('should return from selectLocation handler and hide locations element', () => {
        locations.classList.add('locations--visible')
        const click = new Event('click');
        div.dispatchEvent(click);
        expect(locations.classList.contains('locations--visible')).toBeFalsy();
    });
    it('should set the _destinaton property to clicked location dataset', () => {
        locations.classList.add('locations--visible')
        const location = document.createElement('li');
        location.className = 'locations__item';
        location.textContent = locationFullName(stdLocation);
        Object.keys(stdLocation).forEach((key) => {
            location.dataset[key] = String(stdLocation[key as keyof typeof stdLocation]);
        });
        div.appendChild(location);
        const expected = {
            ...stdLocation,
            locationFullName: locationFullName(stdLocation),
            lat: String(stdLocation.lat),
            lng: String(stdLocation.lng),
            geonameId: String(stdLocation.geonameId)
        }
        const click = new Event('click', { bubbles: true });
        location.dispatchEvent(click);
        expect(form._destination).toEqual(expected);
        expect(locations.classList.contains('locations--visible')).toBeFalsy();
    });
    it('should submit', () => {
        form._destination = stdLocation;
        const submitData = {
            ...stdLocation,
            from: todayString,
            to: todayString,
            submitNo: 0,
            saved: false
        }
        const submitEvent = new Event('submit');
        div.dispatchEvent(submitEvent);
        expect(mockDataReceived).toHaveBeenCalledTimes(1);
        expect(mockDataReceived).toHaveBeenCalledWith(submitData);
    });
    it('should submit plan B', async () => {
        form._destination = null;
        destination.value = locationFullName(stdLocation);
        const submitEvent = new Event('submit');
        div.dispatchEvent(submitEvent);
        await waitForExpect(() => {
            expect(mockDataReceived).toHaveBeenCalledTimes(1);
        });
    });
    it('should reset', () => {
        form.reset();
        expect(destination.value).toBe('');
        expect(from.value).toBe('');
        expect(to.value).toBe('');
        expect(destination.classList.contains('locations__wait')).toBeFalsy();
    });
});