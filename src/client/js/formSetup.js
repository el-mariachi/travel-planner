import { locationSelect } from './locationSelect';
import { newTripSubmitHandler } from './newtrip';
import { locationAutoFill } from './locationAutoFill';
import { hideLocations } from './hideLocations';
const formSetup = () => {
    const form = document.forms.newtrip;
    form.addEventListener('click', locationSelect);
    form.addEventListener('submit', newTripSubmitHandler);
    form.elements.destination.addEventListener('keyup', locationAutoFill);
    // here we should create an Obsevable instead
    form.elements.destination.addEventListener('blur', hideLocations);
};

export { formSetup };