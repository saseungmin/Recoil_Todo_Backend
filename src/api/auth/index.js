import Router from 'koa-router';

import { register, login } from './auth.ctrl';

const auth = new Router();

auth.post('/register', register);
auth.post('/login', login);

export default auth;
