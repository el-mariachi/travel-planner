import { getLocations } from './getLocations';
import { hideLocations } from './hideLocations';
import { suggestionsHTML } from './suggestionsHTML';

const destRegEx = /^[\w, ]{2,}$/;
// using regular function declaration here in order
// to be able to use 'this' inside the function
export async function locationAutoFill(event) {
    // reset loc_id
    this.form.querySelector('#loc_id').value = 0;
    if (!destRegEx.test(this.value)) {
        return;
    }
    // found locations list div
    const locations = this.closest('.newtrip__section').querySelector('.locations__inner');
    const query = encodeURIComponent(this.value);
    const response = await getLocations(query);
    if (!Array.isArray(response) || response.length === 0) {
        hideLocations();
        return;
    }
    // render list
    locations.innerHTML = suggestionsHTML(response);
    locations.parentElement.classList.add('locations--visible');
}