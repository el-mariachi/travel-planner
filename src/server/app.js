require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const mockAPIjsonResponse = require('./mockAPI');
const { fetchLocations, fetchForecast, fetchHistorical, fetchHistoricalAvg, fetchPix } = require('./serverFuncs');
const app = express();

// set up middleware. bodyparser is not needed since express > 4.16
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());

// assets path
app.use('/', express.static(path.join(__dirname, '../../dist')));


/*--------------------ROUTES-------------------------*/

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

/*----------------API-ROUTES-------------------------*/
// route for displaying suggested results
app.post('/api/locations', async (req, res) => {
    const { query, maxRows } = req.body;
    if (!(/^[\u00BF-\u1FFF\u2C00-\uD7FF\w,.'’ -]{2,}$/i.test(decodeURIComponent(query)))) {
        res.sendStatus(400);
        return;
    }
    try {
        const result = await fetchLocations(query, maxRows);
        res.status(200).json(result);
    } catch (error) {
        // forward error message to client
        // TODO change status for error responses
        res.status(200).json([{ lng: 0, lat: 0, geonameId: 0, name: '!!! Error', adminName1: 'Locations service unavailable', countryName: '!!!' }]);
    }
});

// forecast route
app.post('/api/forecast', async (req, res) => {
    const { lat, lng, from, submitNo } = req.body;
    try {
        const [forecast] = await fetchForecast(lat, lng, from); // destructure array
        res.status(200).json({ submitNo, ...forecast });
    } catch (err) {
        // forward error message to client
        // TODO change status for error responses
        res.status(200).json({ submitNo, error: err.message });
    }
});
// historical route is hit whenever the date is in the past
app.post('/api/historical', async (req, res) => {
    const { lat, lng, from, submitNo } = req.body;
    try {
        const weather = await fetchHistorical(lat, lng, from);
        if (Array.isArray(weather) && weather.length > 0) {
            const [data] = weather;
            res.status(200).json({ submitNo, ...data });
        } else {
            throw new Error('Weather data unavailable')
        }
    } catch (err) {
        // forward error message to client
        // TODO change status for error responses
        res.status(200).json({ submitNo, error: err.message })
    }
});
// average historical route is hit whenever the date is 16 or more days ahead
app.post('/api/historical/average', async (req, res) => {
    const { lat, lng, from, submitNo } = req.body;
    try {
        const weatherAvg = await fetchHistoricalAvg(lat, lng, from);
        res.status(200).json({ submitNo, ...weatherAvg });
    } catch (err) {
        // forward error message to client
        // TODO change status for error responses
        res.status(200).json({ submitNo, error: err.message })
    }

});

// location image route
app.post('/api/pix', async (req, res) => {
    const { name, country, submitNo } = req.body;
    try {
        const url = await fetchPix(name, country);
        res.status(200).json({ url, submitNo });
    } catch (err) {
        res.status(404).send({ error: 'No image found' });
    }

});

// test json response with mock
app.get('/test/json', (req, res) => {
    res.send(mockAPIjsonResponse);
});

module.exports = { app, fetchLocations };