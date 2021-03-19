import mongoose from 'mongoose';

import {
  write, list, remove, getTodoById, update, checkTodoByIds, multipleRemove,
} from './todos.ctrl';

const mockSave = jest.fn().mockRejectedValue(new Error('error'));

jest.mock('../../models/todo', () => jest.fn().mockImplementation(() => ({ save: mockSave })));

describe('/todos', () => {
  const mockThrow = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

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
      throw: mockThrow,
    };

    try {
      await write(payload);
    } catch (e) {
      expect(mockThrow).toBeCalledTimes(1);
    }
  });

  it('GET response 500 /', async () => {
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
      throw: mockThrow,
    };

    try {
      await list(payload);
    } catch (e) {
      expect(mockThrow).toBeCalledTimes(1);
    }
  });

  it('DELETE response 500 /:id', async () => {
    const payload = {
      params: {
        id: 'testId',
      },
      throw: mockThrow,
    };

    try {
      await remove(payload);
    } catch (e) {
      expect(mockThrow).toBeCalledTimes(1);
    }
  });

  it('DELETE response 500 /', async () => {
    const payload = {
      request: {
        body: {
          ids: ['testId'],
        },
      },
      throw: mockThrow,
    };

    try {
      await multipleRemove(payload);
    } catch (e) {
      expect(mockThrow).toBeCalledTimes(1);
    }
  });

  it('PATCH response 500 /:id', async () => {
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
      throw: mockThrow,
    };

    try {
      await update(payload);
    } catch (e) {
      expect(mockThrow).toBeCalledTimes(1);
    }
  });

  it('"getTodoById" response 500 /:id', async () => {
    const payload = {
      params: {
        id: mongoose.Types.ObjectId('testobjectid'),
      },
      throw: mockThrow,
    };
    const next = jest.fn();

    try {
      await getTodoById(payload, next);
    } catch (e) {
      expect(mockThrow).toBeCalledTimes(1);
      expect(next).toBeCalledTimes(1);
    }
  });

  it('"checkTodoByIds" response 500 /', async () => {
    const payload = {
      request: {
        body: {
          ids: [
            mongoose.Types.ObjectId('testobjectid'),
            mongoose.Types.ObjectId('testobjectid'),
          ],
        },
      },
      state: {
        user: {
          _id: 'test',
        },
      },
      throw: mockThrow,
    };
    const next = jest.fn();

    try {
      await checkTodoByIds(payload, next);
    } catch (e) {
      expect(mockThrow).toBeCalledTimes(1);
      expect(next).toBeCalledTimes(1);
    }
  });
});
