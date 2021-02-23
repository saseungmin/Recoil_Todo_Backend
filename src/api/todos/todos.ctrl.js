import mongoose from 'mongoose';

import Todo from '../../models/todo';

import { validateTodo } from '../../utils/validate';

const { ObjectId } = mongoose.Types;

export const getTodoById = async (ctx, next) => {
  const { id } = ctx.params;

  if (!ObjectId.isValid(id)) {
    ctx.status = 400;
    return;
  }

  try {
    const todo = await Todo.findById(id);
    if (!todo) {
      ctx.status = 404;
      return;
    }

    ctx.state.todo = todo;
    return next();
  } catch (error) {
    ctx.throw(500, error);
  }

  return next();
};

export const write = async (ctx) => {
  const { body } = ctx.request;

  const { error, value } = validateTodo(body);

  if (error) {
    ctx.status = 400;
    ctx.body = error;

    return;
  }

  const todo = new Todo({
    ...value,
    writer: ctx.state.user,
  });

  try {
    await todo.save();

    ctx.body = todo;
    ctx.status = 201;
  } catch (error) {
    ctx.throw(500, error);
  }
};

export const list = async (ctx) => {
  const { user } = ctx.state;

  try {
    const todos = await Todo.find()
      .where('writer._id')
      .equals(user._id)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    ctx.body = todos;
  } catch (error) {
    ctx.throw(500, error);
  }
};

export const remove = async (ctx) => {
  const { id } = ctx.params;

  try {
    await Todo.findByIdAndRemove(id).exec();

    ctx.status = 204;
  } catch (error) {
    ctx.throw(500, error);
  }
};
