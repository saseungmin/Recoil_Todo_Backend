import mongoose from 'mongoose';

import { callback, connectDatabase } from './connect';

jest.mock('mongoose');

describe('connectDatabase', () => {
  const MONGO_URL = 'localhost';

  const settingWithMongo = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  };

  const consoleLogSpyOn = jest.spyOn(console, 'log');

  const mongooseConnectSpyOn = (done) => (call) => jest
    .spyOn(mongoose, 'connect')
    .mockImplementationOnce((uris, options, callback) => {
      if (callback) {
        callback(call);
        done();
      }
      return Promise.resolve(mongoose);
    });

  beforeAll(() => {
    consoleLogSpyOn.mockClear();
  });

  afterAll(() => {
    consoleLogSpyOn.mockRestore();
  });

  it('should connect mongodb successfully', (done) => {
    const mongooseConnected = mongooseConnectSpyOn(done)();

    connectDatabase(MONGO_URL);

    expect(mongooseConnected).toBeCalledWith(
      MONGO_URL,
      settingWithMongo,
      callback,
    );
    expect(consoleLogSpyOn).toBeCalledWith('Connected to MongoDB');
  });

  it('connect database error', (done) => {
    const mongooseFailConnect = mongooseConnectSpyOn(done)(new Error('connect error'));

    connectDatabase(MONGO_URL);

    expect(mongooseFailConnect).toBeCalledWith(
      MONGO_URL,
      settingWithMongo,
      callback,
    );
    expect(consoleLogSpyOn).toBeCalledWith('connect error');
  });
});
