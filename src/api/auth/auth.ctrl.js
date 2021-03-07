import User from '../../models/user';

import { validateUser } from '../../utils/validate';
import cookieOptions from '../../utils/cookieOptions';

export const register = async (ctx) => {
  const { error, value } = validateUser(ctx.request.body);

  if (error) {
    ctx.status = 400;
    ctx.body = error;

    return;
  }

  const { id, password } = value;

  try {
    const exist = await User.findByUserId(id);

    if (exist) {
      ctx.status = 409;
      return;
    }

    const user = new User({ id });

    await user.setPassword(password);
    await user.save();

    ctx.body = user.serialize();

    const token = user.generateToken();

    ctx.cookies.set('access_token', token, cookieOptions);
    ctx.status = 201;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const login = async (ctx) => {
  const { id, password } = ctx.request.body;

  if (!id || !password) {
    ctx.status = 401;
    return;
  }

  try {
    const user = await User.findByUserId(id);

    if (!user) {
      ctx.status = 401;
      return;
    }

    const valid = await user.checkPassword(password);

    if (!valid) {
      ctx.status = 401;
      return;
    }

    ctx.body = user.serialize();

    const token = user.generateToken();

    ctx.cookies.set('access_token', token, cookieOptions);
  } catch (error) {
    ctx.throw(500, error);
  }
};

export const check = async (ctx) => {
  const { user } = ctx.state;

  if (!user) {
    ctx.status = 401;
    return;
  }

  ctx.body = user;
};

export const logout = async (ctx) => {
  ctx.cookies.set('access_token');
  ctx.status = 204;
};
