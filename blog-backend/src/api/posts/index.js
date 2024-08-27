import Router from 'koa-router';
import * as postsCtrl from './posts.ctrl.js';
import checkLoggedIn from '../../lib/checkLoggedIn.js';

const posts = new Router();

posts.get('/', postsCtrl.list);
posts.post('/', checkLoggedIn, postsCtrl.write);
posts.get('/:id', postsCtrl.getPostById, postsCtrl.read);
posts.delete(
	'/:id',
	checkLoggedIn,
	postsCtrl.getPostById,
	postsCtrl.checkOwnPost,
	postsCtrl.remove,
);
posts.patch(
	'/:id',
	checkLoggedIn,
	postsCtrl.getPostById,
	postsCtrl.checkOwnPost,
	postsCtrl.update,
);

export default posts;
