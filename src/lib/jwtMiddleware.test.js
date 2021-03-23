import jwt from 'jsonwebtoken';

import jwtMiddleware from './jwtMiddleware';
import User from '../models/user';

describe('jwtMiddleware', () => {
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  context("Haven't error", () => {
    const decoded = ({ exp }) => jest.spyOn(jwt, 'verify').mockReturnValueOnce({
      _id: '1',
      id: '1',
      exp,
    });

    const findUser = jest.spyOn(User, 'findById').mockImplementationOnce(() => ({
      generateToken: () => 'token',
    }));

    it('When token is null', async () => {
      const ctx = {
        request: {
          headers: {
            authorization: 'access_token',
          },
        },
        state: {
          user: {},
          accessToken: '',
        },
      };

      await jwtMiddleware(ctx, next);

      expect(next).toBeCalledTimes(1);
    });
    it('When the token is less than two days left', async () => {
      const ctx = {
        request: {
          headers: {
            authorization: 'access_token',
          },
        },
        state: {
          user: {},
          accessToken: '',
        },
      };

      const jwtToken = decoded({ exp: 1000 * 60 * 60 * 24 * 2 });

      await jwtMiddleware(ctx, next);

      expect(jwtToken).toBeCalledWith('access_token', 'mock_jwt_secret');
      expect(findUser).toBeCalled();
      expect(ctx.state.accessToken).toBe('token');
      expect(next).toBeCalledTimes(1);
    });

    it('When there are more than two days left', async () => {
      const ctx = {
        request: {
          headers: {
            authorization: 'access_token',
          },
        },
        state: {
          user: {},
          accessToken: '',
        },
      };

      const jwtToken = decoded({ exp: Date.now() + (1000 * 60 * 60 * 24 * 5) });

      await jwtMiddleware(ctx, next);

      expect(jwtToken).toBeCalledWith('access_token', 'mock_jwt_secret');
      expect(findUser).not.toBeCalled();
      expect(ctx.state.accessToken).toBe('');
      expect(next).toBeCalledTimes(1);
    });
  });

  context('Have Error', () => {
    it('There is a server error.', async () => {
      const ctx = {
        request: {
          headers: {
            authorization: 'access_token',
          },
        },
        state: {
          user: {},
        },
      };

      try {
        await jwtMiddleware(ctx, next);
      } catch (error) {
        expect(next).toBeCalledTimes(1);
      }
    });
  });
});
