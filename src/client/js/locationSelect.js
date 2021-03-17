export function locationSelect(event) {
    const target = event.target;
    if (target.className !== 'locations__item') {
        return;
    }
    document.getElementById('destination').value = target.dataset.location;
    target.closest('.locations').classList.remove('locations--visible');
}