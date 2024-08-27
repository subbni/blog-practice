import Post from '../../models/post.js';
import mongoose from 'mongoose';
import Joi from 'joi';

const { ObjectId } = mongoose.Types;
export const getPostById = async (ctx, next) => {
	const { id } = ctx.params;
	if (!ObjectId.isValid(id)) {
		ctx.status = 400;
		return;
	}
	try {
		const post = await Post.findById(id); // .exec() ??
		if (!post) {
			ctx.status = 404;
			return;
		}
		ctx.state.post = post;
		return next();
	} catch (e) {
		ctx.throw(500, e);
	}
};

export const checkOwnPost = (ctx, next) => {
	const { user, post } = ctx.state;
	if (post.user._id.toString() !== user._id) {
		ctx.status = 403;
		return;
	}
	return next();
};

export const write = async (ctx) => {
	const schema = Joi.object().keys({
		title: Joi.string().required(),
		body: Joi.string().required(),
		tags: Joi.array().items(Joi.string()).required(),
	});

	const result = schema.validate(ctx.request.body);
	if (result.error) {
		ctx.status = 400; // Bad Request
		ctx.body = result.error;
		return;
	}

	const { title, body, tags } = ctx.request.body;
	const post = new Post({
		title,
		body,
		tags,
		user: ctx.state.user,
	});
	try {
		await post.save(); // db에 저장
		ctx.body = post;
	} catch (e) {
		ctx.throw(500, e);
	}
};

/*
	GET /api/post?username=&tag=&page=
 */
export const list = async (ctx) => {
	// 숫자로 변환
	const page = parseInt(ctx.query.page || '1', 10);

	if (page < 1) {
		ctx.status = 400;
		return;
	}

	const { tag, username } = ctx.query;
	const query = {
		...(username ? { 'user.username': username } : {}),
		...(tag ? { tags: tag } : {}),
	};

	try {
		const posts = await Post.find(query)
			.sort({ _id: -1 })
			.limit(10)
			.skip((page - 1) * 10)
			.exec();
		const postCount = await Post.countDocuments(query).exec();
		ctx.set('Last-Page', Math.ceil(postCount / 10));
		ctx.body = posts
			.map((post) => post.toJSON())
			.map((post) => ({
				...post,
				body:
					post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`,
			}));
	} catch (e) {
		ctx.throw(500, e);
	}
};

export const read = async (ctx) => {
	ctx.body = ctx.state.post;
};

export const remove = async (ctx) => {
	const { id } = ctx.params;
	try {
		await Post.findByIdAndDelete(id).exec();
		ctx.status = 204; // No Content : 실행 성공, 응답할 데이터는 없음
	} catch (e) {
		ctx.throw(500, e);
	}
};

/*
	PATCH /api/posts/:id
	{
		title : '수정',
		body : '수정 내용',
		tags : ['수정 태그1', '수정 태그2']
	}
*/
export const update = async (ctx) => {
	const { id } = ctx.params;
	const schema = Joi.object().keys({
		title: Joi.string(),
		body: Joi.string(),
		tags: Joi.array().items(Joi.string()),
	});

	const result = schema.validate(ctx.request.body);
	if (result.error) {
		ctx.status = 400;
		ctx.body = result.error;
		return;
	}

	try {
		const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
			new: true, // 업데이트된 데이터를 반환, false일 경우 업데이트 전 데이터를 반환
		}).exec();
		if (!post) {
			ctx.status = 404;
			return;
		}
		ctx.body = post;
	} catch (e) {
		ctx.throw(500, e);
	}
};
