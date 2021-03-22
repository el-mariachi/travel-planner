import { EventBus } from './event-bus';
const md5 = require('md5');

export class Storage {
    static EVENTS = {
        INIT: "init",
        FLOW_CDM: "flow:component-did-mount",
        FLOW_CDU: "flow:component-did-update",
        FLOW_LSDU: "flow:localstorage-did-update",
        FLOW_RENDER: "flow:render"
    }
    _key = null;
    _current = null;
    _trips = null;

    constructor(key) {
        this._key = key; // the key for localstorage
        this._current = {}; // current trip
        const eventBus = new EventBus;
        this.eventBus = () => eventBus;
        this.registerEvents(eventBus);
        eventBus.emit(Storage.EVENTS.INIT);
    }
    registerEvents(eventBus) {
        window.addEventListener('storage', this.localStorageDidUpdate.bind(this));
        eventBus.on(Storage.EVENTS.INIT, this.init.bind(this));
        eventBus.on(Storage.EVENTS.FLOW_CDM, this.componentDidMount.bind(this));
        eventBus.on(Storage.EVENTS.FLOW_CDU, this.componentDidUpdate.bind(this));
        eventBus.on(Storage.EVENTS.FLOW_RENDER, this.render.bind(this));
    }
    init() {
        this._trips = this.loadSaved(); // all saved trips
        this.eventBus().emit(Storage.EVENTS.FLOW_CDM); // emit store did mount
    }
    componentDidMount() {
        this.eventBus().emit(Storage.EVENTS.FLOW_RENDER);
    }
    localStorageDidUpdate(event) {
        if (event.key !== this._key) return;
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
        this.eventBus().emit(Storage.EVENTS.FLOW_RENDER);
    }
    loadSaved() {
        const localString = localStorage.getItem(this._key);
        return localString ? JSON.parse(localString) : [];
    }
    render() {
        // ??
        console.log('render');
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
        localStorage.setItem(this._key, JSON.stringify(this._trips));
    }
}