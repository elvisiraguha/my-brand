import Joi from "joi";
import Article from "../models/Article.model.js";
import Responses from "../helpers/responses";

class Queries {
  static validate = async (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string().trim().required().min(4),
      email: Joi.string().trim().required().min(8),
      subject: Joi.string().trim().required().min(6),
      message: Joi.string().trim().required().min(10),
    });

    const { value, error } = schema.validate(req.body);

    if (error) {
      return Responses.error(res, 400, error.details[0].message);
    } else {
      next();
    }
  };
}

export default Queries;
