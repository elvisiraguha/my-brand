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

    comment
      .save()
      .then((comment) => {
        Response.success(res, 201, "Comment added successfully", comment);
      })
      .catch((err) => Response.error(res, 500, "Internal Server Error"));
  };
}

export default Comments;
