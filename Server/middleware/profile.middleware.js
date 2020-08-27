import Joi from "joi";
import ProfileItem from "../models/ProfileItem.model.js";
import Responses from "../helpers/responses";

class Profile {
  static validateItem = async (req, res, next) => {
    const schema = Joi.object({
      title: Joi.string().trim().min(2),
      logoUrl: Joi.string().trim().min(6),
      description: Joi.string().trim().min(10),
      link: Joi.string().trim().min(6),
      startDate: Joi.string().trim().min(6),
      endDate: Joi.string().trim().min(6),
    });

    const { value, error } = schema.validate(req.body);

    if (error) {
      return Responses.error(res, 400, error.details[0].message);
    } else {
      next();
    }
  };

  static updateInfo = async (req, res, next) => {
    const schema = Joi.object({
      address: Joi.string().trim().min(4),
      email: Joi.string().trim().email().min(6),
      intro: Joi.string().trim().min(6),
      phone: Joi.string().trim().min(10),
      profileImageUrl: Joi.string().trim().min(10),
      subTitle: Joi.string().trim().min(10),
      title: Joi.string().trim().min(4),
    });

    const { value, error } = schema.validate(req.body);

    if (error) {
      return Responses.error(res, 400, error.details[0].message);
    } else {
      next();
    }
  };

  static isItemExist = async (req, res, next) => {
    const id = req.params.id;

    try {
      const exists = await ProfileItem.findOne({ _id: req.params.id });

      if (!exists) {
        return Responses.error(
          res,
          404,
          "The item with given id does not exist"
        );
      }
      next();
    } catch (error) {
      return Responses.error(res, 500, "Internal Server Error");
    }
  };
}

export default Profile;
