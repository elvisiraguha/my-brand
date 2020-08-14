import Joi from "joi";
import Article from "../models/Article.model.js";
import Responses from "../helpers/responses";

class Articles {
  static newArticle = async (req, res, next) => {
    const schema = Joi.object({
      title: Joi.string().trim().required().min(10),
      content: Joi.string().trim().required().min(20),
      imageUrl: Joi.string().trim().required().min(6),
    });

    const { value, error } = schema.validate(req.body);

    if (error) {
      return Responses.error(res, 400, error.details[0].message);
    }

    const exists = await Article.findOne({ title: value.title });

    if (exists) {
      return Responses.error(
        res,
        409,
        `Article with ${exists.title} title alread exists`
      );
    } else {
      next();
    }
  };

  static update = async (req, res, next) => {
    try {
      const exists = await Article.findOne({ _id: req.params.id });

      if (!exists) {
        return Responses.error(
          res,
          404,
          "The article with given id does not exist"
        );
      }
    } catch (error) {
      return Responses.error(res, 500, "Internal Server Error");
    }

    if (!req.body.title && !req.body.content && !req.body.imageUrl) {
      return Responses.error(res, 400, "You must provide the updated contents");
    }
    next();
  };

  static validId = async (req, res, next) => {
    const id = req.params.id;

    if (id.length === 24) {
      next();
    } else {
      return Responses.error(res, 404, "The provided article id is incorrect.");
    }
  };
}

export default Articles;
