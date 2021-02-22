import Router from 'koa-router';

import { write, list } from './todos.ctrl';

const todos = new Router();

todos.get('/', list);
todos.post('/', write);

export default todos;
