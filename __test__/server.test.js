import 'regenerator-runtime/runtime';
const request = require('supertest');
const app = require('../src/server/app');

describe('Test root path', () => {
    test('If the project is built correctly for production it shoud respond to GET method. Using async/await', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toEqual(200);
    });
});

describe('Test json middleware', () => {
    test('It should return correctly formatted JSON', async () => {
        const response = await request(app).get('/test/json');
        expect(response.type).toBe('application/json');
        expect(response.body).toMatchObject({
            'title': 'test json response',
            'message': 'this is a message',
            'time': 'now'
        });
    });
});
// TODO test urlencoded