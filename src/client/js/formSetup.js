import { locationSelect } from './locationSelect';
import { newTripSubmitHandler } from './formHandler';
import { predictLocation } from './predictLocation';
import { dateString } from './dateString';
import { setReturnDate } from './setReturnDate';
// import { debounce } from './debounce';

// too expensive to call API on every keyup, so
// const predict = debounce(predictLocation, 300);

const clear = el => {
    el.textContent = '';
};

const formSetup = () => {
    const today = new Date();
    const form = document.forms.newtrip;
    const destination = form.elements.destination;
    const from = form.elements.from;
    const to = form.elements.to;
    const destinationError = form.querySelector('#destination_error');
    const fromError = form.querySelector('#from_error');
    const toError = form.querySelector('#to_error');
    destination.addEventListener('focus', () => {
        clear(destinationError);
    });
    from.addEventListener('focus', () => {
        clear(fromError);
    });
    to.addEventListener('focus', () => {
        clear(toError);
    });

    clear(destinationError);
    clear(fromError);
    clear(toError);

    from.setAttribute('min', dateString(today));
    to.setAttribute('min', dateString(today));
    from.addEventListener('change', setReturnDate);
    form.addEventListener('click', locationSelect);
    form.addEventListener('submit', newTripSubmitHandler);
    form.elements.destination.addEventListener('keyup', predictLocation);
    // form.elements.destination.addEventListener('blur', hideLocations);
};

export { formSetup };