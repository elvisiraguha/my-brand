import express from "express";
import Articles from "../controllers/articles.controller.js";
import Middleware from "../middleware/articles.middleware.js";
import Auth from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", Articles.get);
router.get("/:id", Middleware.validId, Articles.getOne);
router.post("/", Auth.checkToken, Middleware.newArticle, Articles.create);
router.patch(
  "/:id",
  Auth.checkToken,
  Middleware.validId,
  Middleware.update,
  Articles.update
);
router.delete("/:id", Auth.checkToken, Middleware.validId, Articles.delete);

export default router;
