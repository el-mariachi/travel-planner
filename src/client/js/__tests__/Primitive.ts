/**
 * @jest-environment jsdom
 */
import { Primitive } from "../Primitive";

describe('Testing Primitive class', () => {
    const span = document.createElement('span');
    const prim = new Primitive(span);
    it('should set value', () => {
        const value = 'myValue';
        prim.set(value);
        expect(span.textContent).toEqual(value);
    });
    it('should clear value', () => {
        prim.clear();
        expect(span.textContent).toEqual('');
    });
});