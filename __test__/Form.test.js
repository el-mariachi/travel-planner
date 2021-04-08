/**
 * @jest-environment jsdom
 */
import { Form } from "../src/client/js/Form";
import { Trip, mockDataReceived } from "../src/client/js/Trip";
import { Primitive } from "../src/client/js/Primitive";
import { EventBus } from "../src/client/js/event-bus";
import { dateString } from "../src/client/js/dateString";
import { suggestionsFragment } from "../src/client/js/suggestionsFragment";
import { getLocations } from "../src/client/js/getLocations";
import { locationFullName } from "../src/client/js/locationFullName";

const stdLocation = {
    name: 'London',
    countryName: 'United Kingdom',
    adminName1: 'England'
};

jest.mock('../src/client/js/Primitive');
jest.mock('../src/client/js/Trip');
const clientMock = jest.fn();
clientMock.trip = new Trip();

beforeAll(() => {
    global.Client = clientMock;
});
beforeEach(() => {
    Primitive.mockClear();
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
    list.classList = 'locations__inner';
    div.appendChild(list);
    const locations = document.createElement('div');
    locations.className = 'locations';
    div.appendChild(locations);
    const today = new Date();
    const todayString = dateString(today);
    const yesterday = new Date(today - (1000 * 60 * 60 * 24));
    const yesterdayString = dateString(yesterday);
    const form = new Form(div);
    it('should run prediction', (done) => {
        destination.value = 'London';
        form.predict();
        try {
            setTimeout(() => {
                expect(locations.classList.contains('locations--visible')).toBeTruthy();
                expect(list.innerHTML).toBe('<li>List Item</li>');
                done();
            }, 600)
        } catch (error) {
            done(error);
        }
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
        from.value = yesterdayString;
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
        Object.keys(stdLocation).forEach(key => {
            location.dataset[key] = stdLocation[key];
        });
        div.appendChild(location);
        const expected = {
            ...stdLocation,
            locationFullName: locationFullName(stdLocation)
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
    it('should submit plan B', (done) => {
        form._destination = false;
        destination.value = locationFullName(stdLocation);
        const submitEvent = new Event('submit');
        div.dispatchEvent(submitEvent);
        setTimeout(() => {
            expect(mockDataReceived).toHaveBeenCalledTimes(1);
            done();
        }, 500);
    });
    it('should reset', () => {
        form.reset();
        expect(destination.value).toBe('');
        expect(from.value).toBe('');
        expect(to.value).toBe('');
        expect(destination.classList.contains('locations__wait')).toBeFalsy();
    });
});