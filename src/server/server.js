const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const port = process.env.PORT || 3000;

const app = express();

// static assets path
app.use('/', express.static(path.join(__dirname, '../../dist')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
});


// start server
app.listen(port, () => {
    console.log(`Server listening at localhost:${port}`);
});