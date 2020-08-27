import "dotenv/config";
import User from "../models/User.model";
import UserHelper from "../helpers/user.helper.js";

User.deleteOne({ email: process.env.USER_EMAIL });

const newUser = new User({
	email: process.env.USER_EMAIL,
	password: UserHelper.hashPassword(process.env.USER_PASSWORD),
	role: process.env.USER_ROLE,
});

newUser.save();
