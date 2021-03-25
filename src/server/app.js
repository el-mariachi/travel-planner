require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const mockAPIjsonResponse = require('./mockAPI');

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
    const forecast = await fetchForecast(lat, lng, from);
    res.status(200).json({ submitNo, ...forecast });
});
// historical route
app.post('/historical', (req, res) => {

});
// average historical route
app.post('/historical/average', (req, res) => {

});

// test json response with mock
app.get('/test/json', (req, res) => {
    res.send(mockAPIjsonResponse);
});

module.exports = app;