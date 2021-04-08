/**
 * @jest-environment jsdom
 */
import { TripHead } from "../src/client/js/TripHead";
import Mustache from "mustache";
import { tripHeadTemplate } from '../src/client/views/tripHead.tmpl';

jest.mock('mustache', () => {
    return {
        render: jest.fn()
    }
});

const headData = {
    countdown: 3,
    locationFullName: 'London',
    from: '2000-11-11',
    to: '2000-12-12'
}

describe('Testing TripHead functionality', () => {
    const div = document.createElement('div');
    const spyRender = jest.spyOn(TripHead.prototype, 'render');
    const head = new TripHead(div);
    it('should not render initially', () => {
        expect(spyRender).toHaveBeenCalledTimes(0);
        spyRender.mockRestore();
    });
    it('should render template with correct data', () => {
        head.setProps(headData);
        expect(Mustache.render).toHaveBeenCalledWith(tripHeadTemplate, {
            countdown: 3,
            name: 'London',
            from: '11/11/2000',
            to: '12/12/2000'
        });
    });
});