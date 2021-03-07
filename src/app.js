import Koa from 'koa';

import Router from 'koa-router';
import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import { connectDatabase } from './utils/connect';
import jwtMiddleware from './lib/jwtMiddleware';

import api from './api';

require('dotenv').config();

const { MONGO_URI } = process.env;

connectDatabase(MONGO_URI);

const app = new Koa();
const router = new Router();

app.proxy = true;
app.use(logger());

router.get('/', (ctx) => {
  ctx.body = 'Recoil_Todo_Backend';
});

router.use('/api', api.routes());

app.use(cors({
  credentials: true,
}));

app.use(bodyParser());
app.use(jwtMiddleware);

app.use(router.routes());
app.use(router.allowedMethods());

export default app;
