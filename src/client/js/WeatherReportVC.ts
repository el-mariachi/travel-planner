// renders weather report head upon receiving props with setProps


import { Component, IProps } from './Component';
import Mustache from 'mustache';
import { weatherReportTemplate } from '../views/weatherReportVC.tmpl';
import { weatherReportErrorTemplate } from '../views/weatherReportError.tmpl';

export class WeatherReport extends Component {
    constructor(public el: HTMLElement, public props: IProps = {}) {
        super(el, props);
    }
    setProps(newProps: IProps) {        
        this.props = Object.assign({}, newProps);
        this.eventBus().emit(WeatherReport.EVENTS.FLOW_CDU);
    }
    fahrenheit(celsius: number) {
        return (celsius * 9 / 5) + 32;
    }
    componentDidMount() {
        return false;
    }
    render() {
        this.el.innerHTML = '';
        // if (Object.keys(this.props).length === 0) return;
        if (this.props.error) {
            this.el.innerHTML = Mustache.render(weatherReportErrorTemplate, {
                error: this.props.error
            });
            return;
        }
        // process props
        const precipImp = (this.props.precip / 25.4).toFixed(4);
        this.props.precip = this.props.precip.toFixed(3);
        this.props.cloudcover = this.props.cloudcover.toFixed(1);
        const tempminF = Math.round(this.fahrenheit(this.props.tempmin));
        const tempmaxF = Math.round(this.fahrenheit(this.props.tempmax));
        this.el.innerHTML = Mustache.render(weatherReportTemplate, {
            precipImp,
            tempminF,
            tempmaxF,
            ...this.props
        });
    }
}