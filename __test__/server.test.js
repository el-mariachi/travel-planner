import 'regenerator-runtime/runtime';
const request = require('supertest');
const { app } = require('../src/server/app');
const serverFunctions = require('../src/server/serverFuncs');

describe('Test root path', () => {
    test('If the project is built correctly for production it shoud respond to GET method. Using async/await', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toEqual(200);
    });
    test('It should return the index.html file in response.text', async () => {
        const response = await request(app).get('/');
        expect(response.text).toBeDefined();
        expect(response.text).toMatch(/^<!DOCTYPE html>/i);
    });
});

describe('Test json middleware', () => {
    test('It should return correctly formatted JSON', async () => {
        const response = await request(app).get('/test/json'); // manual "mock"
        expect(response.type).toBe('application/json');
        expect(response.body).toMatchObject({
            'title': 'test json response',
            'message': 'this is a message',
            'time': 'now'
        });
    });
});
jest.mock('../src/server/serverFuncs'); // this is a manual mock
describe('Test POST routes', () => {

    test('Test /locations route with no data', async () => {
        const response = await request(app).post(`/api/locations`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send();
        expect(response.statusCode).toEqual(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
        expect(response.body[0]).toMatchObject({ name: '!!! Error' });
    });

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
        expect(response.body.length).toBe(limit);
    });

    test('Test /forecast route with no data', async () => {
        const response = await request(app).post('/api/forecast')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send();
        expect(response.statusCode).toEqual(200);
        expect(response.type).toBe('application/json');
        expect(response.body).toMatchObject({ error: 'empty' });
    });

    test('Test /forecast route without a date', async () => {
        const schema = {
            submitNo: expect.any(Number),
            clouds: expect.any(Number),
            pop: expect.any(Number),
            weather: expect.any(Number),
            precip: expect.any(Number),
            min_temp: expect.any(Number),
            max_temp: expect.any(Number)
        }
        const response = await request(app).post('/api/forecast')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({ lat: 1, lng: 1, submitNo: 1 });
        expect(response.statusCode).toEqual(200);
        expect(response.type).toBe('application/json');
        expect(response.body).toEqual(schema);
    });

    test('Test /historical route with no data', async () => {
        const response = await request(app).post('/api/historical')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send();
        expect(response.statusCode).toEqual(200);
        expect(response.type).toBe('application/json');
        expect(response.body).toMatchObject({ error: 'empty' });
    });


    test('Test /historical route normal', async () => {
        const schema = {
            submitNo: expect.any(Number),
            clouds: expect.any(Number),
            precip: expect.any(Number),
            min_temp: expect.any(Number),
            max_temp: expect.any(Number)
        }
        const response = await request(app).post('/api/historical')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({ lat: 1, lng: 1, from: "2021-03-03", submitNo: 1 });
        expect(response.statusCode).toEqual(200);
        expect(response.type).toBe('application/json');
        expect(response.body).toEqual(schema);
    });

    test('Test /historical/average route with no data', async () => {
        const response = await request(app).post('/api/historical/average')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send();
        expect(response.statusCode).toEqual(200);
        expect(response.type).toBe('application/json');
        expect(response.body).toMatchObject({ error: 'empty' });
    });


    test('Test /historical/average route normal', async () => {
        const schema = {
            submitNo: expect.any(Number),
            clouds: expect.any(Number),
            precip: expect.any(Number),
            min_temp: expect.any(Number),
            max_temp: expect.any(Number)
        }
        const response = await request(app).post('/api/historical/average')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({ lat: 1, lng: 1, from: "2021-03-03", submitNo: 1 });
        expect(response.statusCode).toEqual(200);
        expect(response.type).toBe('application/json');
        expect(response.body).toEqual(schema);
    });

    test('Test /pix route with no data', async () => {
        const response = await request(app).post('/api/pix')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send();
        expect(response.statusCode).toEqual(404);
        expect(response.type).toBe('application/json');
        expect(response.body).toMatchObject({ error: 'No image found' });
    });
    test('Test /pix route with normal', async () => {
        const response = await request(app).post('/api/pix')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({ name: 'London', submitNo: 2 });
        expect(response.statusCode).toEqual(200);
        expect(response.type).toBe('application/json');
        expect(response.body).toMatchObject({ url: 'London', submitNo: 2 });
    });
});
