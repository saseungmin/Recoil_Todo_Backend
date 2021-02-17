import mongoose from 'mongoose';

import Todo from './todo';

describe('User model', () => {
  const todoData = {
    id: '1',
    task: 'test',
    isComplete: false,
    createdAt: new Date(),
  };

  let connection;

  beforeAll(async () => {
    connection = await mongoose.connect(global.__MONGO_URI__,
      { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true },
      (err) => {
        if (err) {
          process.exit(1);
        }
      });
  });

  afterAll(async () => {
    await connection.close();
  });

  it('create & save todo successfully', async () => {
    const validUser = new Todo(todoData);

    const {
      _id, id, task, isComplete, createdAt,
    } = await validUser.save();

    expect(_id).toBeDefined();
    expect(id).toBe(todoData.id);
    expect(task).toBe(todoData.task);
    expect(isComplete).toBe(todoData.isComplete);
    expect(createdAt).toBe(todoData.createdAt);
  });

  it('insert todo successfully, but the field does not defined in schema should be undefined', async () => {
    const userWithInvalidField = new Todo({
      id: '2',
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
