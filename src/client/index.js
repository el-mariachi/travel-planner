import 'regenerator-runtime/runtime';
import './styles/body.scss'
import { Storage } from './js/Storage';
import { Form } from './js/Form';
import { Trip } from './js/Trip';

// set up local storage
const localSorageKey = 'travel!@#$planner%^&*';
const appStore = new Storage(null, { key: localSorageKey });
const form = new Form(document.forms.newtrip);
const trip = new Trip(document.querySelector('.trips'));
// formSetup();

export {
    appStore,
    trip,
    form
};