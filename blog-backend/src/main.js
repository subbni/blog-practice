import dotenv from 'dotenv';
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';

import api from './api/index.js';
import createFakeData from './createFakeData.js';
import jwtMiddleware from './lib/jwtMiddleware.js';

dotenv.config();

const { PORT, MONGO_URI } = process.env;

mongoose
	.connect(MONGO_URI)
	.then(() => {
		console.log('Connected to MongoDB');
	})
	.catch((e) => {
		console.error(e);
	});

const app = new Koa();
const router = new Router();

router.use('/api', api.routes()); // api 라우트 적용

app.use(bodyParser()); // 반드시 라우터 적용 전에 bodyParser 적용
app.use(jwtMiddleware);

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

const port = PORT || 4000;
app.listen(port, () => {
	console.log('listening to port %d', port);
});
