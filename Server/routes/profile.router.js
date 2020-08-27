import express from "express";
import Auth from "../middleware/auth.middleware.js";
import ProfileMiddleware from "../middleware/profile.middleware.js";
import Profile from "../controllers/profile.controller.js";

const router = express.Router();

router.get("/", Profile.getItems);
router.get("/info", Profile.getInfo);
router.patch(
	"/info",
	ProfileMiddleware.updateInfo,
	Auth.checkToken,
	Profile.updateInfo
);

router.post(
	"/skills",
	Auth.checkToken,
	ProfileMiddleware.newSkill,
	Profile.createSkill
);
router.patch(
	"/skills/:id",
	Auth.checkToken,
	ProfileMiddleware.validId,
	ProfileMiddleware.updateContents,
	ProfileMiddleware.updateSkill,
	Profile.updateSkill
);
router.delete(
	"/skills/:id",
	Auth.checkToken,
	ProfileMiddleware.validId,
	Profile.deleteItem
);

router.post(
	"/experiences",
	Auth.checkToken,
	ProfileMiddleware.newExperience,
	Profile.createExperience
);
router.patch(
	"/experiences/:id",
	Auth.checkToken,
	ProfileMiddleware.validId,
	ProfileMiddleware.updateContents,
	ProfileMiddleware.updateExperience,
	Profile.updateExperience
);
router.delete(
	"/experiences/:id",
	Auth.checkToken,
	ProfileMiddleware.validId,
	Profile.deleteItem
);

router.post(
	"/projects",
	Auth.checkToken,
	ProfileMiddleware.newProject,
	Profile.createProject
);
router.patch(
	"/projects/:id",
	Auth.checkToken,
	ProfileMiddleware.validId,
	ProfileMiddleware.updateContents,
	ProfileMiddleware.updateProject,
	Profile.updateProject
);
router.delete(
	"/projects/:id",
	Auth.checkToken,
	ProfileMiddleware.validId,
	Profile.deleteItem
);

export default router;
