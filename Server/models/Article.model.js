import mongoose from "mongoose";

const schema = mongoose.Schema({
	title: String,
	body: String,
	imageUrl: String,
	publishedOn: Date,
	comments: Array,
});

export default mongoose.model("Article", schema);
