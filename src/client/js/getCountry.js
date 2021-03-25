import fetch from "node-fetch";

const getCountry = (query) => {
    const base_url = 'https://restcountries.eu/rest/v2/name/';
    const countryQuery = encodeURIComponent(query);

    return fetch(`${base_url}${countryQuery}?fullText=true`)
        .then(res => res.json())
        .then(data => {
            if (data.status && data.status === 404) {
                throw new Error('API returned no results');
            }
            return (({ name, currencies, languages, capital, flag }) => ({ name, currencies, languages, capital, flag }))(data[0]);
        });
}

export { getCountry };