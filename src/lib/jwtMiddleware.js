import jwt from 'jsonwebtoken';

import User from '../models/user';

const jwtMiddleware = async (ctx, next) => {
  const { headers } = ctx.request;

  const token = headers.authorization;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    ctx.state.user = {
      _id: decoded._id,
      id: decoded.id,
    };

    const now = Math.floor(Date.now() / 1000);

    if (decoded.exp - now < 60 * 60 * 24 * 2) {
      const user = await User.findById(decoded._id);
      const token = user.generateToken();

      ctx.state.accessToken = token;
    }

    return next();
  } catch (error) {
    return next();
  }
};

export default jwtMiddleware;
