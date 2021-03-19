// using regular function declaration here in order
// to be able to use 'this' inside the function
export function locationAutoFill(event) {
    if (this.value.length < 2) {
        return;
    }

    const locations = this.closest('.newtrip__section').querySelector('.locations__inner');
    console.log(locations);
}