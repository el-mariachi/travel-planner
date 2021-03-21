import { getLocations } from './getLocations';

// using regular function declaration here in order
// to be able to use 'this' inside the function
export function locationAutoFill(event) {
    if (this.value.length < 2) {
        return;
    }
    // found locations list div
    const locations = this.closest('.newtrip__section').querySelector('.locations__inner');
    const query = this.value;
    const response = getLocations(query);
}