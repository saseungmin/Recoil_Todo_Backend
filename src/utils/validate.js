import Joi from 'joi';

import { userErrorHandle } from './errorHandle';

export const validateUser = (value) => {
  const schema = Joi.object().keys({
    id: Joi.string()
      .alphanum()
      .min(3)
      .max(20)
      .required()
      .error((errors) => {
        errors.forEach(userErrorHandle);

        return errors;
      }),
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      .required()
      .error((errors) => {
        errors.forEach(userErrorHandle);

        return errors;
      }),
  });

  return schema.validate(value);
};

export const validateTodo = (value) => {
  const schema = Joi.object().keys({
    task: Joi
      .string()
      .required(),
    isComplete: Joi
      .boolean()
      .default(false),
  });

  return schema.validate(value);
};
