import Router from 'koa-router';

import checkLoggedIn from '../lib/checkLoggedIn';

import auth from './auth';
import todos from './todos';

const api = new Router();

api.use('/auth', auth.routes());
api.use('/todos', checkLoggedIn, todos.routes());

export default api;
