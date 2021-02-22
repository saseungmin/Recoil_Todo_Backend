import Router from 'koa-router';

import { write } from './todos.ctrl';

const todos = new Router();

todos.post('/', write);

export default todos;
