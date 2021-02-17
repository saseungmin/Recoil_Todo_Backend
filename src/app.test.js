import request from 'supertest';

import mongoose from 'mongoose';

import app from './app';

jest.mock('mongoose');

describe('app', () => {
  let connection;

  beforeAll(async () => {
    connection = await mongoose.connect('mock_url',
      { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
  });

  afterAll(async () => {
    await connection.close();
  });

  it('Hello world works', async () => {
    const { status, text } = await request(app.callback()).get('/');

    expect(status).toBe(200);
    expect(text).toBe('Hello World!');
  });
});
