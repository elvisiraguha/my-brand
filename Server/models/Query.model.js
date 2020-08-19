import mongoose from "mongoose";

const schema = mongoose.Schema({
	name: String,
	email: String,
	subject: String,
	message: String,
    read: Boolean
});

export default mongoose.model("Query", schema);
