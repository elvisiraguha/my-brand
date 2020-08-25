import Joi from "joi";
import Comment from "../models/Comment.model.js";
import Article from "../models/Article.model.js";
import Responses from "../helpers/responses";

class Comments {
  static validate = async (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string().trim().required().min(4),
      email: Joi.string().trim().required().min(8),
      comment: Joi.string().trim().required().min(10),
    });

    const { value, error } = schema.validate(req.body);

    if (error) {
      return Responses.error(res, 400, error.details[0].message);
    } else {
      next();
    }
  };

  static existingArticle = async (req, res, next) => {
    try {
      const exists = await Article.findOne({ _id: req.params.id });

      if (!exists) {
        return Responses.error(
          res,
          404,
          "The article with given id does not exist"
        );
      }
      next();
    } catch (error) {
      return Responses.error(res, 500, "Internal Server Error");
    }
  };
}

export default Comments;
