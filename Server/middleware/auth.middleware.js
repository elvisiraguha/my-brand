import jwt from "jsonwebtoken";
import Joi from "joi";
import "dotenv/config";
import User from "../models/User.model.js";
import Responses from "../helpers/responses";

class Auth {
   static signin = async (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().trim().required().min(6),
      password: Joi.string().trim().required().min(8),
      role: Joi.string().trim().required().min(4),
    });

    const { value, error } = schema.validate(req.body);

    if (error) {
      return Responses.error(res, 400, error.details[0].message);
    }
    next();
  };

  static checkToken = async (req, res, next) => {
    const { "x-auth-token": token } = req.headers;

    if (!token) {
      return Responses.error(res, 400, "No auth-token provided");
    }

    try {
      const userEmail = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ email: userEmail });

      if (!user) {
        return Responses.error(res, 404, "User with given email is not found");
      }

      next();
    } catch (error) {
      return Responses.error(res, 400, error.message);
    }
  };
}

export default Auth;
