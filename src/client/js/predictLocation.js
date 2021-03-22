import { getLocations } from './getLocations';
import { hideLocations } from './hideLocations';
import { suggestionsHTML } from './suggestionsHTML';
import { debounceAsync } from './debounceAsync';

const debouncedLocation = debounceAsync(getLocations, 500);

const destRegEx = /^[\w, ]{2,}$/;

// destination form input handler
// using regular function declaration here in order
// to be able to use 'this' inside the function
export function predictLocation(event) {
    // reset loc_id
    this.form.querySelector('#loc_id').value = 0;
    if (!destRegEx.test(this.value)) {
        return;
    }
    // get element to put predictions into
    const locations = this.closest('.newtrip__section').querySelector('.locations__inner');
    // prep string for fetch
    const query = encodeURIComponent(this.value);
    // make a call to backend. fill list upon resolve
    // in the meantime display spinner
    debouncedLocation(query)
        .then(response => {
            // if nothing is returned, do nothing
            if (!Array.isArray(response) || response.length === 0) {
                hideLocations();
                return;
            }
            // otherwise render list of predictions
            locations.innerHTML = suggestionsHTML(response);
            locations.parentElement.classList.add('locations--visible');
        })
        .catch(err => {
            console.log(err);
        });
    locations.innerHTML = `<li class="locations__item locations__wait">Loading suggested locations...</li>`;
    locations.parentElement.classList.add('locations--visible');

}