import mongoose from 'mongoose';

import {
  write, list, remove, getTodoById, update,
} from './todos.ctrl';

const mockSave = jest.fn().mockRejectedValue(new Error('error'));

jest.mock('../../models/todo', () => jest.fn().mockImplementation(() => ({ save: mockSave })));

describe('/todos', () => {
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

  it('POST response 500 /', async () => {
    const error = new Error('error');

    const payload = {
      state: {
        user: 'user',
      },
      request: {
        body: {
          task: 'test',
          isComplete: false,
        },
      },
      throw: () => {},
    };

    try {
      await write(payload);
    } catch (e) {
      expect(e).toEqual(error);
    }
  });

  it('GET response 500 /', async () => {
    const error = new Error('error');

    const payload = {
      state: {
        user: 'user',
      },
      request: {
        body: {
          task: 'test',
          isComplete: false,
        },
      },
      throw: () => {},
    };

    try {
      await list(payload);
    } catch (e) {
      expect(e).toEqual(error);
    }
  });

  it('DELETE response 500 /:id', async () => {
    const error = new Error('error');

    const payload = {
      params: {
        id: 'testId',
      },
      throw: () => {},
    };

    try {
      await remove(payload);
    } catch (e) {
      expect(e).toEqual(error);
    }
  });

  it('PATCH response 500 /:id', async () => {
    const error = new Error('error');

    const payload = {
      params: {
        id: 'testId',
      },
      request: {
        body: {
          task: 'test',
          isComplete: false,
        },
      },
      throw: () => {},
    };

    try {
      await update(payload);
    } catch (e) {
      expect(e).toEqual(error);
    }
  });

  it('"getTodoById" response 500 /:id', async () => {
    const error = new Error('error');

    const payload = {
      params: {
        id: mongoose.Types.ObjectId('testobjectid'),
      },
      throw: () => {},
    };
    const next = jest.fn();

    try {
      await getTodoById(payload, next);
    } catch (e) {
      expect(e).toEqual(error);
      expect(next).toBeCalledTimes(1);
    }
  });
});
