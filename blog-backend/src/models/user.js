import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserSchema = new Schema({
	username: String,
	hashedPassword: String,
});

UserSchema.methods.setPassword = async function (password) {
	const hash = await bcrypt.hash(password, 10);
	this.hashedPassword = hash;
};

UserSchema.methods.checkPassword = async function (password) {
	const result = await bcrypt.compare(password, this.hashedPassword);
	return result; // true or false
};

UserSchema.methods.serialize = function () {
	const data = this.toJSON();
	delete data.hashedPassword;
	return data;
};

UserSchema.methods.generateToken = function () {
	const token = jwt.sign(
		{
			// 토큰 안에 넣고 싶은 정보
			_id: this._id,
			username: this.username,
		},
		// JWT 암호
		process.env.JWT_SECRET,
		{
			// 유효 기간
			expiresIn: '7d',
		},
	);
	return token;
};

UserSchema.statics.findByUsername = function (username) {
	return this.findOne({ username }); // this -> User 모델을 가리킴
};

const User = mongoose.model('User', UserSchema);
export default User;
