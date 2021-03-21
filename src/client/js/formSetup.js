import { locationSelect } from './locationSelect';
import { newTripSubmitHandler } from './newtrip';
import { locationAutoFill } from './locationAutoFill';
import { debounce } from './debounce';
import { hideLocations } from './hideLocations';
// too expensive to call API on every keyup, so
const predict = debounce(locationAutoFill, 500);

const formSetup = () => {
    const form = document.forms.newtrip;
    form.addEventListener('click', locationSelect);
    form.addEventListener('submit', newTripSubmitHandler);
    form.elements.destination.addEventListener('keyup', predict);
    // here we should create an Obsevable instead
    form.elements.destination.addEventListener('blur', hideLocations);
};

export { formSetup };