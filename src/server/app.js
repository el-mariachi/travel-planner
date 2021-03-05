require('dotenv').config();
const path = require('path');
const express = require('express');
const mockAPIjsonResponse = require('./mockAPI');

const app = express();

// set up middleware. bodyparser is not needed since express > 4.16
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// static assets path
app.use('/', express.static(path.join(__dirname, '../../dist')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

// test json response with mock
app.get('/test/json', (req, res) => {
    res.send(mockAPIjsonResponse);
});

module.exports = app;