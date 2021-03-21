import { locationSelect } from './locationSelect';
import { newTripSubmitHandler } from './formHandler';
import { locationAutoFill } from './locationAutoFill';
import { debounce } from './debounce';

// too expensive to call API on every keyup, so
const predict = debounce(locationAutoFill, 300);

const formSetup = () => {
    const today = new Date();
    const form = document.forms.newtrip;
    form.addEventListener('click', locationSelect);
    form.addEventListener('submit', newTripSubmitHandler);
    form.elements.destination.addEventListener('keyup', predict);
    // form.elements.destination.addEventListener('blur', hideLocations);
};

export { formSetup };