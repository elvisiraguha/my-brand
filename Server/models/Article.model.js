import mongoose from "mongoose";

const article = mongoose.Schema({
  title: String,
  body: String,
  imageUrl: String,
  publishedOn: Date,
});

export default mongoose.model("Article", article);
