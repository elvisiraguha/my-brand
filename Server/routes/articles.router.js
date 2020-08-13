import express from "express";
import Articles from "../controllers/articles.controller.js";
import Middleware from "../middleware/articles.middleware.js";

const router = express.Router();

router.get("/", Articles.get);
router.get("/:id", Articles.getOne);
router.post("/", Middleware.newArticle, Articles.create);
router.patch("/:id", Middleware.update, Articles.update);
router.delete("/:id", Articles.delete);

export default router;
