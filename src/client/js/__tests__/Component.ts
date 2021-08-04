/**
 * @jest-environment jsdom
 */
import { Component } from "../Component";

describe('Testing the Component base class functionality', () => {
    const div = document.createElement('div');
    it('should run init & componentDidMount once, which proves that event dispatch is set up correctly', () => {
        const initSpy = jest.spyOn(Component.prototype, 'init');
        const cdmSpy = jest.spyOn(Component.prototype, 'componentDidMount');
        const newComponent = new Component(div);
        expect.assertions(2);
        expect(initSpy).toHaveBeenCalledTimes(1);
        expect(cdmSpy).toHaveBeenCalledTimes(1);
        initSpy.mockRestore();
        cdmSpy.mockRestore();
    });
    it('should show and hide itself by toggling a className on the container element', () => {
        const newComponent = new Component(div);
        // @ts-ignore
        newComponent._base_class = 'base';
        newComponent.hide();
        expect(newComponent.el.className).toMatch('base--hidden');
        newComponent.show();
        expect(newComponent.el.className).not.toMatch('base--hidden');
    });
});