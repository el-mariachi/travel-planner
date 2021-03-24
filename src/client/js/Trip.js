import { Component } from './Component';
import { daysDiff } from './daysDiff';

export class Trip extends Component {
    static ROUTES = {
        W_FC: "http://localhost:3000/forecast",
        W_HS: "http://localhost:3000/historical",
        W_HSA: "http://localhost:3000/historical/average",
    };

    _image = '';
    _saved = false;
    _completed = false;

    constructor(el, props) {
        super(el, props);
        // this.el = div 
    }
    registerEvents(eventBus) {
        eventBus.on(Trip.EVENTS.FLOW_DATA, this.dataReceived.bind(this)); // TODO set up fuctions chain
    }
    receiveLocation() {
        // receives location, dates, submitNo, saved status
    }
    componentDidUpdate() {
        // TODO set classes on elements
        // fetch all data
        const weather = getWeather(this._weatherRoute, this.data.from); // TODO don't forget submitNo !!!!!!!!!!!!!!!!!
        const country = getCountry(this.data.countryName);
        const image = getImage(this.data.name);
        // return true or false for render
    }
    dataReceived(data) {
        // save data
        this.data = data;
        // process dates
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