// class for handling localstorage
// trips data is serialized and saved to localstorage 
// under the key supplied to the constructor

import { Component } from './Component';
import Mustache from 'mustache';
const md5 = require('md5');
import { daysDiff } from './daysDiff';
import { tripsTemplate } from '../views/trips.tmpl';
export class Storage extends Component {

    _current = {};

    constructor(el, props) {
        super(el, props);
        // this.props.key is the the key for localstorage
    }
    registerEvents(eventBus) {
        // if localstorage is changed in another window, we'll know
        window.addEventListener('storage', this.localStorageDidUpdate.bind(this));
        eventBus.on(Storage.EVENTS.FLOW_DATA, this.newTrip.bind(this));
        eventBus.on(Storage.EVENTS.DELETE, this.delete.bind(this));

    }
    localStorageDidUpdate(event) {
        if (event.key !== this.props.key) return;
        let changes = false;
        const newTrips = this.loadSaved();
        if (newTrips.length !== this._trips.length) { // length differs -> load & render
            this._trips = newTrips;
            this.eventBus().emit(Storage.EVENTS.FLOW_CDU); // emit store did update
            return;
        }
        // compare hash values against saved set
        for (let i = 0, l = newTrips.length; i < l; i++) {
            // using a for loop to be able to break
            if (newTrips[i].hash !== this._trips[i].hash) {
                changes = true;
                break; // no need to check further
            }
        }
        if (changes) {
            this._trips = newTrips;
            this.eventBus().emit(Storage.EVENTS.FLOW_CDU); // emit store did update
        }
    }
    componentDidMount() {
        this._trips = this.loadSaved();
        this.el.addEventListener('click', this.loadTrip.bind(this));
        // refresh countdowns using current date
        this._trips = this._trips.map(trip => this.countDown(trip));
        // return true for render
        return true;
    }
    componentDidUpdate() {
        this.saveTrips();
        return true; // for render
    }
    countDown(trip) {
        this.today = new Date();
        return { ...trip, countdown: daysDiff(new Date(trip.from), this.today) };
    }
    loadTrip(event) {
        // trip click handler
        // sends clicked item to Trip
        const target = event.target.closest('.trips__item');
        if (!target) return;
        Client.trip.eventBus().emit('flow:new-data', this._trips[target.dataset.index]);
        event.stopPropagation();
    }
    loadSaved() {
        const localString = localStorage.getItem(this.props.key);
        return localString ? JSON.parse(localString) : [];
    }
    render() {
        this.el.innerHTML = '';
        let sch, cmpl;
        if (this._trips.length === 0) return;
        const scheduled = this._trips.filter(trip => trip.countdown >= 0);
        if (scheduled.length > 0) {
            sch = { scheduled };
        }
        const completed = this._trips.filter(trip => trip.countdown < 0);
        if (completed.length > 0) {
            cmpl = { completed };
        }
        this.el.innerHTML = Mustache.render(tripsTemplate, {
            sch,
            cmpl,
            countpast: function () { return -this.countdown }
        });
    }
    newTrip(trip = {}) {
        this._current = trip;
        this.saveCurrent();
    }
    saveCurrent() {
        // check if it already exists
        const currentHash = md5(JSON.stringify(this._current));
        if (this._trips.findIndex(trip => trip.hash === currentHash) === -1) {
            // the current data is unique
            this._trips.push({
                hash: currentHash,
                ...this.countDown(this._current),
                // saved: true
            });
            this.sort(); // first sort trips
            // then add index to each item
            this._trips = this._trips.map((trip, index) => {
                if (trip.hash === currentHash) {
                    // send index to Trip for immediate removal (if needed)
                    Client.trip.eventBus().emit('index', index);
                }
                return { ...trip, index };
            });
            this.eventBus().emit(Storage.EVENTS.FLOW_CDU); // emit store did update
        }

    }
    delete(index) {
        if (index === undefined) return null;
        this._trips.splice(index, 1);
        // reindex
        this._trips = this._trips.map((trip, index) => ({ ...trip, index }));
        this.eventBus().emit(Storage.EVENTS.FLOW_CDU);
    }
    sort() {
        this._trips.sort((a, b) => a.countdown - b.countdown);
    }
    saveTrips() {
        localStorage.setItem(this.props.key, JSON.stringify(this._trips));
    }
}