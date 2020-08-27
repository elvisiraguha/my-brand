import Comment from "../models/Comment.model.js";
import Response from "../helpers/responses.js";

class Comments {
  static create = async (req, res) => {
    const comment = new Comment({
      name: req.body.name,
      email: req.body.email,
      comment: req.body.comment,
      articleId: req.params.id,
    });

    const created = await comment.save();
    Response.success(res, 201, "Comment added successfully", created);
  };
}

export default Comments;
