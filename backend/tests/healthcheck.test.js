import request from 'supertest';
import { app } from '../src/app.js';

describe('Health Check Endpoints', () => {
    test('GET / should return Hello', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Hello');
    });

    test('GET /api/v1/users/register should exist (even if it returns error)', async () => {
        const response = await request(app).post('/api/v1/users/register');
        // It might return 400 or 500 depending on implementation, but not 404
        expect(response.statusCode).not.toBe(404);
    });
});
