import mongoose from 'mongoose';

const { Schema } = mongoose;

const PostSchema = new Schema({
	title: String,
	body: String,
	tags: [String],
	publishedDate: {
		type: Date,
		default: Date.now,
	},
	user: {
		_id: mongoose.Types.ObjectId,
		username: String,
	},
});

/* model(스키마 이름, 스키마 객체)
스키마이름+'s'의 형태로 컬렉션이 생성된다. */
const Post = mongoose.model('Post', PostSchema);
export default Post;
