import { locationFullName } from './locationFullName';
import { ILocation, LocationKey } from "./types";

// returns a document fragment to be inserted as search results
const suggestionsFragment = (data: ILocation[]): DocumentFragment => {
    const fragment = new DocumentFragment();
    fragment.append(...data.map(geoname => {
        // only take these properties form input object
        const picked = (({ lng, lat, geonameId, name, countryName, countryCode, adminName1 }) => ({ lng, lat, geonameId, name, countryName, countryCode, adminName1 }))(geoname);
        const listItem = document.createElement('li');
        listItem.className = 'locations__item';
        listItem.textContent = locationFullName(geoname);
        // loop over picked properties and store them as data-attrs
        Object.keys(picked).forEach((key) => {
            listItem.dataset[key] = String(picked[key as keyof typeof picked]);
        });
        return listItem;
    }));
    return fragment;
}

export { suggestionsFragment };