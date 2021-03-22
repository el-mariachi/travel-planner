// form validation and ???
export function newTripSubmitHandler(event) {
    event.preventDefault();
    const today = new Date();
    // for comparisons to work correctly we need to reference midnight yesterday
    const yesterday = new Date(today - (1000 * 60 * 60 * 24));
    yesterday.setHours(23);
    yesterday.setMinutes(59);
    const destination = this.elements.destination;
    const from = this.elements.from;
    const to = this.elements.to;
    const destinationError = this.querySelector('#destination_error');
    const fromError = this.querySelector('#from_error');
    const toError = this.querySelector('#to_error');
    let valid = true;
    if (!destination.value.trim() || !/^[\w, ]{2,}$/.test(destination.value.trim())) {
        destinationError.textContent = 'Value not valid';
        valid = false;
    } else {
        destinationError.textContent = '';
    }
    // validate departure date
    if (!from.value || (new Date(from.value) <= yesterday)) {
        fromError.textContent = 'Wrong date';
        valid = false;
    } else {
        fromError.textContent = '';
    }
    // validate return date
    if (to.value && new Date(to.value) < new Date(from.value)) {
        toError.textContent = "Can't return before you leave";
        valid = false;
    } else {
        toError.textContent = '';
    }
    if (!valid) {
        // console.log('form NOT valid');
        return;
    } else {
        // form valid
    }
}
