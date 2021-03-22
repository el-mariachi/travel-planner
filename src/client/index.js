import 'regenerator-runtime/runtime';
import './styles/body.scss'
// import { formSetup } from './js/formSetup';
import { newTripSubmitHandler } from './js/formHandler';
import { Storage } from './js/Storage';
import { Form } from './js/Form';

// set up local storage
const localSorageKey = 'travel!@#$planner%^&*';
const appStore = new Storage(localSorageKey);
const form = new Form(document.forms.newtrip);
// formSetup();

export {
    newTripSubmitHandler,
    Storage
};