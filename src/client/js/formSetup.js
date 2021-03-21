import { locationAutoFill } from './locationAutoFill';

const formSetup = () => {
    const form = document.forms.newtrip;
    console.log(form);
    document.addEventListener('load', () => {
        form.addEventListener('submit', Client.newTripSubmitHandler);
        form.elements.destination.addEventListener('keyup', locationAutoFill);
    });
};

export { formSetup };