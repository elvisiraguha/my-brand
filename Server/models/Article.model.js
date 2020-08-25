import mongoose from "mongoose";

const schema = mongoose.Schema({
	title: String,
	body: String,
	imageUrl: String,
	publishedOn: Date,
});

export default mongoose.model("Article", schema);
