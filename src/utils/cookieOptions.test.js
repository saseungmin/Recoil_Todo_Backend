import { setCookieOptions } from './cookieOptions';

describe('setCookieOptions', () => {
  it('when env is development', () => {
    const cookieOptions = setCookieOptions('development');

    expect(cookieOptions).toEqual({
      maxAge: 1000 * 60 * 60 * 24 * 5,
      httpOnly: true,
    });
  });

  it('when env is production', () => {
    const cookieOptions = setCookieOptions('production');

    expect(cookieOptions).toEqual({
      maxAge: 1000 * 60 * 60 * 24 * 5,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
  });
});
