import 'regenerator-runtime/runtime';
const request = require('supertest');
const { app } = require('../src/server/app');
const serverFunctions = require('../src/server/serverFuncs');

describe('Test root path', () => {
    test('If the project is built correctly for production it shoud respond to GET method. Using async/await', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toEqual(200);
    });
});

describe('Test json middleware', () => {
    test('It should return correctly formatted JSON', async () => {
        const response = await request(app).get('/test/json'); // manual mock
        expect(response.type).toBe('application/json');
        expect(response.body).toMatchObject({
            'title': 'test json response',
            'message': 'this is a message',
            'time': 'now'
        });
    });
});
describe('Test POST routes', () => {
    test('Test /locations route', async () => {
        const city = 'London';
        const limit = 15;
        const response = await request(app).post(`/api/locations`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({ query: city, maxRows: limit });
        expect(response.statusCode).toEqual(200);
        expect(response.type).toBe('application/json');
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(15);
    });
});
