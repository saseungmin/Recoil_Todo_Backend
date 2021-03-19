import mongoose from 'mongoose';

import Todo from '../../models/todo';

import { validateTodo, validateUpdateTodo } from '../../utils/validate';

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

export const checkTodoByIds = async (ctx, next) => {
  const { user } = ctx.state;
  const { body: { ids } } = ctx.request;

  const isObjectId = ids.every((id) => ObjectId.isValid(id));

  if (!isObjectId) {
    ctx.status = 400;
    return;
  }

  try {
    const ownTodos = await Todo.find()
      .where('_id')
      .in(ids)
      .where('writer._id')
      .equals(user._id)
      .exec();

    if (ownTodos.length !== ids.length) {
      ctx.status = 404;
      return;
    }

    return next();
  } catch (error) {
    ctx.throw(500, error);
  }

  return next();
};

export const checkOwnTodo = (ctx, next) => {
  const { user, todo } = ctx.state;

  if (todo.writer._id.toString() !== user._id) {
    ctx.status = 403;
    return;
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

export const multipleRemove = async (ctx) => {
  const { body } = ctx.request;

  try {
    await Todo.deleteMany({ _id: body.ids }).exec();

    ctx.status = 204;
  } catch (error) {
    ctx.throw(500, error);
  }
};

export const update = async (ctx) => {
  const { id } = ctx.params;

  const { error, value } = validateUpdateTodo(ctx.request.body);

  if (error) {
    ctx.status = 400;
    ctx.body = error;
    return;
  }

  try {
    const todo = await Todo.findByIdAndUpdate(id, value, {
      new: true,
    }).exec();

    ctx.body = todo;
  } catch (error) {
    ctx.throw(500, error);
  }
};
