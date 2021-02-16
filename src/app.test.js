import request from 'supertest';

import app from './app';

test('Hello world works', async () => {
  const { status, text } = await request(app.callback()).get('/');

  expect(status).toBe(200);
  expect(text).toBe('Hello World!');
});
