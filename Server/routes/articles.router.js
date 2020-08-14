import express from "express";
import Articles from "../controllers/articles.controller.js";
import Middleware from "../middleware/articles.middleware.js";

const router = express.Router();

router.get("/", Articles.get);
router.get("/:id", Middleware.validId, Articles.getOne);
router.post("/", Middleware.newArticle, Articles.create);
router.patch("/:id", Middleware.validId, Middleware.update, Articles.update);
router.delete("/:id", Middleware.validId, Articles.delete);

export default router;
