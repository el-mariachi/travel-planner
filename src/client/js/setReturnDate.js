// this function sets the current value and the 'min' attribute
// of the return date to the value of the departure date
// you can't return before you leave
const setReturnDate = (event) => {
    const from = event.target;
    const form = from.form;
    const to = form.elements.to;
    to.value = from.value;
    to.setAttribute('min', from.value);
};

export { setReturnDate };