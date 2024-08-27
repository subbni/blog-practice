import Joi from 'joi';
import User from '../../models/user.js';

/*
  POST /api/register
  {
    username : 'subbni',
    password: 'password123'
  }
 */
export const register = async (ctx) => {
	// request body 검증
	const schema = Joi.object().keys({
		username: Joi.string().alphanum().min(3).max(20).required(),
		password: Joi.string().required(),
	});
	const result = schema.validate(ctx.request.body);
	if (result.error) {
		ctx.status = 400;
		ctx.body = result.error;
		return;
	}

	// 회원가입 처리
	const { username, password } = ctx.request.body;
	try {
		// 이름 중복 확인
		const exists = await User.findByUsername(username);
		if (exists) {
			ctx.status = 409; // Conflict
			return;
		}

		const user = new User({
			username,
		});
		await user.setPassword(password); // 패스워드 암호화 및 설정
		await user.save(); // db 저장

		ctx.body = user.serialize();

		// jwt 등록
		const token = user.generateToken();
		ctx.cookies.set('access_token', token, {
			maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
			httpOnly: true,
		});
	} catch (e) {
		ctx.throw(500, e);
	}
};

export const login = async (ctx) => {
	const { username, password } = ctx.request.body;

	if (!username || !password) {
		ctx.status = 401; // Unauthorized
		return;
	}

	// 로그인 처리
	try {
		const user = await User.findByUsername(username);
		if (!user) {
			ctx.status = 401;
			return;
		}
		const valid = await user.checkPassword(password);
		if (!valid) {
			ctx.status = 401;
			return;
		}
		ctx.body = user.serialize();

		const token = user.generateToken();
		ctx.cookies.set('access_token', token, {
			maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
			httpOnly: true,
		});
	} catch (e) {
		ctx.throw(500, e);
	}
};

/*
  GET /api/auth/check
 */
export const check = async (ctx) => {
	const { user } = ctx.state;
	if (!user) {
		// 로그인 중 X
		ctx.status = 401; // Unauthorized
		return;
	}
	ctx.body = user;
};

/*
  POST /api/auth/logout
 */
export const logout = async (ctx) => {
	ctx.cookies.set('access_token');
	ctx.status = 204;
};
