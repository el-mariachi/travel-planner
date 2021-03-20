import './styles/body.scss'
import { formSetup } from './js/formSetup';
import { newTripSubmitHandler } from './js/newtrip';
// import { EventBus } from './js/event-bus';
import { Storage } from './js/Storage';

// set up local storage
const localSorageKey = 'travel!@#$planner%^&*';
const appStore = new Storage(localSorageKey);

formSetup();

export {
    newTripSubmitHandler,
    Storage
};