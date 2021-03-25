import { Component } from './Component';
import { Primitive } from './Primitive';

import { dateString } from './dateString';

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
        this.destRegEx = /^[\w, -]{2,}$/;
    }
    registerEvents(eventBus) {
        eventBus.on(Form.EVENTS.USER_SUBMIT, this.submit.bind(this));
        eventBus.on(Form.EVENTS.RESET, this.reset.bind(this));
    }
    componentDidMount() {
        this.loc_id = this.el.querySelector('#loc_id'); // TODO this has to go
        this.destination = this.el.elements.destination;
        this.destination.removeAttribute('required')
        this.destinationError = new Primitive(this.el.querySelector('#destination_error'));
        this.from = this.el.elements.from;
        this.fromError = new Primitive(this.el.querySelector('#from_error'));
        this.to = this.el.elements.to;
        this.to.removeAttribute('required')
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
        this.loc_id.value = 0; // TODO this has to go
    }
    formSubmitted(event) {
        // stay on this page
        event.preventDefault();
        // validate form values as much as we can
        if (this.validate()) {
            // submit with saved location
            this.eventBus().emit(Form.EVENTS.USER_SUBMIT);
            return;

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
        // this.eventBus().emit(Form.EVENTS.FLOW_CDU);
    }
    setReturnDate() {
        // you can't return before you leave
        this.to.value = this._fromDate;
        this.to.setAttribute('min', this._fromDate);
    }
    selectLocation(event) {
        const target = event.target;
        if (target.className !== 'locations__item') {
            this.hideList();
            return;
        }
        this._destination = Object.assign({}, target.dataset, {
            locationFullName: target.textContent
        });
        this.destination.value = target.textContent;
        // set loc_id to geoname ID
        this.loc_id.value = target.dataset.geonameId; // TODO this has to go
        this.hideList();
    }
    showList() {
        this.locations.classList.add('locations--visible');
    }
    hideList() {
        this.locations.classList.remove('locations--visible');
    }
    predict() {
        // reset loc_id and a saved destination
        this.eventBus().emit(Form.EVENTS.RESET);
        // this.loc_id.value = 0; // TODO this will probably go away
        // this._destination = null;
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
        this.list.innerHTML = `<li class="locations__item locations__wait">Loading suggested locations...</li>`;
        this.showList();
    }
    validate() {
        return true;

    }
    submit() {
        Client.trip.eventBus().emit('flow:new-data', {
            adminName1: "Minsk City",
            countryName: "Belarus",
            from: "2021-04-27",
            geonameId: "625144",
            lat: "53.9",
            lng: "27.56667",
            locationFullName: "Minsk, Minsk City, Belarus",
            name: "Minsk",
            saved: false,
            submitNo: 1,
            to: "2021-03-28"
        });
        this.hide();
    }
}