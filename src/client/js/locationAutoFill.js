export function locationAutoFill(event) {
    if (this.value.length < 2) {
        return;
    }

    const locations = this.closest('.newtrip__section').querySelector('.locations__inner');
    console.log(locations);
}