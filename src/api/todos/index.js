import Router from 'koa-router';

import {
  write, list, remove, getTodoById, update, checkOwnTodo,
} from './todos.ctrl';

const todos = new Router();

todos.get('/', list);
todos.post('/', write);

const todo = new Router();

todo.delete('/', remove);
todo.patch('/', update);

todos.use('/:id', getTodoById, checkOwnTodo, todo.routes());

export default todos;
