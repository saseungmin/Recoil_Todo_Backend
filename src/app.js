import Koa from 'koa';

import Router from 'koa-router';
import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';

const app = new Koa();
const router = new Router();

app.use(logger());

router.get('/', (ctx) => {
  ctx.body = 'Hello World!';
});

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
