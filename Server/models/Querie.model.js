import mongoose from "mongoose";

const schema = mongoose.Schema({
	name: String,
	email: String,
	subject: String,
	message: String,
});

export default mongoose.model("Querie", schema);
