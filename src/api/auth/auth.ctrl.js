import User from '../../models/user';

import { validateUser } from '../../utils/validate';

export const register = async (ctx) => {
  const { error } = validateUser(ctx.request.body);

  if (error) {
    ctx.status = 400;
    ctx.body = error;

    return;
  }

  const { id, password } = ctx.request.body;

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

    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 5,
      httpOnly: true,
    });
    ctx.status = 201;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const temp = [];
