import fetch from "node-fetch";
// goes to restcountries directly
const getCountry = (query) => {
    const base_url = 'https://restcountries.eu/rest/v2/alpha/';
    const countryQuery = encodeURIComponent(query);
    return fetch(`${base_url}${countryQuery}`)
        .then(res => res.json())
        .then(data => {
            if (data.status && data.status === 404 || data.status === 400) {
                throw new Error('API returned no results');
            }
            return (({ name, currencies, languages, capital, flag }) => ({ name, currencies, languages, capital, flag }))(data);
        })
        .catch(err => {
            throw new Error(err.message);
        });
}

export { getCountry };