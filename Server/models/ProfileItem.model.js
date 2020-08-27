import mongoose from "mongoose";

const schema = mongoose.Schema({
	type: String,
	title: String,
	description: String,
	logoUrl: String,
	startDate: String,
	endDate: String,
	link: String,
});

export default mongoose.model("ProfileItem", schema);
