import mongoose from "mongoose";

const schema = mongoose.Schema({
	name: String,
	email: String,
	comment: String,
	articleId: String,
});

export default mongoose.model("Comment", schema);
