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
const fetchLocations = async (query) => {
    const base_url = 'http://api.geonames.org/searchJSON';
    const searchParams = 'featureClass=P&maxRows=30';
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

/*--------------------ROUTES-------------------------*/

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
});
// route for displaying suggested results
app.post('/locations', async (req, res) => {
    const { query } = req.body;
    console.log(query);
    if (!(/^[\w, ]{2,}$/.test(query))) {
        res.sendStatus(400);
        return;
    }
    const result = await fetchLocations(query);
    res.status(200).json(result);
});

// test json response with mock
app.get('/test/json', (req, res) => {
    res.send(mockAPIjsonResponse);
});

module.exports = app;