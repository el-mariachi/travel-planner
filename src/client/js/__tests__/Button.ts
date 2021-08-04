/**
 * @jest-environment jsdom
 */
import { Button } from '../Button';

test('Testing the click event on Button', () => {
    const spyMount = jest.spyOn(Button.prototype, 'componentDidMount')
    const div = document.createElement('div');
    const click = jest.fn();
    const butt = new Button(div, { click });
    expect(spyMount).toHaveBeenCalledTimes(1);
    const clickEvent = new Event('click');
    butt.el.dispatchEvent(clickEvent);
    expect(click).toHaveBeenCalledTimes(1);
    expect(click).toHaveBeenCalledWith(clickEvent);
    spyMount.mockRestore();
});