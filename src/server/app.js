require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const mockAPIjsonResponse = require('./mockAPI');

const app = express();

// set up middleware. bodyparser is not needed since express > 4.16
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());

// assets path
app.use('/', express.static(path.join(__dirname, '../../dist')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

app.post('/locations', (req, res) => {
    console.log(req.body);
    res.status(200).json({ name: 'Mitson' });
});

// test json response with mock
app.get('/test/json', (req, res) => {
    res.send(mockAPIjsonResponse);
});

module.exports = app;