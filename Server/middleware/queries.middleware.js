import Joi from "joi";
import Query from "../models/Query.model.js";
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

  static update = async (req, res, next) => {
    try {
      const exists = await Query.findOne({ _id: req.params.id });

      if (!exists) {
        return Responses.error(
          res,
          404,
          "The querie with given id does not exist"
        );
      }
    } catch (error) {
      return Responses.error(res, 500, "Internal Server Error");
    }

    const schema = Joi.object({
      read: Joi.required().valid(true, false),
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
