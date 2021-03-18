import { validateUser, validateTodo, validateUpdateTodo } from './validate';

describe('validateUser', () => {
  context('Have Success', () => {
    const user = {
      id: 'test',
      password: 'test123',
    };
    it('Successful validation of user schema', () => {
      const { value, error } = validateUser(user);

      expect(value).toEqual(user);
      expect(error).toBeUndefined();
    });
  });

  context('Have Error', () => {
    const user = {
      id: '',
      password: 'test123',
    };
    it('Failure validation of user schema', () => {
      const { value, error } = validateUser(user);

      expect(value).toEqual(user);
      expect(error.message).toEqual('빈 값이 존재합니다.');
    });
  });
});

describe('validateTodo', () => {
  const todo = {
    task: 'some task',
    isComplete: false,
  };

  context('Successful validation', () => {
    it('todo schema is return value', () => {
      const { value, error } = validateTodo(todo);

      expect(value).toEqual(todo);
      expect(error).toBeUndefined();
    });
  });

  context('Validation failure', () => {
    it('When task is empty', () => {
      const todo = {
        task: '',
        isComplete: false,
      };

      const { error } = validateTodo(todo);

      expect(error.message).toBe('"task" is not allowed to be empty');
    });

    it('When task field is not required', () => {
      const todo = {
        isComplete: 'false',
      };

      const { error } = validateTodo(todo);

      expect(error.message).toBe('"task" is required');
    });
  });
});

describe('validateUpdateTodo', () => {
  const todo = {
    task: 'some task',
  };

  context('Successful validation', () => {
    it('todo schema is return value', () => {
      const { value, error } = validateUpdateTodo(todo);

      expect(value).toEqual(todo);
      expect(error).toBeUndefined();
    });
  });

  context('Validation failure', () => {
    it("When the object's key value is not allowed", () => {
      const todo = {
        id: 'test',
      };

      const { error } = validateUpdateTodo(todo);

      expect(error.message).toBe('"id" is not allowed');
    });
  });
});
