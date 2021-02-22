import mongoose from 'mongoose';

import Todo from './todo';

describe('User model', () => {
  const todoData = {
    writer: {
      _id: mongoose.Types.ObjectId('mockobjectid'),
      id: 'idd',
    },
    task: 'test',
    isComplete: false,
    createdAt: new Date(),
  };

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

  it('create & save todo successfully', async () => {
    const validUser = new Todo(todoData);

    const {
      _id, task, isComplete, createdAt, writer,
    } = await validUser.save();

    expect(_id).toBeDefined();
    expect(writer).toEqual(todoData.writer);
    expect(task).toBe(todoData.task);
    expect(isComplete).toBe(todoData.isComplete);
    expect(createdAt).toBe(todoData.createdAt);
  });

  it('insert todo successfully, but the field does not defined in schema should be undefined', async () => {
    const userWithInvalidField = new Todo({
      task: 'test123',
      createdAt: new Date(),
      name: 'testname',
    });

    const { _id, name } = await userWithInvalidField.save();
    expect(_id).toBeDefined();
    expect(name).toBeUndefined();
  });

  it('create todo without required field should failed', async () => {
    const userWithoutRequiredField = new Todo({ id: 'test' });
    try {
      await userWithoutRequiredField.save();
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error.errors.task).toBeDefined();
    }
  });
});
