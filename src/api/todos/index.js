import Router from 'koa-router';

import {
  write, list, remove, getTodoById,
} from './todos.ctrl';

const todos = new Router();

todos.get('/', list);
todos.post('/', write);

const todo = new Router();

todo.delete('/', remove);

todos.use('/:id', getTodoById, todo.routes());

export default todos;
