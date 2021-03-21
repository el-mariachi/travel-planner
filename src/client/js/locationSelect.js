import { hideLocations } from './hideLocations';

export function locationSelect(event) {
    const target = event.target;
    if (target.className !== 'locations__item') {
        return;
    }
    document.getElementById('destination').value = target.dataset.location;
    // set verified to true
    target.closest('.newtrip__section').querySelector('#verified').value = 1;
    hideLocations();
}