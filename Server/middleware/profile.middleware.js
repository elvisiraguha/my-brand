import Joi from "joi";
import ProfileItem from "../models/ProfileItem.model.js";
import Responses from "../helpers/responses";

class Profile {
  static newSkill = async (req, res, next) => {
    const schema = Joi.object({
      title: Joi.string().trim().required().min(2),
      logoUrl: Joi.string().trim().required().min(6),
    });

    const { value, error } = schema.validate(req.body);

    if (error) {
      return Responses.error(res, 400, error.details[0].message);
    } else {
      next();
    }
  };

  static newProject = async (req, res, next) => {
    const schema = Joi.object({
      title: Joi.string().trim().required().min(4),
      logoUrl: Joi.string().trim().required().min(6),
      description: Joi.string().trim().required().min(10),
      link: Joi.string().trim().required().min(6),
    });

    const { value, error } = schema.validate(req.body);

    if (error) {
      return Responses.error(res, 400, error.details[0].message);
    } else {
      next();
    }
  };

  static newExperience = async (req, res, next) => {
    const schema = Joi.object({
      title: Joi.string().trim().required().min(4),
      description: Joi.string().trim().required().min(10),
      startDate: Joi.string().trim().required().min(6),
      endDate: Joi.string().trim().required().min(6),
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
      email: Joi.string().trim().min(6),
      intro: Joi.string().trim().min(6),
      phone: Joi.string().trim().min(10),
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

  static updateContents = async (req, res, next) => {
     if (!Object.keys(req.body).length) {
      return Responses.error(res, 400, "You must provide the updated contents");
    } else {
      next();
    }
  }

  static updateSkill = async (req, res, next) => {
    const schema = Joi.object({
      title: Joi.string().trim().min(2),
      logoUrl: Joi.string().trim().min(6),
    });

    const { value, error } = schema.validate(req.body);

    if (error) {
      return Responses.error(res, 400, error.details[0].message);
    } else {
      next();
    }
  };

  static updateProject = async (req, res, next) => {
    const schema = Joi.object({
      title: Joi.string().trim().min(2),
      logoUrl: Joi.string().trim().min(6),
      description: Joi.string().trim().min(10),
      link: Joi.string().trim().min(6),
    });

    const { value, error } = schema.validate(req.body);

    if (error) {
      return Responses.error(res, 400, error.details[0].message);
    } else {
      next();
    }
  };

  static updateExperience = async (req, res, next) => {
    const schema = Joi.object({
      title: Joi.string().trim().min(4),
      description: Joi.string().trim().min(10),
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

  static validId = async (req, res, next) => {
    const id = req.params.id;

    if (id.length === 24) {
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
    } else {
      return Responses.error(res, 400, "The provided item id is incorrect");
    }
  };
}

export default Profile;
