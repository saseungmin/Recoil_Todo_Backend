import Router from 'koa-router';

import { register } from './auth.ctrl';

const auth = new Router();

auth.post('/register', register);

export default auth;
