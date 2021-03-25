require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const mockAPIjsonResponse = require('./mockAPI');
const dateString = require('./dateString');

const app = express();

// set up middleware. bodyparser is not needed since express > 4.16
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());

// assets path
app.use('/', express.static(path.join(__dirname, '../../dist')));

/*--------------------API CALLS----------------------*/

// calls Geonames API, returns an array of found locations or an empty array
const fetchLocations = async (query, maxRows) => {
    const base_url = 'http://api.geonames.org/searchJSON';
    const searchParams = `featureClass=P&maxRows=${maxRows}`;
    const request_url = `${base_url}?name_startsWith=${query}&${searchParams}&username=${process.env.GEO_NAME}`;
    try {
        const result = await fetch(request_url).then(res => res.json());
        if (result && result.totalResultsCount > 0) {
            return result.geonames;
        } else {
            return [];
        }
    } catch (err) {
        console.error(err);
        return [];
    }
};
// calls weatherbit API Weather Forecast 16 day / daily
// returns forecast for <date>
const fetchForecast = async (lat, lng, date) => {
    const base_url = 'http://api.weatherbit.io/v2.0/forecast/daily';
    const request_url = `${base_url}?lat=${lat}&lon=${lng}&key=${process.env.WEATHERBIT_KEY}`;
    try {
        const response = await fetch(request_url).then(res => res.json());
        return response.data.filter(day => day.valid_date === date).map(({ clouds, pop, weather, precip, min_temp, max_temp }) => ({ clouds, pop, weather, precip, min_temp, max_temp }));
    } catch (err) {
        console.log(err);
        return { error: err };
    }
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
        .then(({ data }) => data.map(({ clouds, precip, min_temp, max_temp }) => ({ clouds, precip, min_temp, max_temp })))
        .catch(err => ({ error: err }));
};

// calls fetchHistorical to calculate average values over 5 years (max allowed by API)
const fetchHistoricalAvg = async (lat, lng, date) => {
    const baseDate = new Date(date);
    let thisYear = new Date().getFullYear();
    return await Promise.allSettled(Array(5).fill('').map(() => dateString(new Date(baseDate.setFullYear(--thisYear))))
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
            }, { clouds: 0, precip: 0, min_temp: 0, max_temp: 0 }));
}

/*--------------------ROUTES-------------------------*/

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
});
// route for displaying suggested results
app.post('/locations', async (req, res) => {
    const { query, maxRows } = req.body;
    console.log(query);
    if (!(/^[\w, -]{2,}$/.test(decodeURIComponent(query)))) {
        res.sendStatus(400);
        return;
    }
    const result = await fetchLocations(query, maxRows);
    res.status(200).json(result);
});

// forecast route
app.post('/forecast', async (req, res) => {
    const { lat, lng, from, submitNo } = req.body;
    const [forecast] = await fetchForecast(lat, lng, from); // destructure array
    res.status(200).json({ submitNo, ...forecast });
});
// historical route is hit whenever the date is in the past
app.post('/historical', async (req, res) => {
    const { lat, lng, from, submitNo } = req.body;
    const weather = await fetchHistorical(lat, lng, from);
    if (Array.isArray(weather) && weather.length > 0) {
        const [data] = weather;
        res.status(200).json({ submitNo, ...data });
    }
});
// average historical route is hit whenever the date is 16 or more days ahead
app.post('/historical/average', async (req, res) => {
    const { lat, lng, from, submitNo } = req.body;
    const weatherAvg = await fetchHistoricalAvg(lat, lng, from);
    res.status(200).json({ submitNo, ...weatherAvg });
});

// test json response with mock
app.get('/test/json', (req, res) => {
    res.send(mockAPIjsonResponse);
});

module.exports = app;