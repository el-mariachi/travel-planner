// returns a document fragment
const suggestionsFragment = data => {
    const fragment = new DocumentFragment();
    fragment.append(...data.map(geoname => {
        const picked = (({ lng, lat, geonameId, name, countryName, adminName1 }) => ({ lng, lat, geonameId, name, countryName, adminName1 }))(geoname);
        // let dataAttrString = Object.keys(picked).map(key => `data-${key}="${picked[key]}"`).join(' ');

        const listItem = document.createElement('li');
        listItem.className = 'locations__item';
        listItem.textContent = `${picked.name}, ${picked.adminName1}, ${picked.countryName}`;
        Object.keys(picked).forEach(key => {
            listItem.dataset[key] = picked[key];
        });
        return listItem;
    }));
    return fragment;
}

export { suggestionsFragment };