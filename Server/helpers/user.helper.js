import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";

class UserHelper {
  static generateToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET);
  };

  static hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  };

  static comparePassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
  };
}

export default UserHelper;
