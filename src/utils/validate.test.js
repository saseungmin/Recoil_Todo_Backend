import { validateUser } from './validate';

describe('validateUser', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const user = {
    id: 'test',
    password: 'test123',
  };

  it('Successful validation of user schema', () => {
    const { value, error } = validateUser(user);

    expect(value).toEqual(user);
    expect(error).toBeUndefined();
  });
});
