import { newTripSubmitHandler } from './newtrip';
import { locationAutoFill } from './locationAutoFill';

const formSetup = () => {
    const form = document.forms.newtrip;
    form.addEventListener('submit', newTripSubmitHandler);
    form.elements.destination.addEventListener('keyup', locationAutoFill);
};

export { formSetup };