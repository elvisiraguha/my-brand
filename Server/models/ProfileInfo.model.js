import mongoose from "mongoose";

const schema = mongoose.Schema({
	type: String,
	address: String,
	email: String,
	intro: String,
	phone: String,
	profileImageUrl: String,
	subTitle: String,
	title: String,
});

export default mongoose.model("ProfileInfo", schema);
