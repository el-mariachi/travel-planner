import { Component } from './Component';
import { CountryInfo } from './CountryInfo';
import { daysDiff } from './daysDiff';
import { getCountry } from './getCountry';

export class Trip extends Component {
    static ROUTES = {
        W_FC: "http://localhost:3000/forecast",
        W_HS: "http://localhost:3000/historical",
        W_HSA: "http://localhost:3000/historical/average",
    };
    _base_class = 'trip';
    _image = '';
    _saved = false;
    _completed = false;

    constructor(el, props) {
        super(el, props);
        // this.el = div 
    }
    registerEvents(eventBus) {
        eventBus.on(Trip.EVENTS.FLOW_DATA, this.dataReceived.bind(this)); // TODO set up fuctions chain
        eventBus.on(Trip.EVENTS.RESET, this.reset.bind(this));
    }
    componentDidMount() {
        // get DOM refs
        this.countryEl = this.el.querySelector('.trip--meta-country');
        this.country = new CountryInfo(this.countryEl);
    }
    componentDidUpdate() {
        // TODO set classes on elements
        // fetch all data
        // const weather = getWeather(this._weatherRoute, this.data.from); // TODO don't forget submitNo !!!!!!!!!!!!!!!!!
        if (this.data.countryInfo) {
            // display stored
            this.country.setProps(this.data.countryInfo)
        } else {
            // fetch info
            getCountry(this.data.countryName)
                .then(info => {
                    this.country.setProps(info);
                })
                .catch(err => {
                    this.country.setProps({ error: 'Country info unavailable' });
                    console.log(err);
                });
        }
        // const image = getImage(this.data.name);
        // return true or false for render
        return false;
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
            // get hstorical (Recorded weather)
            this._weatherRoute = Trip.ROUTES.W_HS;
        } else if (this.countDown === 0) {
            this._completed = false;
            // get forecast (Weather forecast)
            this._weatherRoute = Trip.ROUTES.W_FC;
        } else if (this.countDown < 16) {
            this._completed = false;
            // get forecast (Weather forecast)
            this._weatherRoute = Trip.ROUTES.W_FC;
        } else {
            this._completed = false;
            // get average historical (Usual weather)
            this._weatherRoute = Trip.ROUTES.W_HSA;
        }
        console.log(this.countDown);
        // fire _component did update
        this.eventBus().emit(Trip.EVENTS.FLOW_CDU);
    }
    reset() {
        // clears old infos
        console.log('reset');
    }
    render() {
        // first emit event to form or have form listen to render/save/delete
        // forcast or usual depending on from date
    }
    setImage(url) {
        if (url) {
            // show image
            this.props.querySelector('.trip__image').style.backgroundImage = `url(${url})`;
        } else {
            // show background from css
            delete this.props.querySelector('.trip__image').style.backgroundImage;
        }
    }
}