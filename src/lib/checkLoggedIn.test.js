import checkLoggedIn from './checkLoggedIn';

describe('checkLoggedIn', () => {
  const next = jest.fn();

  beforeEach(() => {
    next.mockClear();
  });
  context('Is error', () => {
    it('response 401 status', () => {
      const ctx = {
        state: {},
      };

      checkLoggedIn(ctx, next);

      expect(next).not.toBeCalled();
    });
  });

  context("Isn't error", () => {
    it('return call next', () => {
      const ctx = {
        state: {
          user: 'mock',
        },
      };

      checkLoggedIn(ctx, next);

      expect(next).toBeCalled();
    });
  });
});
