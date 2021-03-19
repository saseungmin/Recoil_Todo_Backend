import request from 'supertest';

import mongoose from 'mongoose';

import app from './app';

const { ObjectId } = mongoose.Types;

describe('app', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__,
      { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true },
      (err) => {
        if (err) {
          process.exit(1);
        }
      });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  const setSessionCookie = async (payload) => {
    const response = await request(app.callback())
      .post('/api/auth/login')
      .send(payload);

    return response.header['set-cookie'][0]
      .split(',')
      .map((cookie) => cookie.split(';')[0]);
  };

  const insertTodo = (cookie) => async (payload) => {
    const { body } = await request(app.callback())
      .post('/api/todos')
      .set('Cookie', cookie)
      .send(payload);
    return body;
  };

  it('response 200 and "Recoil_Todo_Backend"', async () => {
    const { status, text } = await request(app.callback()).get('/');

    expect(status).toBe(200);
    expect(text).toBe('Recoil_Todo_Backend');
  });

  describe('POST /api/auth/register', () => {
    context("Isn't Error", () => {
      it('Response is Success Status 201', async () => {
        const payload = {
          id: 'seugmin',
          password: 'test123',
        };
        const { status, body } = await request(app.callback())
          .post('/api/auth/register')
          .send(payload);

        await request(app.callback())
          .post('/api/auth/register')
          .send({ id: 'seungmin', password: 'test123' });

        expect(status).toBe(201);
        expect(body).toHaveProperty('id', payload.id);
      });
    });

    context('Response is Error Status', () => {
      it('When the password does not exist response 400', async () => {
        const payload = {
          id: 'seugmin',
        };

        const { body, status } = await request(app.callback())
          .post('/api/auth/register')
          .send(payload);

        expect(status).toBe(400);
        expect(body.details[0]).toHaveProperty('message', '"password" is required');
      });

      it('When duplicate ID exists response 409', async () => {
        const payload = {
          id: 'seugmin',
          password: '123',
        };

        const { status } = await request(app.callback())
          .post('/api/auth/register')
          .send(payload);

        expect(status).toBe(409);
      });
    });
  });

  describe('POST /api/auth/login', () => {
    context("Isn't Error status", () => {
      const payload = {
        id: 'seugmin',
        password: 'test123',
      };

      it('Response is Success Status response 200', async () => {
        const { status, body } = await request(app.callback())
          .post('/api/auth/login')
          .send(payload);

        expect(status).toBe(200);
        expect(body).toHaveProperty('id', 'seugmin');
      });
    });

    context('Response is Error Status', () => {
      it('When the password and id does not exist response 401', async () => {
        const payload = {
          id: 'seugmin',
        };

        const { status } = await request(app.callback())
          .post('/api/auth/login')
          .send(payload);

        expect(status).toBe(401);
      });

      it('When the user ID does not exist response 401', async () => {
        const payload = {
          id: 'notFound',
          password: '123',
        };

        const { status } = await request(app.callback())
          .post('/api/auth/login')
          .send(payload);

        expect(status).toBe(401);
      });

      it('When passwords do not match response 401', async () => {
        const payload = {
          id: 'seugmin',
          password: '123',
        };

        const { status } = await request(app.callback())
          .post('/api/auth/login')
          .send(payload);

        expect(status).toBe(401);
      });
    });
  });

  describe('GET /api/auth/check', () => {
    context("Isn't Error status", () => {
      let sessionCookie;

      const payload = {
        id: 'seugmin',
        password: 'test123',
      };

      beforeEach(async () => {
        sessionCookie = await setSessionCookie(payload);
      });

      it('Response is Success response user status', async () => {
        const { status, body } = await request(app.callback())
          .get('/api/auth/check')
          .set('Cookie', sessionCookie);

        expect(status).toBe(200);
        expect(body).toHaveProperty('id', 'seugmin');
      });
    });

    context('Response is Error Status', () => {
      it('When not found user state response 401', async () => {
        const { status } = await request(app.callback())
          .get('/api/auth/check');

        expect(status).toBe(401);
      });
    });
  });

  describe('POST /api/auth/logout', () => {
    let sessionCookie;

    const payload = {
      id: 'seugmin',
      password: 'test123',
    };

    beforeEach(async () => {
      sessionCookie = await setSessionCookie(payload);
    });

    it('When logout success, delete cookie Response 204', async () => {
      const { status } = await request(app.callback())
        .post('/api/auth/logout')
        .set('Cookie', sessionCookie);

      expect(status).toBe(204);
    });
  });

  describe('POST /api/todos', () => {
    let sessionCookie;

    const payload = {
      id: 'seugmin',
      password: 'test123',
    };

    beforeEach(async () => {
      sessionCookie = await setSessionCookie(payload);
    });

    context('validation fails', () => {
      it('When task field is empty Response 400', async () => {
        const payload = {
          task: '',
          isComplete: false,
        };

        const { status, body } = await request(app.callback())
          .post('/api/todos')
          .set('Cookie', sessionCookie)
          .send(payload);

        expect(status).toBe(400);
        expect(body.details[0].message).toBe('"task" is not allowed to be empty');
      });
    });

    context('validation success', () => {
      it('When successful todo save, Response 201', async () => {
        const payload = {
          task: 'task',
          isComplete: false,
        };

        const { status, body } = await request(app.callback())
          .post('/api/todos')
          .set('Cookie', sessionCookie)
          .send(payload);

        expect(status).toBe(201);
        expect(body).toHaveProperty('task', payload.task);
      });
    });
  });

  describe('GET /api/todos', () => {
    let sessionCookie;

    const payload = {
      id: 'seugmin',
      password: 'test123',
    };

    beforeEach(async () => {
      sessionCookie = await setSessionCookie(payload);

      const todo = {
        task: 'task1',
        isComplete: false,
      };

      await insertTodo(sessionCookie)(todo);
    });

    it('When successful load to todos, Response 200', async () => {
      const { status, body } = await request(app.callback())
        .get('/api/todos')
        .set('Cookie', sessionCookie);

      expect(status).toBe(200);
      expect(body[0]).toHaveProperty('task', 'task1');
    });
  });

  describe('DELETE /api/todos/:id', () => {
    let sessionCookie;
    let response;

    const payload = {
      id: 'seugmin',
      password: 'test123',
    };

    beforeEach(async () => {
      sessionCookie = await setSessionCookie(payload);

      const todo = {
        task: 'task2',
        isComplete: false,
      };

      response = await insertTodo(sessionCookie)(todo);
    });

    context('Is Error status', () => {
      it('When the objectId is invalid, Response 400', async () => {
        const { status } = await request(app.callback())
          .delete('/api/todos/1')
          .set('Cookie', sessionCookie);

        expect(status).toBe(400);
      });

      it("Couldn't find todo with that ObjectId, Response 404", async () => {
        const { status } = await request(app.callback())
          .delete(`/api/todos/${ObjectId('mockobjectid')}`)
          .set('Cookie', sessionCookie);

        expect(status).toBe(404);
      });
    });

    context('Is Successful Status', () => {
      it('Remove Todo, Response 204', async () => {
        const { status } = await request(app.callback())
          .delete(`/api/todos/${response._id}`)
          .set('Cookie', sessionCookie);

        expect(status).toBe(204);
      });
    });
  });

  describe('DELETE /api/todos/', () => {
    let sessionCookie;
    let response;

    const payload = (ids) => ({
      ids,
    });

    beforeEach(async () => {
      const payload = {
        id: 'seugmin',
        password: 'test123',
      };

      sessionCookie = await setSessionCookie(payload);

      const todo = {
        task: 'task2',
        isComplete: false,
      };

      response = await insertTodo(sessionCookie)(todo);
    });

    context('Is Error status', () => {
      it('When the objectId is invalid, Response 400', async () => {
        const { status } = await request(app.callback())
          .delete('/api/todos')
          .set('Cookie', sessionCookie)
          .send(payload(['3']));

        expect(status).toBe(400);
      });

      it("Couldn't find onw todos with that ObjectId, Response 404", async () => {
        const { status } = await request(app.callback())
          .delete('/api/todos/')
          .set('Cookie', sessionCookie)
          .send(payload([ObjectId('mockobjectid')]));

        expect(status).toBe(404);
      });
    });

    context('Is Successful Status', () => {
      it('Remove Todos, Response 204', async () => {
        const { status } = await request(app.callback())
          .delete('/api/todos/')
          .set('Cookie', sessionCookie)
          .send(payload([response._id]));

        expect(status).toBe(204);
      });
    });
  });

  describe('PATCH /api/todos/:id', () => {
    let sessionCookie;
    let response;

    beforeEach(async () => {
      const payload = {
        id: 'seugmin',
        password: 'test123',
      };

      sessionCookie = await setSessionCookie(payload);

      const todo = {
        task: 'task2',
        isComplete: false,
      };

      response = await insertTodo(sessionCookie)(todo);
    });

    context('Is Error status', () => {
      const payload = {
        task: '',
      };

      it('When the todo contents is invalid, Response 400', async () => {
        const { body, status } = await request(app.callback())
          .patch(`/api/todos/${response._id}`)
          .send(payload)
          .set('Cookie', sessionCookie);

        expect(status).toBe(400);
        expect(body.details[0].message).toBe('"task" is not allowed to be empty');
      });

      it('When it is not my Todo information, Response 403', async () => {
        const user = {
          id: 'seungmin',
          password: 'test123',
        };

        const mockCookie = await setSessionCookie(user);
        const { status } = await request(app.callback())
          .patch(`/api/todos/${response._id}`)
          .send({ task: 'task1' })
          .set('Cookie', mockCookie);

        expect(status).toBe(403);
      });
    });

    context('Is Successful Status', () => {
      const payload = {
        task: 'task1',
        isComplete: true,
      };

      it('Update Todo, Response 200', async () => {
        const { status, body } = await request(app.callback())
          .patch(`/api/todos/${response._id}`)
          .send(payload)
          .set('Cookie', sessionCookie);

        expect(status).toBe(200);
        expect(body.isComplete).toBe(payload.isComplete);
        expect(body.task).toBe(payload.task);
      });
    });
  });
});
