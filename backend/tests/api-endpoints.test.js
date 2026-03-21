import request from 'supertest';
import { app } from '../src/app.js';

describe('API Endpoint Reachability', () => {
    const endpoints = [
        { method: 'get', url: '/' },
        { method: 'post', url: '/api/v1/users/register' },
        { method: 'post', url: '/api/v1/users/login' },
        { method: 'get', url: '/api/v1/videos/' },
        { method: 'get', url: '/api/v1/tweets/' },
        { method: 'get', url: '/api/v1/subscriptions/' },
        { method: 'get', url: '/api/v1/playlists/' },
        { method: 'get', url: '/api/v1/likes/' },
        { method: 'get', url: '/api/v1/comments/' },
        { method: 'get', url: '/api/v1/dashboard/' },
    ];

    endpoints.forEach(({ method, url }) => {
        test(`${method.toUpperCase()} ${url} should not return 404`, async () => {
            const response = await request(app)[method](url);
            // Some might return 401 (Unauthorized) or 400 (Bad Request), but NOT 404 (Not Found)
            if (response.statusCode === 404) {
                console.warn(`Warning: ${url} returned 404`);
            }
            expect(response.statusCode).not.toBe(404);
        });
    });
});
