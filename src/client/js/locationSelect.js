import { hideLocations } from './hideLocations';

export function locationSelect(event) {
    const target = event.target;
    if (target.className !== 'locations__item') {
        hideLocations();
        return;
    }
    document.getElementById('destination').value = target.dataset.location;
    // set loc_id to true
    target.closest('.newtrip__section').querySelector('#loc_id').value = target.dataset.geonameId;
    hideLocations();
}