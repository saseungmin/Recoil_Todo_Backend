import request from 'supertest';

import mongoose from 'mongoose';

import app from './app';

describe('app', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__,
      { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true },
      (err) => {
        if (err) {
          process.exit(1);
        }
      });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('response 200 and "Recoil_Todo_Backend"', async () => {
    const { status, text } = await request(app.callback()).get('/');

    expect(status).toBe(200);
    expect(text).toBe('Recoil_Todo_Backend');
  });

  describe('POST /api/auth/register', () => {
    context("Isn't Error", () => {
      const payload = {
        id: 'seugmin',
        password: 'test123',
      };

      it('Response is Success Status', async () => {
        const { status, body } = await request(app.callback())
          .post('/api/auth/register')
          .send(payload);

        expect(status).toBe(201);
        expect(body).toHaveProperty('id', 'seugmin');
      });
    });

    context('Response is Error Status', () => {
      it('When the password does not exist response 400', async () => {
        const payload = {
          id: 'seugmin',
        };

        const { body, status } = await request(app.callback())
          .post('/api/auth/register')
          .send(payload);

        expect(status).toBe(400);
        expect(body.details[0]).toHaveProperty('message', '"password" is required');
      });

      it('When duplicate ID exists response 409', async () => {
        const payload = {
          id: 'seugmin',
          password: '123',
        };

        const { status } = await request(app.callback())
          .post('/api/auth/register')
          .send(payload);

        expect(status).toBe(409);
      });
    });
  });

  describe('POST /api/auth/login', () => {
    context("Isn't Error status", () => {
      const payload = {
        id: 'seugmin',
        password: 'test123',
      };

      it('Response is Success Status response 200', async () => {
        const { status, body } = await request(app.callback())
          .post('/api/auth/login')
          .send(payload);

        expect(status).toBe(200);
        expect(body).toHaveProperty('id', 'seugmin');
      });
    });

    context('Response is Error Status', () => {
      it('When the password and id does not exist response 401', async () => {
        const payload = {
          id: 'seugmin',
        };

        const { status } = await request(app.callback())
          .post('/api/auth/login')
          .send(payload);

        expect(status).toBe(401);
      });

      it('When the user ID does not exist response 401', async () => {
        const payload = {
          id: 'notFound',
          password: '123',
        };

        const { status } = await request(app.callback())
          .post('/api/auth/login')
          .send(payload);

        expect(status).toBe(401);
      });

      it('When passwords do not match response 401', async () => {
        const payload = {
          id: 'seugmin',
          password: '123',
        };

        const { status } = await request(app.callback())
          .post('/api/auth/login')
          .send(payload);

        expect(status).toBe(401);
      });
    });
  });
});
