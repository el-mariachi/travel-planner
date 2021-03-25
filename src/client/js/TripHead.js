import { Component } from './Component';
import Mustache from 'mustache';
import { tripHeadTemplate } from '../views/tripHead.tmpl';

export class TripHead extends Component {
    constructor(el, props = {}) {
        super(el, props);
    }
    setProps(newProps) {
        this.props = Object.assign({}, newProps);
        this.eventBus().emit(TripHead.EVENTS.FLOW_CDU);
    }
    render() {
        if (Object.keys(this.props).length === 0) {
            return;
        }
        this.el.innerHTML = '';

        this.el.innerHTML = Mustache.render(tripHeadTemplate, {
            countdown: this.props.countdown === 0 ? '< 1' : Math.abs(this.props.countdown),
            name: this.props.locationFullName,
            from: new Date(this.props.from).toLocaleDateString(),
            to: new Date(this.props.to).toLocaleDateString()
        });
    }
}