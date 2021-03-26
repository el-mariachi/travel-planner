const dateString = require('./dateString');
const fetch = require('node-fetch');

/*--------------------API CALLS----------------------*/

// calls Geonames API, returns an array of found locations or an empty array
const fetchLocations = async (query, maxRows) => {
    const base_url = 'http://api.geonames.org/searchJSON';
    const searchParams = `featureClass=P&maxRows=${maxRows}`;
    const request_url = `${base_url}?name_startsWith=${query}&${searchParams}&username=${process.env.GEO_NAME}`;
    const result = await fetch(request_url).then(res => res.json());
    // throw new Error('any') // breaks code for testing, caught is in the calling route
    if (result && result.totalResultsCount > 0) {
        return result.geonames;
    } else {
        return [];
    }

};
// calls weatherbit API Weather Forecast 16 day / daily
// returns forecast for <date>
const fetchForecast = async (lat, lng, date) => {
    const base_url = 'http://api.weatherbit.io/v2.0/forecast/daily';
    const request_url = `${base_url}?lat=${lat}&lon=${lng}&key=${process.env.WEATHERBIT_KEY}`;
    const response = await fetch(request_url).then(res => res.json());
    return response.data.filter(day => day.valid_date === date).map(({ clouds, pop, weather, precip, min_temp, max_temp }) => ({ clouds, pop, weather, precip, min_temp, max_temp }));

};
// calls weatherbit API Historical Weather daily
// returns forecast for <date> (Promise)
const fetchHistorical = (lat, lng, date) => {
    const base_url = 'http://api.weatherbit.io/v2.0/history/daily';
    const next_day = new Date(date);
    next_day.setDate(next_day.getDate() + 1);
    const end_date = dateString(next_day);
    const request_url = `${base_url}?lat=${lat}&lon=${lng}&start_date=${date}&end_date=${end_date}&key=${process.env.WEATHERBIT_KEY}`;
    return fetch(request_url).then(res => res.json())
        .then(({ data }) => data.map(({ clouds, precip, min_temp, max_temp }) => ({ clouds, precip, min_temp, max_temp })));
};

// calls fetchHistorical to calculate average values over 5 years (max allowed by API)
const fetchHistoricalAvg = async (lat, lng, date) => {
    const baseDate = new Date(date);
    let thisYear = new Date().getFullYear();
    const initialValue = { clouds: 0, precip: 0, min_temp: 0, max_temp: 0 };
    // using Promise.allSettled so that even if some requests fail, we still get our weather
    // another way is to use Promise.all and to only return data if all 5 requests were successful
    const average = await Promise.allSettled(Array(5).fill('').map(() => dateString(new Date(baseDate.setFullYear(--thisYear))))
        .map(date => fetchHistorical(lat, lng, date)))
        .then(results => results
            .filter(result => result.status === 'fulfilled')
            .flatMap(result => result.value)
            .reduce((acc, day, i, arr) => {
                return {
                    clouds: acc.clouds + day.clouds / arr.length,
                    precip: acc.precip + day.precip / arr.length,
                    min_temp: acc.min_temp + day.min_temp / arr.length,
                    max_temp: acc.max_temp + day.max_temp / arr.length
                }
            }, initialValue));
    // make sure we got data
    if (Object.keys(average).filter(key => average[key] === 0).length === 4) {
        // all values stayed at 0
        throw new Error('Weather data unavailable');
    }
    return average;
}

module.exports = {
    fetchLocations,
    fetchForecast,
    fetchHistorical,
    fetchHistoricalAvg
}