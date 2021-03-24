import { Component } from './Component';
import { EventBus } from './event-bus';

export class Trip extends Component {
    _image = '';
    constructor(props) {
        super(props);
        // this.props = div 
    }
    registerEvents(eventBus) {
        eventBus.on(Trip.EVENTS.FLOW_DATA, this.init.bind(this)); // TODO set up fuctions chain
    }
    receiveLocation() {
        // receives location, dates, submitNo, saved status
    }
    componentDidUpdate() {
        // fetch all data
        // return true or false for render
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