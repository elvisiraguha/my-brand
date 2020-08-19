import "dotenv/config";
import User from "../models/User.model";
import UserHelper from "../helpers/user.helper.js";

(async function () {
  await User.deleteOne({ email: process.env.USER_EMAIL });
})();

const newUser = User({
  email: process.env.USER_EMAIL,
  password: UserHelper.hashPassword(process.env.USER_PASSWORD),
  role: process.env.USER_ROLE,
});

newUser.save();
