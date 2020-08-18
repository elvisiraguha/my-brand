import User from "../models/User.model.js";
import Response from "../helpers/responses.js";
import UserHelper from "../helpers/user.helper.js";

class Auth {
  static signin = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return Response.error(res, 404, "User with given email is not found");
    }

    if (!UserHelper.comparePassword(req.body.password, user.password)) {
      return Response.error(res, 403, "Password don't match");
    }

    const token = await UserHelper.generateToken(user.email);
    Response.success(res, 200, "Signin successfully", { token });
  };
}

export default Auth;
