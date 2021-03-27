import { Component } from './Component';
import { CountryInfo } from './CountryInfo';
import { daysDiff } from './daysDiff';
import { getCountry } from './getCountry';
import { getWeather } from './getWeather';
import { getImage } from './getImage';
import { Primitive } from './Primitive';
import { Button } from './Button';
import { TripHead } from './TripHead';
import { WeatherReport } from './WeatherReport';

export class Trip extends Component {
    static ROUTES = {
        W_FC: "/api/forecast",
        W_HS: "/api/historical",
        W_HSA: "/api/historical/average",
    };
    _base_class = 'trip';
    _image = null;
    _saved = false;
    _completed = false;

    constructor(el, props) {
        super(el, props);
        // this.el = div 
    }
    registerEvents(eventBus) {
        eventBus.on(Trip.EVENTS.FLOW_DATA, this.dataReceived.bind(this));
        eventBus.on('index', this.setIndex.bind(this));
    }
    componentDidMount() {
        // get DOM refs
        this.countryEl = this.el.querySelector('.trip--meta-country');
        this.country = new CountryInfo(this.countryEl);
        this.headEl = this.el.querySelector('.trip__head');
        this.head = new TripHead(this.headEl);
        this.mode = new Primitive(this.el.querySelector('#mode'));
        this.weatherEl = this.el.querySelector('#weather');
        this.weather = new WeatherReport(this.weatherEl);
        this.closeBtn = new Button(this.el.querySelector('.trip--control-close'), { click: this.close.bind(this) });
        this.saveBtn = new Button(this.el.querySelector('.trip--control-save'), { click: this.save.bind(this) });
        this.removeBtn = new Button(this.el.querySelector('.trip--control-remove'), { click: this.remove.bind(this) });
        // set click hanlers
        this.el.querySelector('.units').addEventListener('click', this.unitSelectorHandler.bind(this));
    }
    componentDidUpdate() {
        // set classes on elements depending on received data
        // scheduled / completed
        if (this._completed) {
            this.el.classList.add('trip--status-completed');
            this.el.classList.remove('trip--status-scheduled');
        } else {
            this.el.classList.add('trip--status-scheduled');
            this.el.classList.remove('trip--status-completed');
        }
        // new or saved
        if (this._saved) {
            this.el.classList.add('trip--saved');
        } else {
            this.el.classList.remove('trip--saved');
        }
        // update head
        this.head.setProps(Object.assign({ countdown: this.countDown }, this.data));
        // fetch all data
        const { lat, lng, from, submitNo } = this.data;
        getWeather(this._weatherRoute, { lat, lng, from, submitNo })
            .then(res => {
                if (res.submitNo < submitNo) return; // async requests may return in order that's different from how they were sent
                this.weather.setProps(res);
            })
            .catch(err => {
                this.weather.setProps({ error: err.message });
            });
        if (this.data.countryInfo) {
            // display stored
            this.country.setProps(this.data.countryInfo)
        } else {
            // fetch info
            getCountry(this.data.countryCode)
                .then(info => {
                    this.props.countryInfo = info;
                    this.country.setProps(info);
                })
                .catch(err => {
                    this.country.setProps({ error: 'Country info unavailable' });
                    console.log(err);
                });
        }
        // const image = getImage(this.data.name);
        getImage(this.data.name, this.data.countryName, submitNo)
            .then(img => {
                if (img.submitNo < submitNo) return;
                this.setImage(img.url);
            })
            .catch(err => {
                console.log(err, err.message);
                this.setImage(undefined);
            })
        // return true or false for render
        return true;
    }
    dataReceived(data) {
        this.eventBus().emit(Trip.EVENTS.RESET);
        // save data
        this.data = data;
        // check incoming date
        this.today = new Date();
        this.countDown = daysDiff(new Date(data.from), this.today);
        if (this.countDown < 0) {
            this._completed = true;
            // get hstorical
            this.mode.set('Recorded weather');
            this._weatherRoute = Trip.ROUTES.W_HS;
        } else if (this.countDown === 0) {
            this._completed = false;
            // get forecast
            this.mode.set('Weather forecast');
            this._weatherRoute = Trip.ROUTES.W_FC;
        } else if (this.countDown < 16) {
            this._completed = false;
            // get forecast
            this.mode.set('Weather forecast');
            this._weatherRoute = Trip.ROUTES.W_FC;
        } else {
            this._completed = false;
            // get average historical
            this.mode.set('Usual weather');
            this._weatherRoute = Trip.ROUTES.W_HSA;
        }
        // set other properties
        this._saved = data.saved;
        this._image = data.image
        // fire _component did update
        this.eventBus().emit(Trip.EVENTS.FLOW_CDU);
    }
    setIndex(i) {
        this.data.index = i;
    }
    unitSelectorHandler(event) {
        if (event.target.classList.contains('trip--selector-metric')) {
            this.el.classList.remove('trip--units-imperial');
        } else if (event.target.classList.contains('trip--selector-imperial')) {
            this.el.classList.add('trip--units-imperial');
        }
    }
    reset() {
        // clears old infos
        this.el.classList.remove('trip--saved');
        this._saved = false;
        this._image = null;
        this._completed = false;
        this.setImage(undefined);
    }
    render() {
        // hide form
        if (Client) {
            Client.form.eventBus().emit('hide');
        }
        // show trip
        this.show();
    }
    setImage(url) {
        if (url) {
            // show image
            this.el.querySelector('.trip__image').style.backgroundImage = `url(${url})`;
        } else {
            // show background from css
            this.el.querySelector('.trip__image').style.backgroundImage = '';
        }
    }
    save() {
        this.data.saved = true;
        Client.appStore.eventBus().emit('flow:new-data', Object.assign(this.data, { countryInfo: this.country.props }));
        this.el.classList.add('trip--saved');
    }
    close() {
        this.hide()
        Client.form.eventBus().emit('reset');
        this.reset()
    }
    remove() {
        Client.appStore.eventBus().emit('delete', this.data.index);
        this.close();
    }
}