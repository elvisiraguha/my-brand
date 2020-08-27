import express from "express";
import Articles from "../controllers/articles.controller.js";
import Comments from "../controllers/comments.controller.js";
import ArticleMiddleware from "../middleware/articles.middleware.js";
import CommonMiddleware from "../middleware/common.middleware.js";
import CommentMiddleware from "../middleware/comments.middleware.js";
import Auth from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", Articles.get);
router.get("/:id", CommonMiddleware.validId, Articles.getOne);
router.post(
	"/:id/comment",
	CommonMiddleware.validId,
	ArticleMiddleware.isArticleExist,
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
	CommonMiddleware.validId,
	ArticleMiddleware.isArticleExist,
	CommonMiddleware.hasContents,
	ArticleMiddleware.update,
	Articles.update
);
router.delete(
	"/:id",
	Auth.checkToken,
	CommonMiddleware.validId,
	ArticleMiddleware.isArticleExist,
	Articles.delete
);

export default router;
