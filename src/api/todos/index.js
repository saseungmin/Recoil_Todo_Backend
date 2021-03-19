import Router from 'koa-router';

import {
  write, list, remove, getTodoById, update, checkOwnTodo, multipleRemove, checkTodoByIds,
} from './todos.ctrl';

const todos = new Router();

todos.get('/', list);
todos.post('/', write);
todos.delete('/', checkTodoByIds, multipleRemove);

const todo = new Router();

todo.delete('/', remove);
todo.patch('/', update);

todos.use('/:id', getTodoById, checkOwnTodo, todo.routes());

export default todos;
