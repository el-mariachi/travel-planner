import { Component } from './Component';
const md5 = require('md5');

export class Storage extends Component {

    // _key = null;
    // _current = null;
    _trips = null;

    constructor(key) {
        super(key);
        // this.props = key; // the key for localstorage
        this._current = {}; // current trip
        this._trips = this.loadSaved(); // all saved trips
    }
    registerEvents(eventBus) {
        window.addEventListener('storage', this.localStorageDidUpdate.bind(this));
        eventBus.on(Storage.EVENTS.FLOW_DATA, this.render.bind(this)); // TODO set up fuctions chain
    }
    localStorageDidUpdate(event) {
        if (event.key !== this.props) return;
        let changes = false;
        const newTrips = this.loadSaved();
        if (newTrips.length !== this._trips.length) { // length differs -> load & render
            this._trips = newTrips;
            this.eventBus().emit(Storage.EVENTS.FLOW_CDU); // emit store did update
            return;
        }
        // compare hash values
        for (let i = 0, l = newTrips.length; i < l; i++) {
            // using a for loop to be able to break
            if (newTrips[i].hash !== this._trips[i].hash) {
                changes = true;
                break;
            }
        }
        if (changes) {
            this._trips = newTrips;
            this.eventBus().emit(Storage.EVENTS.FLOW_CDU); // emit store did update
        }
    }
    componentDidUpdate() {
        this.saveTrips();
    }
    loadSaved() {
        const localString = localStorage.getItem(this.props);
        return localString ? JSON.parse(localString) : [];
    }
    render() {
        // ??
        // test receive args
        // console.log(arguments[0]);
    }
    get current() {
        return this._current;
    }
    set current(obj = {}) {
        // TODO implement this method
        this._current = obj;
        this.eventBus().emit(Storage.EVENTS.FLOW_CDU);
    }
    saveCurrent() {
        // check if it already exists
        const currentHash = md5(this._current);
        if (this._trips.findIndex(trip => trip.hash === currentHash) !== -1) {
            // the current data is unique
            this._trips.push({
                hash: currentHash,
                ...this._current
            });
            this.sort();
            this.eventBus().emit(Storage.EVENTS.FLOW_CDU); // emit store did update
            this.saveTrips();
        }

    }
    get(index) {
        if ((index === undefined) || (typeof index !== 'number')) return null;
        return this._trips[index];
    }
    delete(index) {
        if (index === undefined) return null;
        return this._trips.splice(index, 1);
    }
    sort() {
        this._trips.sort((a, b) => (new Date(a.date)) >= (new Date(b.date)));
    }
    saveTrips() {
        localStorage.setItem(this.props, JSON.stringify(this._trips));
    }
}