import mongoose from 'mongoose';

import User from './user';

describe('User model', () => {
  const userData = {
    id: 'test',
    hashedPassword: 'test123',
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

  it('should findByUserId statics method exist id', async () => {
    const { id } = await User.findByUserId('test');

    expect(id).toBe('test');
  });

  it('should setPassword method Convert to hash value and save', async () => {
    const noneHashedPassword = 'test123';

    const user = new User({ id: 'test11' });

    await user.setPassword(noneHashedPassword);

    const { hashedPassword } = await user.save();

    expect(hashedPassword).not.toBe(noneHashedPassword);
  });

  it('should the hashed password is deleted and returned', async () => {
    const user = new User({ id: 'test123', hashedPassword: '123' });

    const { hashedPassword, id } = await user.serialize();

    expect(id).toBe('test123');
    expect(hashedPassword).toBeUndefined();
  });

  it('should sign to jsonwebtoken', async () => {
    const user = new User({ id: '1', hashedPassword: '123' });

    const token = await user.generateToken();

    expect(token).toBeDefined();
  });

  it('check for correct password', async () => {
    const user = new User({ id: '1', hashedPassword: '123' });

    const result = await user.checkPassword('123');

    expect(result).toBeFalsy();
  });
});
