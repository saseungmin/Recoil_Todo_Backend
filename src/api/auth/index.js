import Router from 'koa-router';

import { register, login, check } from './auth.ctrl';

const auth = new Router();

auth.post('/register', register);
auth.post('/login', login);
auth.get('/check', check);

export default auth;
