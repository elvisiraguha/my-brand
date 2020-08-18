import mongoose from "mongoose";

const user = mongoose.Schema({
  email: String,
  password: String,
  role: String,
});

export default mongoose.model("User", user);
