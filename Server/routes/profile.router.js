import express from "express";
import Auth from "../middleware/auth.middleware.js";
import ProfileMiddleware from "../middleware/profile.middleware.js";
import CommonMiddleware from "../middleware/common.middleware.js";
import Profile from "../controllers/profile.controller.js";

const router = express.Router();

router.get("/", Profile.getItems);
router.get("/info", Profile.getInfo);
router.patch(
	"/info",
	Auth.checkToken,
	CommonMiddleware.hasContents,
	ProfileMiddleware.updateInfo,
	Profile.updateInfo
);

router.post(
	"/skills",
	Auth.checkToken,
	CommonMiddleware.hasContents,
	ProfileMiddleware.validateItem,
	Profile.createSkill
);
router.patch(
	"/skills/:id",
	Auth.checkToken,
	CommonMiddleware.validId,
	ProfileMiddleware.isItemExist,
	CommonMiddleware.hasContents,
	ProfileMiddleware.validateItem,
	Profile.updateSkill
);
router.delete(
	"/skills/:id",
	Auth.checkToken,
	CommonMiddleware.validId,
	ProfileMiddleware.isItemExist,
	Profile.deleteItem
);

router.post(
	"/experiences",
	Auth.checkToken,
	CommonMiddleware.hasContents,
	ProfileMiddleware.validateItem,
	Profile.createExperience
);
router.patch(
	"/experiences/:id",
	Auth.checkToken,
	CommonMiddleware.validId,
	ProfileMiddleware.isItemExist,
	CommonMiddleware.hasContents,
	ProfileMiddleware.validateItem,
	Profile.updateExperience
);
router.delete(
	"/experiences/:id",
	Auth.checkToken,
	ProfileMiddleware.isItemExist,
	CommonMiddleware.validId,
	Profile.deleteItem
);

router.post(
	"/projects",
	Auth.checkToken,
	CommonMiddleware.hasContents,
	ProfileMiddleware.validateItem,
	Profile.createProject
);
router.patch(
	"/projects/:id",
	Auth.checkToken,
	CommonMiddleware.validId,
	ProfileMiddleware.isItemExist,
	CommonMiddleware.hasContents,
	ProfileMiddleware.validateItem,
	Profile.updateProject
);
router.delete(
	"/projects/:id",
	Auth.checkToken,
	CommonMiddleware.validId,
	ProfileMiddleware.isItemExist,
	Profile.deleteItem
);

export default router;
