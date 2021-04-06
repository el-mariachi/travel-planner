// the part of the Trip that displays the additional country info

import { Component } from './Component';
import Mustache from 'mustache';
import { countryInfoTemplate } from '../views/countryInfo.tmpl';
import { countryErrorTemplate } from '../views/countryError.tmpl';

export class CountryInfo extends Component {
    constructor(el, props = { error: "No info" }) {
        super(el, props);
    }
    setProps(newProps) {
        this.props = Object.assign({}, newProps);
        this.eventBus().emit(CountryInfo.EVENTS.FLOW_CDU);
    }
    render() {
        if (this.props.error) {
            this.el.innerHTML = Mustache.render(countryErrorTemplate, {
                error: this.props.error
            });
            return;
        }
        const getNames = allEntries => allEntries.map(({ name }) => name).join(', ');
        this.el.innerHTML = '';
        const { name, capital, currencies, languages, flag } = this.props;
        const allCurrencies = getNames(currencies);
        const allLanguages = getNames(languages);
        const currTitle = this.props.currencies.length > 1 ? 'Currencies' : 'Currency';
        const langTitle = this.props.languages.length > 1 ? 'Languages' : 'Language';
        this.el.innerHTML = Mustache.render(countryInfoTemplate, {
            name,
            capital,
            allCurrencies,
            allLanguages,
            currTitle,
            langTitle
        });
        // show flag
        this.el.querySelector('.trip__header').setAttribute('style', `background-image: url(${flag})`);
    }
}