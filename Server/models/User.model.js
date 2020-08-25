import mongoose from "mongoose";

const schema = mongoose.Schema({
	email: String,
	password: String,
	role: String,
});

export default mongoose.model("User", schema);
