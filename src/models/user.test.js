import mongoose from 'mongoose';

import User from './user';

describe('User model', () => {
  const userData = {
    id: 'test',
    hashedPassword: 'test123',
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

  it('create & save user successfully', async () => {
    const validUser = new User(userData);

    const {
      _id, id, hashedPassword, createdAt,
    } = await validUser.save();

    expect(_id).toBeDefined();
    expect(id).toBe(userData.id);
    expect(hashedPassword).toBe(userData.hashedPassword);
    expect(createdAt).toBe(userData.createdAt);
  });

  it('insert user successfully, but the field does not defined in schema should be undefined', async () => {
    const userWithInvalidField = new User({
      id: 'test1',
      hashedPassword: 'test123',
      createdAt: new Date(),
      name: 'testname',
    });

    const { _id, name } = await userWithInvalidField.save();
    expect(_id).toBeDefined();
    expect(name).toBeUndefined();
  });

  it('create user without required field should failed', async () => {
    const userWithoutRequiredField = new User({ id: 'test' });
    try {
      await userWithoutRequiredField.save();
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error.errors.hashedPassword).toBeDefined();
    }
  });
});
