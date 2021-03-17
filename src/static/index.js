console.log('New Trip Static layout');

import '../client/styles/body.scss'

import { newTripSubmitHandler } from '../client/js/newtrip';
import { locationAutoFill } from '../client/js/locationAutoFill';
import { locationSelect } from '../client/js/locationSelect';

const newTripForm = document.forms.newtrip;
if (newTripForm) {
    newTripForm.addEventListener('submit', newTripSubmitHandler);
    newTripForm.elements.destination.addEventListener('keyup', locationAutoFill);
}

document.addEventListener('click', locationSelect);