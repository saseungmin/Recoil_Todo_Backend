import Koa from 'koa';

import Router from 'koa-router';
import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';

import { connectDatabase } from './lib/connect';
import api from './api';

require('dotenv').config();

const { MONGO_URI } = process.env;

connectDatabase(MONGO_URI);

const app = new Koa();
const router = new Router();

app.use(logger());

router.get('/', (ctx) => {
  ctx.body = 'Recoil_Todo_Backend';
});

router.use('/api', api.routes());

app.use(bodyParser());

app.use(router.routes());
app.use(router.allowedMethods());

export default app;
