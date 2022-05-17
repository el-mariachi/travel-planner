require('dotenv').config();
import path from "path";
import express, { RequestHandler } from "express";
import cors from 'cors';
import favicon from 'serve-favicon';
import { jsonMock } from "./mockAPI";
import { fetchLocations, fetchForecast, fetchHistorical, fetchHistoricalAvg, fetchPix } from "./serverFuncs";
import { timelineRequest } from './visualCrossing';
export const app = express();

// set up middleware. bodyparser is not needed since express > 4.16
app.use(express.json() as RequestHandler);
app.use(express.urlencoded({ extended: true }) as RequestHandler);
app.use(cors());
app.use(favicon(path.join(__dirname, '../', 'client', 'media', 'favicon.ico')))

// assets path
app.use('/', express.static(path.join(__dirname, '../../dist')));


/*--------------------ROUTES-------------------------*/

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

/*----------------API-ROUTES-------------------------*/
// route for displaying suggested locations
app.post('/api/locations', async (req, res) => {
    const { query, maxRows } = req.body;
    if (!(/^[\u00BF-\u1FFF\u2C00-\uD7FF\w,.'’ -]{2,}$/i.test(decodeURIComponent(query)))) {
        res.status(400).send('Not found');
        return;
    }
    try {
        const result = await fetchLocations(query, maxRows);
        res.status(200).json(result);
    } catch (error) {
        // forward error message to client
        // maybe it's better to send error status instead
        res.status(200).json([{ lng: 0, lat: 0, geonameId: 0, name: '!!! Error', adminName1: 'Locations service unavailable', countryName: '!!!' }]);
    }
});

// forecast route
app.post('/api/forecast', async (req, res) => {
    const { lat, lng, from, submitNo } = req.body;
    try {
        const [forecast] = await timelineRequest(lat, lng, from); // destructure array
        res.status(200).json({ submitNo, ...forecast });
    } catch (err: any) {
        // forward error message to client
        // maybe it's better to send error status instead
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
    } catch (err: any) {
        // forward error message to client
        // maybe it's better to send error status instead
        res.status(200).json({ submitNo, error: err.message })
    }
});
// average historical route is hit whenever the date is 16 or more days ahead
app.post('/api/historical/average', async (req, res) => {
    const { lat, lng, from, submitNo } = req.body;
    try {
        const weatherAvg = await fetchHistoricalAvg(lat, lng, from);
        res.status(200).json({ submitNo, ...weatherAvg });
    } catch (err: any) {
        // forward error message to client
        // maybe it's better to send error status instead
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
    res.send(jsonMock);
});
