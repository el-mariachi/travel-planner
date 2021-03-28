// class responsible for user form

import { Component } from './Component';
import { Primitive } from './Primitive';

import { dateString } from './dateString';
import { locationFullName } from './locationFullName';

import { getLocations } from './getLocations';
import { suggestionsFragment } from './suggestionsFragment';
import { debounceAsync } from './debounceAsync';

// debounce the function that calls the API by 1/2 second
// in order not to make too many expensive network requests
const debouncedLocation = debounceAsync(getLocations, 500);


export class Form extends Component {

    _base_class = 'newtrip';
    _destination = null;
    _fromDate = null;
    _toDate = null;
    _submitNo = 0;

    constructor(el) {
        super(el);
        // this.today = new Date();
        this.destRegEx = /^[\u00BF-\u1FFF\u2C00-\uD7FF\w,.'’ -]{2,}$/i;
    }
    registerEvents(eventBus) {
        eventBus.on(Form.EVENTS.USER_SUBMIT, this.submit.bind(this));
    }
    componentDidMount() {
        // set up DOM elements
        this.destination = this.el.elements.destination;
        this.destinationError = new Primitive(this.el.querySelector('#destination_error'));
        this.from = this.el.elements.from;
        this.fromError = new Primitive(this.el.querySelector('#from_error'));
        this.to = this.el.elements.to;
        this.toError = new Primitive(this.el.querySelector('#to_error'));
        this.locations = this.el.querySelector('.locations');
        this.list = this.el.querySelector('.locations__inner');
        const today = new Date();
        this.from.setAttribute('min', dateString(today));
        this.to.setAttribute('min', dateString(today));
        this.from.addEventListener('change', this.fromDateChange.bind(this));
        this.el.addEventListener('click', this.selectLocation.bind(this));
        // clear error messages on focus
        this.destination.addEventListener('focus', this.clearDestErr.bind(this));
        this.from.addEventListener('focus', this.clearFromErr.bind(this));
        this.to.addEventListener('focus', this.clearToErr.bind(this));
        this.clearErrors();
        // submit event handler
        this.el.addEventListener('submit', this.formSubmitted.bind(this));
        // "kinda typeahead"
        this.destination.addEventListener('keyup', this.predict.bind(this));

        this.destination.focus();
    }
    reset() {
        // clears saved location data
        this._destination = null;
        this.destination.value = '';
        this.destination.classList.remove('locations__wait');
        this.from.value = '';
        this.to.value = '';
        this.show();
    }
    formSubmitted(event) {
        // stay on this page
        event.preventDefault();
        // validate form values as much as we can
        if (this.validate()) {
            // submit with saved location
            this.eventBus().emit(Form.EVENTS.USER_SUBMIT);
            // double check location without debounce
            const query = encodeURIComponent(this.destination.value);
            // only fetch the first result
            getLocations(query, 1)
                .then(response => {
                    // if response.length > 0
                    if (!Array.isArray(response) || response.length === 0) {
                        return;
                    }
                    //  compare new location name with the saved one
                    if (locationFullName(response[0]) === locationFullName(this._destination)) {
                        // location is same
                        return;
                    }
                    // if diferent, save new data and submit again
                    this._destination = Object.assign({}, response[0], {
                        locationFullName: locationFullName(response[0])
                    });
                    this.eventBus().emit(Form.EVENTS.USER_SUBMIT);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
    clearErrors() {
        this.clearDestErr();
        this.clearFromErr();
        this.clearToErr();
    }
    clearDestErr() {
        this.destinationError.clear();
    }
    clearFromErr() {
        this.fromError.clear();
    }
    clearToErr() {
        this.toError.clear();
    }
    fromDateChange() {
        this._fromDate = this.from.value;
        this.setReturnDate();
    }
    setReturnDate() {
        // you can't return before you leave
        this.to.value = this._fromDate;
        this.to.setAttribute('min', this._fromDate);
    }
    selectLocation(event) {
        // suggested search results list click handler
        // saves data from the clicked item's dataset into this._destination
        const target = event.target;
        if (target.className !== 'locations__item') {
            this.hideList();
            return;
        }
        this._destination = Object.assign({}, target.dataset, {
            locationFullName: target.textContent
        });
        this.destination.value = target.textContent;
        this.hideList();
    }
    showList() {
        this.locations.classList.add('locations--visible');
    }
    hideList() {
        this.locations.classList.remove('locations--visible');
    }
    predict() {
        // displays search results list
        // validate value
        if (!this.destRegEx.test(this.destination.value)) {
            return;
        }
        // prep string for fetch
        const query = encodeURIComponent(this.destination.value);
        // make a call to backend. fill list upon resolving the promise
        // in the meantime display spinner
        debouncedLocation(query)
            .then(response => {
                // if nothing is returned, do nothing
                if (!Array.isArray(response) || response.length === 0) {
                    this.hideList();
                    return;
                }
                // otherwise render list of predictions
                this.list.innerHTML = '';
                this.list.appendChild(suggestionsFragment(response));
                this.showList();
            })
            .catch(err => {
                console.log(err);
            });
        // spinner
        this.list.innerHTML = `<li class="locations__item locations__wait">Loading suggested locations...</li>`;
        this.showList();
    }
    validate() {
        const today = new Date();
        // for comparisons to work correctly we need to reference midnight yesterday
        const yesterday = new Date(today - (1000 * 60 * 60 * 24));
        yesterday.setHours(23);
        yesterday.setMinutes(59);
        let valid = true;
        // check destination input
        if (!this.destination.value.trim() || !this.destRegEx.test(this.destination.value.trim())) {
            this.destinationError.set('Value not valid');
            valid = false;
        } else {
            this.destinationError.clear();
        }
        // validate departure date
        if (!this.from.value || (new Date(this.from.value) <= yesterday)) {
            this.fromError.set('Wrong date');
            valid = false;
        } else {
            this.fromError.clear();
        }
        // validate return date
        if (this.to.value && new Date(this.to.value) < new Date(this.from.value)) {
            this.toError.set("Can't return before you leave");
            valid = false;
        } else {
            this.toError.clear();
        }
        return valid;
    }
    submit() {
        if (this._destination) {
            // add dates, inc submitNo
            const dataToSend = Object.assign(this._destination, {
                from: this.from.value,
                to: this.to.value,
                submitNo: this._submitNo++,
                saved: false
            })
            // send event to appStore with data
            Client.trip.eventBus().emit('flow:new-data', dataToSend);
        } else {
            // -------------------- this is a fix of the issue raised by the reviewer -----------------
            this.destination.classList.add('locations__wait');
            // fetch location for entered name
            const query = encodeURIComponent(this.destination.value);
            getLocations(query, 1)
                .then(response => {
                    // if response.length > 0
                    if (!Array.isArray(response) || response.length === 0) {
                        return;
                    }
                    // save new data and submit 
                    this._destination = Object.assign({}, response[0], {
                        locationFullName: locationFullName(response[0])
                    });
                    const dataToSend = Object.assign(this._destination, {
                        from: this.from.value,
                        to: this.to.value,
                        submitNo: this._submitNo++,
                        saved: false
                    })
                    Client.trip.eventBus().emit('flow:new-data', dataToSend);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
}