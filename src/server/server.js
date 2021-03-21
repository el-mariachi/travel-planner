// app is split out into a separate file for testing purposes
// no need to listen to the port fot the tests
const app = require('./app');

const port = 3000;

// start server
app.listen(port, () => {
    console.log(`Server listening at localhost:${port}`);
});