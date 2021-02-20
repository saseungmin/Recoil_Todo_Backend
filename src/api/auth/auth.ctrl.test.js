import mongoose from 'mongoose';

import { register, login } from './auth.ctrl';

import User from '../../models/user';

describe('/auth', () => {
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

  it('response 500 /register', async () => {
    const error = new Error('error');

    const user = jest.spyOn(User, 'findByUserId')
      .mockRejectedValue(error);

    beforeEach(() => {
      user.mockClear();
    });

    afterEach(() => {
      user.mockRestore();
    });

    const payload = {
      request: {
        body: {
          id: 'test',
          password: 'test',
        },
      },
      throw: () => {},
    };

    try {
      await register(payload);
      await user();
    } catch (e) {
      expect(e).toEqual(error);
    }
  });

  it('response 500 /login', async () => {
    const error = new Error('error');

    const user = jest.spyOn(User, 'findByUserId')
      .mockRejectedValue(error);

    beforeEach(() => {
      user.mockClear();
    });

    afterEach(() => {
      user.mockRestore();
    });

    const payload = {
      request: {
        body: {
          id: 'test',
          password: 'test',
        },
      },
      throw: () => {},
    };

    try {
      await login(payload);
      await user();
    } catch (e) {
      expect(e).toEqual(error);
    }
  });
});
