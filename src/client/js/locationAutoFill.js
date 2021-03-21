import { getLocations } from './getLocations';

const destRegEx = /^[\w, ]{2,}$/;
// using regular function declaration here in order
// to be able to use 'this' inside the function
export function locationAutoFill(event) {
    // set verified to false
    this.form.querySelector('#verified').value = 0;
    if (!destRegEx.test(this.value)) {
        return;
    }
    // found locations list div
    const locations = this.closest('.newtrip__section').querySelector('.locations__inner');
    const query = encodeURIComponent(this.value);
    const response = getLocations(query);
}