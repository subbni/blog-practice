import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const jwtMiddleware = async (ctx, next) => {
	const token = ctx.cookies.get('access_token');
	if (!token) {
		return next();
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		ctx.state.user = {
			_id: decoded._id,
			username: decoded.username,
		};
		console.log(decoded);

		// 유효 기간이 3.5일 미만일시 재발급
		const now = Math.floor(Date.now() / 1000);
		if (decoded.exp - now < 60 * 60 * 24 * 3.5) {
			const user = await User.findById(decoded._id);
			const token = user.generateToken();
			ctx.cookies.set('access_token', token, {
				maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
				httpOnly: true,
			});
		}

		return next();
	} catch (e) {
		// 토큰 검증 실패
		return next();
	}
};

export default jwtMiddleware;
