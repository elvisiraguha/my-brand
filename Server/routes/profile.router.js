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
  "/",
  Auth.checkToken,
  ProfileMiddleware.validQuery,
  CommonMiddleware.hasContents,
  ProfileMiddleware.validateItem,
  Profile.createItem
);

router.patch(
  "/:id",
  Auth.checkToken,
  CommonMiddleware.validId,
  ProfileMiddleware.isItemExist,
  CommonMiddleware.hasContents,
  ProfileMiddleware.validateItem,
  Profile.updateItem
);
router.delete(
  "/:id",
  Auth.checkToken,
  CommonMiddleware.validId,
  ProfileMiddleware.isItemExist,
  Profile.deleteItem
);

export default router;
