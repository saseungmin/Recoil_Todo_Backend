const deploymentCookieOptions = {
  maxAge: 1000 * 60 * 60 * 24 * 5,
  httpOnly: true,
};

const productionCookieOptions = {
  maxAge: 1000 * 60 * 60 * 24 * 5,
  httpOnly: true,
  sameSite: 'none',
  secure: true,
};

export const setCookieOptions = (env) => {
  if (env === 'production') {
    return productionCookieOptions;
  }

  return deploymentCookieOptions;
};

const cookieOptions = setCookieOptions(process.env.NODE_ENV);

export default cookieOptions;
