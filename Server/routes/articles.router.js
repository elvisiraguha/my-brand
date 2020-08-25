import express from "express";
import Articles from "../controllers/articles.controller.js";
import Comments from "../controllers/comments.controller.js";
import ArticleMiddleware from "../middleware/articles.middleware.js";
import CommentMiddleware from "../middleware/comments.middleware.js";
import Auth from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", Articles.get);
router.get("/:id", ArticleMiddleware.validId, Articles.getOne);
router.post(
	"/:id/comment",
	ArticleMiddleware.validId,
	CommentMiddleware.existingArticle,
	CommentMiddleware.validate,
	Comments.create
);
router.post(
	"/",
	Auth.checkToken,
	ArticleMiddleware.newArticle,
	Articles.create
);
router.patch(
	"/:id",
	Auth.checkToken,
	ArticleMiddleware.validId,
	ArticleMiddleware.update,
	Articles.update
);
router.delete(
	"/:id",
	Auth.checkToken,
	ArticleMiddleware.validId,
	Articles.delete
);

export default router;
