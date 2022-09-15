// class for handling localstorage
// trips data is serialized and saved to localstorage
// under the key supplied to the constructor
import { ISavedTrip } from './types';
import { EventBus } from './event-bus';
import { Component, IProps } from './Component';
import Mustache from 'mustache';
const md5 = require('md5');
import { daysDiff } from './daysDiff';
import { tripsTemplate } from '../views/trips.tmpl';
export class Storage extends Component {
    private _trips!: ISavedTrip[];
    private today!: Date;
    _current!: ISavedTrip;

    constructor(public el: HTMLElement, public props: IProps) {
        super(el, props);
        // this.props.key is the the key for localstorage
    }
    registerEvents(eventBus: EventBus) {
        // if localstorage is changed in another window, we'll know
        window.addEventListener(
            'storage',
            this.localStorageDidUpdate.bind(this)
        );
        eventBus.on(Storage.EVENTS.FLOW_DATA, this.newTrip.bind(this));
        eventBus.on(Storage.EVENTS.DELETE, this.delete.bind(this));
    }
    localStorageDidUpdate(event: StorageEvent) {
        if (event.key !== this.props.key) return;
        let changes = false;
        const newTrips = this.loadSaved();
        if (newTrips.length !== this._trips.length) {
            // length differs -> load & render
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
        this._trips = this._trips.map((trip) => this.applyCountDown(trip));
        // return true for render
        return true;
    }
    componentDidUpdate() {
        this.saveTrips();
        return true; // for render
    }
    // @log
    applyCountDown(trip: ISavedTrip): ISavedTrip {
        this.today = new Date();
        return {
            ...trip,
            countdown: daysDiff(new Date(trip.from), this.today),
        };
    }
    loadTrip(event: MouseEvent) {
        // trip click handler
        // sends clicked item to Trip
        const target: HTMLElement = (event.target as HTMLElement).closest(
            '.trips__item'
        )!;
        if (!target) return;
        const tripId = parseInt(target.dataset.index!);
        Client.trip.eventBus().emit('flow:new-data', this._trips[tripId]);
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
        const scheduled = this._trips.filter((trip) => trip.countdown! >= 0);
        if (scheduled.length > 0) {
            sch = { scheduled };
        }
        const completed = this._trips.filter((trip) => trip.countdown! < 0);
        if (completed.length > 0) {
            cmpl = { completed };
        }
        this.el.innerHTML = Mustache.render(tripsTemplate, {
            sch,
            cmpl,
            countpast: function () {
                return -this.countdown;
            },
        });
    }
    newTrip(trip: ISavedTrip) {
        this._current = trip;
        this.saveCurrent();
    }
    saveCurrent() {
        // check if it already exists
        const currentHash = md5(JSON.stringify(this._current));
        if (this._trips.findIndex((trip) => trip.hash === currentHash) === -1) {
            // the current data is unique
            this._trips.push({
                ...this.applyCountDown(this._current),
                hash: currentHash,
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
    delete(index: number): void {
        if (index === undefined) return;
        this._trips.splice(index, 1);
        // reindex
        this._trips = this._trips.map((trip, index) => ({ ...trip, index }));
        this.eventBus().emit(Storage.EVENTS.FLOW_CDU);
    }
    sort() {
        this._trips.sort((a, b) => a.countdown! - b.countdown!);
    }
    saveTrips() {
        localStorage.setItem(this.props.key, JSON.stringify(this._trips));
    }
}

// Used as a decorator
// function log(target: Object, methodName: string, descriptor: PropertyDescriptor) {
//     const originalMethod = descriptor.value;
//     descriptor.value = function(...args: any[]) {
//         console.log(`${methodName}(${JSON.stringify(args)})`);
//         const returnValue = originalMethod?.apply(this, args);
//         console.log(`${methodName}(${JSON.stringify(args)}) => ${returnValue}`);
//         return returnValue;
//     }
// }
